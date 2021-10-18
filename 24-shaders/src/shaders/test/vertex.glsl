// attribute vec3 position;
// attribute vec2 uv;
attribute float aRandom;

// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main(){
    // gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    // modelPosition.z+=sin(modelPosition.x*10.)*.1;
    // modelPosition.z+=aRandom*.1;
    float elevation=sin(modelPosition.x*uFrequency.x-uTime)*.1;
    elevation+=sin(modelPosition.y*uFrequency.y-uTime)*.1;
    modelPosition.z+=elevation;
    vec4 viewPostion=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPostion;
    gl_Position=projectedPosition;
    // vRandom=aRandom;
    vUv=uv;
    vElevation=elevation;
}