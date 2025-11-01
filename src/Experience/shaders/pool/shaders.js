export const vertexShader = /*glsl*/`
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fragmentShader = /*glsl*/ `
uniform sampler2D map;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  gl_FragColor = texture2D(map, vUv);
  if(vPosition.y < 0.82){
    gl_FragColor = vec4(vec3(0.8), 1.0);
  }
}
`