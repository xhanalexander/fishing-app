import { RigidBody } from "@react-three/rapier";

export const Track = () => {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1, 0.1, 20]} />
        <meshStandardMaterial color={"#ffca67"} />
      </mesh>
    </RigidBody>
  );
};
