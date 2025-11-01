import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Color } from "three";
import { noiseTexture, voronoiTexture } from "../textures";
import { vertexShader, fragmentShader } from "../shaders/water/shaders";
// import { useStore } from "./store";

export function Water({ position = [0, 0, 0], scale = [1, 1, 1] }) {
  const materialRef = useRef();
  const uniforms = useMemo(
    () => ({
      noise: { value: noiseTexture },
      voronoi: { value: voronoiTexture },
      color: { value: new Color("#cde0f0") },
      time: { value: 0 },
      map: { value: null },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
    // const texture = useStore.getState().renderTexture
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    //   materialRef.current.uniforms.map.value = texture
      materialRef.current.uniformsNeedUpdate = true;
      
    }
  });

  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      >
   
      </shaderMaterial>
      <planeGeometry args={[0.7, 1.6]} />
    </mesh>
  );
}
