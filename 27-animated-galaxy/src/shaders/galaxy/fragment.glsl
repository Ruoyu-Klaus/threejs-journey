varying vec3 vColor;

float invert(float n){
    return 1.-n;
}

void main(){
    float strength=distance(gl_PointCoord,vec2(.5));
    strength=invert(strength);
    strength=pow(strength,10.);
    vec3 color=mix(vec3(0.),vColor,strength);
    gl_FragColor=vec4(color,1.);
}