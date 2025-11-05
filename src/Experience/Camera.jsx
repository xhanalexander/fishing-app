import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { EVENTS, eventBus, fishCaughtPosition, fishCaughtAnimationDuration } from "../utils";
import gsap from "gsap";

export const Camera = () => {
  const cameraLookAtRef = useRef();

  return (
    <>
      <group ref={cameraLookAtRef}></group>
      <PerspectiveCamera
        makeDefault={true}
        rotation={[0, Math.PI / 2, 0]}
        position={[10, 10, 0]}
        fov={50}
      />
    </>
  );
};
