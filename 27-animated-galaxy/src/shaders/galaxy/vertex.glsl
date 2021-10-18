uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    float angle=atan(modelPosition.x,modelPosition.z);
    float distanceToCenter=length(modelPosition.xz);
    float angleOffset=1./distanceToCenter*uTime*.2;
    angle+=angleOffset;
    modelPosition.x=cos(angle)*distanceToCenter;
    modelPosition.z=sin(angle)*distanceToCenter;
    modelPosition.xyz+=aRandomness;
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    gl_PointSize=uSize*aScale;
    gl_PointSize*=(1./-viewPosition.z);// three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    vColor=color;
}