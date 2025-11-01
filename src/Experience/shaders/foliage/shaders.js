export const vertexShader = /*glsl*/ `
  uniform float time;
  uniform float amplitude; 

  varying vec2 vUv;


  void main() {
    vUv = uv;

    vec3 displacedPosition = position;

    float factor = pow(1. - uv.y, 10.);

    displacedPosition.y += sin(uv.y * 10.0 + time) * amplitude * factor;
    displacedPosition.x += cos(uv.y * 10.0 + time) * amplitude * factor;
    // displacedPosition.y += cos(uv.y * 10.0 + time) * amplitude * factor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }
`

export const fragmentShader = /*glsl*/ `
  uniform sampler2D map;
  varying vec2 vUv;

  void main() {


    gl_FragColor = texture2D(map, vUv);
  }
`
