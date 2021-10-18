// precision mediump float;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTexture;

void main(){
    // gl_FragColor=vec4(uColor,1.);
    vec4 textureColor=texture2D(uTexture,vUv);
    textureColor.rgb*=vElevation*2.+.5;
    gl_FragColor=textureColor;
}