import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { AppearanceMode, RenderMode, VFXEmitter, VFXParticles } from "wawa-vfx";
import { NormalBlending, Vector3 } from "three";
import { useStore } from "../../store";
import {
  fishCaughtAnimationDuration,
  eventBus,
  waterHeight,
  fishCaughtPosition,
  EVENTS,
} from "../../utils";
import { useFrame } from "@react-three/fiber";

export const Bubbles = () => {
  const texture = useTexture("./assets/textures/bubble.png");
  const waveTexture = useTexture("./assets/textures/waves.png");
  const starTexture = useTexture("./assets/textures/star.png");
  const emitterRef = useRef(null);
  const splashRef = useRef(null);
  const emitter2Ref = useRef(null);
  const emitter3Ref = useRef(null);
  const emitter4Ref = useRef(null);
  const starRef = useRef(null);
  const waveRate = 0.15;
  const lastWaveTime = useRef(0);

  const didSplash = useRef(false);

  useEffect(() => {
    eventBus.on(EVENTS.FISH.CAUGHT, () => {
      const hookPosition = useStore.getState().hookPosition;
      splashRef.current?.emitAtPos(hookPosition.hook);
      starRef.current.startEmitting(true);
      setTimeout(() => {
        starRef.current.stopEmitting();
      }, fishCaughtAnimationDuration * 500);
    });
  }, []);
  useFrame((_, delta) => {
    lastWaveTime.current += delta;

    const hookPosition = useStore.getState().hookPosition;
    if (!hookPosition) return;

    if (hookPosition.hook.y < waterHeight) {
      if (!didSplash.current) {
        emitter4Ref.current?.emitAtPos(hookPosition.hook);
        didSplash.current = true;
      }

      const finalPosition = new Vector3(
        hookPosition.hook.x,
        hookPosition.hook.y,
        hookPosition.hook.z
      );
      const finalPosition2 = new Vector3(
        hookPosition.j5.x,
        waterHeight,
        hookPosition.j5.z
      );

      emitterRef.current?.emitAtPos(finalPosition);
      emitter2Ref.current?.emitAtPos(finalPosition2);

      if (lastWaveTime.current >= waveRate) {
        lastWaveTime.current = 0;
        emitter3Ref.current?.emitAtPos(finalPosition2);
      }
    } else {
      didSplash.current = false;
    }
  });
  return (
    <>
      <group position={fishCaughtPosition}>
        <VFXParticles
          name="stars"
          settings={{
            fadeAlpha: [0, 1],
            fadeSize: [1, 0],
            intensity: 3,
            nbParticles: 1000,
            renderMode: RenderMode.Billboard,
            gravity: [0, 0, 0],
            frustumCulled: false,
            // easeFunction: "easeOutPower3",
            blendingMode: NormalBlending,
          }}
          alphaMap={starTexture}
          frustumCulled={false}
        />
        <VFXEmitter
          ref={starRef}
          emitter="stars"
          autoStart={false}
          settings={{
            nbParticles: 1,
            loop: true,
            duration: 0.11,

            spawnMode: "time",
            startPositionMin: [-0.1, -1, -1],
            startPositionMax: [0.1, 1, 1],
            startRotationMin: [0, 0, 0],
            startRotationMax: [0, 0, 0],
            particlesLifetime: [0.3, 0.8],
            speed: [0, 0],
            colorStart: ["#ffeb91"],
            directionMin: [0, 0, 0],
            directionMax: [-0, 0, 0],
            rotationSpeedMin: [0, 0, -10],
            rotationSpeedMax: [0, 0, 10],
            size: [3, 5],
          }}
        />
      </group>
      <VFXParticles
        name="bubble2"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [1, 0],
          intensity: 100000,
          nbParticles: 1000,
          renderMode: RenderMode.Billboard,
          gravity: [0, -40, 0],
          frustumCulled: false,
          // easeFunction: "easeOutPower3",
          blendingMode: NormalBlending,
        }}
        alphaMap={texture}
        frustumCulled={false}
      />
      <VFXEmitter
        ref={splashRef}
        emitter="bubble2"
        autoStart={false}
        settings={{
          nbParticles: 1000,
          spawnMode: "burst",
          startPositionMin: [-0.2, 0, -0.2],
          startPositionMax: [0.2, 0, 0.2],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [1, 1.5],
          speed: [10, 30],
          colorStart: ["#ffffff"],
          directionMin: [-1, 0.5, -1],
          directionMax: [1, 1, 1],
          rotationSpeedMin: [0, 0, -1],
          rotationSpeedMax: [0, 0, 1],
          size: [1, 5],
        }}
      />
      <VFXParticles
        name="bubble"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [1, 0],
          intensity: 100,
          nbParticles: 1000,
          renderMode: RenderMode.Billboard,
          gravity: [0, 1, 0],
          frustumCulled: false,
          easeFunction: "easeOutPower3",
          blendingMode: NormalBlending,
        }}
        alphaMap={texture}
        frustumCulled={false}
      />
      <VFXEmitter
        ref={emitterRef}
        emitter="bubble"
        autoStart={false}
        settings={{
          nbParticles: 1,
          spawnMode: "burst",
          startPositionMin: [-0.2, 0, -0.2],
          startPositionMax: [0.2, 0, 0.2],
          startRotationMin: [0, 0, -1],
          startRotationMax: [0, 0, 1],
          particlesLifetime: [0.5, 2.5],
          speed: [0.1, 0.3],
          colorStart: ["#ffffff"],
          directionMin: [-1, 0, -1],
          directionMax: [1, 0, 1],
          rotationSpeedMin: [0, 0, -1],
          rotationSpeedMax: [0, 0, 1],
          size: [1, 2],
        }}
      />
      <VFXParticles
        name="enter"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [0, 0],
          intensity: 100,
          nbParticles: 100,
          renderMode: RenderMode.Mesh,
          gravity: [0, 0, 0],
          frustumCulled: false,
          //   easeFunction: "easeOutPower3",
          blendingMode: NormalBlending,
          appearance: AppearanceMode.Circular,
        }}
        frustumCulled={false}
      />
      <VFXEmitter
        ref={emitter2Ref}
        emitter="enter"
        autoStart={false}
        settings={{
          nbParticles: 1,
          spawnMode: "burst",
          startPositionMin: [-0, 0, -0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [-Math.PI / 2, 0, -1],
          startRotationMax: [-Math.PI / 2, 0, 1],
          particlesLifetime: [1, 1],
          speed: [0, 0],
          colorStart: ["#ffffff"],
          directionMin: [-1, 0, -1],
          directionMax: [1, 0, 1],
          rotationSpeedMin: [0, 0, -1],
          rotationSpeedMax: [0, 0, 1],
          size: [0.4, 0.4],
        }}
      />
      <VFXParticles
        name="waves"
        settings={{
          fadeAlpha: [0, 0],
          fadeSize: [1, 1],
          intensity: 100,
          nbParticles: 100,
          renderMode: RenderMode.Mesh,
          gravity: [0, 0, 0],
          frustumCulled: false,
          //   easeFunction: "easeOutPower3",
          blendingMode: NormalBlending,
          appearance: AppearanceMode.Circular,
        }}
        frustumCulled={false}
        alphaMap={waveTexture}
      />
      <VFXEmitter
        ref={emitter3Ref}
        emitter="waves"
        autoStart={false}
        settings={{
          nbParticles: 1,
          spawnMode: "burst",
          startPositionMin: [-0, 0, -0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [-Math.PI / 2, 0, 0],
          startRotationMax: [-Math.PI / 2, 0, 0],
          particlesLifetime: [1, 1],
          speed: [0, 0],
          colorStart: ["#ffffff"],
          directionMin: [-1, 0, -1],
          directionMax: [1, 0, 1],
          rotationSpeedMin: [0, 0, -1],
          rotationSpeedMax: [0, 0, 1],
          size: [2.5, 2.5],
        }}
      />
      <VFXParticles
        name="splash"
        settings={{
          fadeAlpha: [0, 1],
          fadeSize: [1, 0],
          intensity: 100,
          nbParticles: 1000,
          renderMode: RenderMode.Billboard,
          gravity: [0, -20, 0],
          frustumCulled: false,
          //   easeFunction: "easeOutPower3",
          blendingMode: NormalBlending,
          appearance: AppearanceMode.Circular,
        }}
        // alphaMap={texture}
        frustumCulled={false}
      />
      <VFXEmitter
        ref={emitter4Ref}
        emitter="splash"
        autoStart={false}
        settings={{
          nbParticles: 24,
          spawnMode: "burst",
          startPositionMin: [-0.2, 0, -0.2],
          startPositionMax: [0.2, 0, 0.2],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          particlesLifetime: [0.3, 0.8],
          speed: [1, 8],
          colorStart: ["#ffffff"],
          directionMin: [-1, 0.5, -1],
          directionMax: [1, 1, 1],
          rotationSpeedMin: [0, 0, -1],
          rotationSpeedMax: [0, 0, 1],
          size: [0.3, 1],
        }}
      />
    </>
  );
};
