import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Particles } from "./Particles/Particles";
import { Camera } from "./Camera";
import { FishingPool } from "./models/FishingPool";
import { Fishes } from "./entities/Fishes";
import { PlayerController } from "./PlayerController";

export const Experience = () => {
  return (
    <>
      <color attach="background" args={[0xffffff]} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -40, 0]} timeStep={"vary"}>
          <FishingPool />
          <PlayerController />
          <Fishes />
        </Physics>
      </Suspense>
      <Particles />
      <Camera/>
      <ambientLight intensity={4} />
      {/* <RenderTargetExample /> */}
    </>
  )
};