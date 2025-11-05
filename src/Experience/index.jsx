import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Camera } from "./Camera";
import { Track } from "./Track";
import { OrbitControls } from "@react-three/drei";
import { Pin } from "./Pin";


export const Experience = () => {
  return (
    <>
      <color attach="background" args={[0xffffff]} />
      <Suspense fallback={null}>
        <Physics debug gravity={[0, -40, 0]} timeStep={"vary"}>
          {/* <FishingPool />
          <PlayerController />
          <Fishes /> */}
          <Pin/>
          <Track/>
        </Physics>
      </Suspense>
      {/* <Particles /> */}
      {/* <Camera/> */}
      <OrbitControls />
      <ambientLight intensity={4} />
      <directionalLight position={[0, 0, 10]} intensity={10} />
      {/* <RenderTargetExample /> */}
    </>
  )
};