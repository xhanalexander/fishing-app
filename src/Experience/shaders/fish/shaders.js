export const vertexShader = /*glsl*/`
uniform float atlasIndex;

varying vec2 VVUV;
void main() {
    VVUV = uv;
    
    csm_Position = position;
}
`;

export const fragmentShader = /*glsl*/ `
uniform sampler2D map;
uniform float atlasIndex;
uniform float isShadow;
uniform float uOpacity;
varying vec2 VVUV;

void main() {
    float tileCount = 4.0;
    float tileWidth = 1.0 / tileCount;
    
    vec2 uv = vec2(VVUV.x * tileWidth + atlasIndex * tileWidth, VVUV.y);
    
    vec4 texColor = texture2D(map, uv);
    if(texColor.a < 0.1){
        discard;
    }
    
    
    csm_DiffuseColor = texColor;
    csm_DiffuseColor.a = uOpacity;

        if(isShadow > 0.5){
        csm_DiffuseColor = vec4(vec3(0.2), 1.0);
    }
}
`;