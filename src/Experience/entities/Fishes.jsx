import { InstancedMesh2 } from "@three.ez/instanced-mesh";
import {
  MeshStandardMaterial,
  Quaternion,
  Vector3,
  Euler,
  DoubleSide,
} from "three";
import { useGLTF } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import CSM from "three-custom-shader-material/vanilla";
import { useRapier } from "@react-three/rapier";
import { vertexShader, fragmentShader } from "../shaders/fish/shaders";
import {
  EVENTS,
  eventBus,
  fishCaughtAnimationDuration,
  fishCaughtPosition,
} from "@/utils";

extend({ InstancedMesh2 });

const FISH_CONFIG = {
  maxPos: 7,
  y: 0.4,
  colliderRadius: 0.4,
  scale: 0.5,
  baseSpeed: 0.6,
  fleeSpeedMultiplier: 15,
  shadowY: -0.4,
  captureAnimationDuration: 3,
  atlas: [0, 0.6, 1.15, 1.7],
};

const ANIMATION = {
  lerpSpeed: 3,
  swimFrequency: 18,
  captureScaleSpeed: 4,
};

const FISH_STATES = {
  IDLE: "idle",
  HOOKED: "hooked",
  CAUGHT: "caught",
};

const createFishMaterial = (firstMaterial) =>
  new CSM({
    baseMaterial: MeshStandardMaterial,
    uniforms: {
      map: { value: firstMaterial.map },
      atlasIndex: { value: 0 },
      isShadow: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader,
    fragmentShader,
    side: DoubleSide,
  });

const getRandomPosition = () => ({
  x: Math.random() * FISH_CONFIG.maxPos - FISH_CONFIG.maxPos / 2,
  z: Math.random() * FISH_CONFIG.maxPos - FISH_CONFIG.maxPos / 2,
  yOffset: Math.random() * 0.4 - 0.2,
});

const getRandomAtlasIndex = () =>
  FISH_CONFIG.atlas[Math.floor(Math.random() * FISH_CONFIG.atlas.length)];

const createFishUserData = (i, obj) => ({
  name: `fish-${i}`,
  type: "fish",
  index: i,
  hook: () => (obj.state = FISH_STATES.HOOKED),
  unHook: () => (obj.state = FISH_STATES.IDLE),
  catch: () => (obj.state = FISH_STATES.CAUGHT),
});

const moveForward = (obj, delta) => {
  if (!obj.rb || obj.timeForward <= 0) return;

  const direction = new Vector3(-1, 0, 0);
  direction.applyQuaternion(obj.baseQuaternion);
  direction.y = 0;
  direction.normalize();

  obj.rb.setLinvel(
    {
      x: direction.x * FISH_CONFIG.baseSpeed * obj.timeForward,
      y: 0,
      z: direction.z * FISH_CONFIG.baseSpeed * obj.timeForward,
    },
    true
  );
  obj.timeForward -= delta;
};

const rotateObject = (obj, delta, time) => {

  if (obj.targetY === 0 && obj.timeForward <= 0) {
    obj.targetY = Math.random() * Math.PI * 2 * (Math.random() * 2 - 1);
    obj.targetQuaternion.setFromEuler(new Euler(0, obj.targetY, 0));
  }

  // Interpolate to target rotation
  if (obj.targetY !== 0) {
    obj.baseQuaternion.slerp(obj.targetQuaternion, delta * ANIMATION.lerpSpeed);

    if (obj.baseQuaternion.angleTo(obj.targetQuaternion) < 0.001) {
      obj.targetY = 0;
      obj.timeForward = Math.random() * 3 + 0.5;
    }
  }

  const swimAngle = Math.sin(time * ANIMATION.swimFrequency) * obj.swimAmplitude * obj.timeForward;
  const swimQuaternion = new Quaternion().setFromEuler(new Euler(0, swimAngle, 0));
  obj.quaternion.copy(obj.baseQuaternion).multiply(swimQuaternion);
};

const flee = (obj, delta, time) => {
  if (!obj.rb) return;

  const direction = new Vector3(-1, 0, 0);
  direction.applyQuaternion(obj.baseQuaternion);
  direction.y = 0;
  direction.normalize();

  obj.rb.setLinvel(
    {
      x: direction.x * FISH_CONFIG.baseSpeed * FISH_CONFIG.fleeSpeedMultiplier,
      y: 0,
      z: direction.z * FISH_CONFIG.baseSpeed * FISH_CONFIG.fleeSpeedMultiplier,
    },
    true
  );

  obj.targetY += Math.sin(time) * Math.PI * 2;
  obj.targetQuaternion.setFromEuler(new Euler(0, obj.targetY, 0));

  if (obj.targetY !== 0) {
    obj.baseQuaternion.slerp(obj.targetQuaternion, delta * ANIMATION.lerpSpeed);

    if (obj.baseQuaternion.angleTo(obj.targetQuaternion) < 0.001) {
      obj.targetY = 0;
      obj.timeForward = Math.random() * 3 + 0.5;
    }
  }

  const swimAngle = Math.sin(time * ANIMATION.swimFrequency) * obj.swimAmplitude * obj.timeForward;
  const swimQuaternion = new Quaternion().setFromEuler(new Euler(0, swimAngle, 0));
  obj.quaternion.copy(obj.baseQuaternion).multiply(swimQuaternion);
};

const syncPositionWithPhysics = (obj) => {
  if (!obj.rb || !obj.position.x) return;
  
  const rb = obj.rb;
  obj.position.x = rb.translation().x;
  obj.position.y = rb.translation().y;
  obj.position.z = rb.translation().z;
};

export const Fishes = () => {
  const { nodes, materials } = useGLTF("./assets/models/fishes.glb");
  const geometry = nodes.Plane.geometry;
  const firstMaterial = materials["Material.001"];
  const { rapier, world } = useRapier();

  const ref = useRef();
  const shadowRef = useRef();
  const material = createFishMaterial(firstMaterial);

  const initializeFish = (obj, i) => {
    const { x, z, yOffset } = getRandomPosition();
    obj.position.set(x + 1, FISH_CONFIG.y + yOffset, z);

    const rigidBodyDesc = rapier.RigidBodyDesc.dynamic()
      .setTranslation(obj.position.x, obj.position.y, obj.position.z)
      .setGravityScale(0);
    const rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = rapier.ColliderDesc.ball(FISH_CONFIG.colliderRadius);
    const collider = world.createCollider(colliderDesc, rigidBody);
    collider.setActiveCollisionTypes(rapier.ActiveCollisionTypes.FIXED_FIXED);

    obj.state = FISH_STATES.IDLE;
    obj.rb = rigidBody;
    obj.rb.userData = createFishUserData(i, obj);

    obj.rotateY(Math.random() * Math.PI * 2);
    obj.scale.set(FISH_CONFIG.scale, FISH_CONFIG.scale, FISH_CONFIG.scale);
    obj.atlasIndex = getRandomAtlasIndex();
    obj.setUniform("atlasIndex", obj.atlasIndex);


    obj.timeForward = Math.random() * 3;
    obj.targetY = 0;
    obj.targetQuaternion = new Quaternion();
    obj.baseQuaternion = new Quaternion();
    obj.swimSpeed = 3 + Math.random() * 2;
    obj.swimAmplitude = Math.random() * 0.15;
    obj.timeOffset = Math.random() * Math.PI * 2;
    obj.animationTime = 0;
    obj.id = i;
    obj.opacity = 1;


    createShadow(obj, x, z);
  };

  const createShadow = (fishObj, x, z) => {
    shadowRef.current.addInstances(1, (shadowObj) => {
      shadowObj.position.set(x + 1, FISH_CONFIG.shadowY, z);
      shadowObj.quaternion.copy(fishObj.quaternion);
      shadowObj.scale.set(FISH_CONFIG.scale, FISH_CONFIG.scale, FISH_CONFIG.scale);
      shadowObj.shadowY = FISH_CONFIG.shadowY;
      shadowObj.fishId = fishObj.id;
      shadowObj.obj = fishObj;
      shadowObj.setUniform("isShadow", 1);
      shadowObj.setUniform("atlasIndex", fishObj.atlasIndex);
    });
  };

  const spawnFish = (number) => {
    ref.current.addInstances(number, initializeFish);
  };

  const capture = (obj, delta, world) => {
    if (obj.rb) {
      obj.rb.setEnabled(false);
      world.removeRigidBody(obj.rb);
      eventBus.emit(EVENTS.FISH.CAUGHT);
      obj.rb = null;
      spawnFish(Math.floor(Math.random() * 8));
    }

    const targetQuaternion = new Quaternion().setFromEuler(
      new Euler(Math.PI / 2, 0, -Math.PI / 2)
    );

    if (obj.animationTime >= fishCaughtAnimationDuration / 3) {
      obj.scale.lerp(new Vector3(0, 0, 0), delta * ANIMATION.captureScaleSpeed);
    }

    obj.position.lerp(fishCaughtPosition, delta * ANIMATION.captureScaleSpeed);
    obj.quaternion.slerp(targetQuaternion, delta * ANIMATION.captureScaleSpeed);
  };

  const updateShadow = (shadowObj, i) => {
    const fishObj = ref.current.instances[i];
    if (!fishObj) return;

    shadowObj.position.x = fishObj.position.x;
    shadowObj.position.z = fishObj.position.z;
    shadowObj.quaternion.copy(fishObj.quaternion);
  };


  useEffect(() => {
    if (!ref.current) return;

    ref.current.initUniformsPerInstance({
      fragment: { atlasIndex: "float", isShadow: "float", uOpacity: "float" },
    });
    shadowRef.current.initUniformsPerInstance({
      fragment: { atlasIndex: "float", isShadow: "float" },
    });
    spawnFish(10);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    ref.current.updateInstances((obj) => {
      switch (obj.state) {
        case FISH_STATES.IDLE:
          moveForward(obj, delta);
          rotateObject(obj, delta, time);
          syncPositionWithPhysics(obj);
          break;

        case FISH_STATES.HOOKED:
          flee(obj, delta, time);
          syncPositionWithPhysics(obj);
          break;

        case FISH_STATES.CAUGHT:
          capture(obj, delta, world);
          obj.animationTime += delta;
          break;
      }

      if (obj.animationTime >= FISH_CONFIG.captureAnimationDuration) {
        obj.remove();
      }
    });

    shadowRef.current.updateInstances(updateShadow);
  });

  return (
    <>
      <instancedMesh2
        ref={ref}
        args={[geometry, material, { createEntities: true }]}
        frustumCulled={false}
      />
      <instancedMesh2
        ref={shadowRef}
        args={[geometry, material, { createEntities: true }]}
      />
    </>
  );
};