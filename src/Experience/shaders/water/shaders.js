export const vertexShader = /*glsl*/ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /*glsl*/ `
  uniform sampler2D noise;
  uniform sampler2D voronoi;
  uniform vec3 color;
  uniform float time;
  varying vec2 vUv;
  uniform sampler2D map;

  void main() {

   vec2 displacementUV = fract(vUv + vec2(time * 0.02, time * 0.03));
    float displacement = texture2D(noise, displacementUV).r;
    vec2 distortedUV = fract(vUv + (displacement - 0.5) * 0.08);
    

    vec2 noiseUV = fract(distortedUV + vec2(time * 0.05, time * 0.08));
    float noiseValue = texture2D(noise, noiseUV).r;
    

    vec2 voronoiUV = fract(distortedUV - vec2(time * 0.03, time * 0.04));
    float voronoiValue = texture2D(voronoi, voronoiUV).r;
    
    vec2 voronoiUV2 = fract(distortedUV * 1.5 - vec2(time * 0.04, time * 0.06));
    float voronoiValue2 = texture2D(voronoi, voronoiUV2).r;

    float caustic = voronoiValue * voronoiValue2;
    caustic = pow(caustic, 2.0) * 1.5;
    
 
    float waterPattern = noiseValue * 0.3 + caustic * 0.7;
    

    float depth = smoothstep(0.3, 0.8, waterPattern);
    

    vec3 lightWater = color * 3.;
    vec3 darkWater = color * 0.7;
    vec3 finalColor = mix(darkWater, lightWater, depth);
    
    finalColor += caustic * vec3(0.4, 0.6, 0.8) * 0.5;
    

    finalColor += displacement * 0.1;
    finalColor += noiseValue * 0.2;
    float angle = 3.14159 / 2.0;


  vec2 reflectionUv = vec2( distortedUV.x, 1.0 - distortedUV.y);
  vec2 centeredUv = reflectionUv  - 0.5;


  float cosA = cos(angle);
  float sinA = sin(angle);
  vec2 rotatedUv;
  rotatedUv.x = (centeredUv.x * cosA - centeredUv.y * sinA);
  rotatedUv.y = centeredUv.x * sinA + centeredUv.y * cosA;


  rotatedUv += 0.5;
  rotatedUv.y *= 0.3;
  rotatedUv.y += 0.5;
      
    vec3 reflection = texture2D(map, rotatedUv).rgb * 0.3;
    gl_FragColor = vec4(finalColor + reflection, 0.4 + caustic * 0.3);
  }
`;
