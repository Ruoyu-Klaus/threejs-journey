#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

// https://thebookofshaders.com/10/
float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec2 grid(vec2 v,float row,float col,float xOffset,float yOffset){
    return vec2(floor((v.x+xOffset)*row)/row,floor((v.y+yOffset)*col)/col);
}

float invert(float n){
    return 1.-n;
}

vec2 rotate(vec2 uv,float rotation,vec2 mid)
{
    return vec2(
        cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x,
        cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y
    );
}

float angle(vec2 v){
    return atan(v.x,v.y);
}

float angleOffset(vec2 v,float offset){
    return atan(v.x-offset,v.y-offset);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.)+1.)*x,289.);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.-15.)+10.);
}

float cnoise(vec2 P)
{
    vec4 Pi=floor(P.xyxy)+vec4(0.,0.,1.,1.);
    vec4 Pf=fract(P.xyxy)-vec4(0.,0.,1.,1.);
    Pi=mod(Pi,289.);// To avoid truncation effects in permutation
    vec4 ix=Pi.xzxz;
    vec4 iy=Pi.yyww;
    vec4 fx=Pf.xzxz;
    vec4 fy=Pf.yyww;
    vec4 i=permute(permute(ix)+iy);
    vec4 gx=2.*fract(i*.0243902439)-1.;// 1/41 = 0.024...
    vec4 gy=abs(gx)-.5;
    vec4 tx=floor(gx+.5);
    gx=gx-tx;
    vec2 g00=vec2(gx.x,gy.x);
    vec2 g10=vec2(gx.y,gy.y);
    vec2 g01=vec2(gx.z,gy.z);
    vec2 g11=vec2(gx.w,gy.w);
    vec4 norm=1.79284291400159-.85373472095314*vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
    g00*=norm.x;
    g01*=norm.y;
    g10*=norm.z;
    g11*=norm.w;
    float n00=dot(g00,vec2(fx.x,fy.x));
    float n10=dot(g10,vec2(fx.y,fy.y));
    float n01=dot(g01,vec2(fx.z,fy.z));
    float n11=dot(g11,vec2(fx.w,fy.w));
    vec2 fade_xy=fade(Pf.xy);
    vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
    float n_xy=mix(n_x.x,n_x.y,fade_xy.y);
    return 2.3*n_xy;
}

vec4 pat1(){
    return vec4(vUv,1.,1.);
}

vec4 pat2(){
    return vec4(vUv,0.,1.);
}

vec4 pat3(){
    float strength=vUv.x;
    return vec4(vec3(strength),1.);
}

vec4 pat4(){
    float strength=vUv.y;
    return vec4(vec3(strength),1.);
}

vec4 pat5(){
    float strength=invert(vUv.y);
    return vec4(vec3(strength),1.);
}

vec4 pat6(){
    float strength=vUv.y*10.;
    return vec4(vec3(strength),1.);
}

vec4 pat7(){
    float strength=mod(vUv.y*10.,1.);
    return vec4(vec3(strength),1.);
}

vec4 pat8(){
    float strength=mod(vUv.y*10.,1.);
    strength=step(.5,strength);
    return vec4(vec3(strength),1.);
}

vec4 pat9(){
    float strength=mod(vUv.y*10.,1.);
    strength=step(.8,strength);
    return vec4(vec3(strength),1.);
}

vec4 pat10(){
    float strength=mod(vUv.x*10.,1.);
    strength=step(.8,strength);
    return vec4(vec3(strength),1.);
}

vec4 pat11(){
    float strengthX=step(.8,mod(vUv.x*10.,1.));
    float strengthY=step(.8,mod(vUv.y*10.,1.));
    float strength=clamp(strengthX+strengthY,0.,1.);
    return vec4(vec3(strength),1.);
}

vec4 pat12(){
    float strengthX=step(.8,mod(vUv.x*10.,1.));
    float strengthY=step(.8,mod(vUv.y*10.,1.));
    return vec4(vec3(strengthX*strengthY),1.);
}

vec4 pat13(){
    float strengthX=step(.4,mod(vUv.x*10.,1.));
    float strengthY=step(.8,mod(vUv.y*10.,1.));
    return vec4(vec3(strengthX*strengthY),1.);
}

vec4 pat14(){
    float strengthX=step(.4,mod(vUv.x*10.,1.))*step(.8,mod(vUv.y*10.,1.));
    float strengthY=step(.8,mod(vUv.x*10.,1.))*step(.4,mod(vUv.y*10.,1.));
    float strength=clamp(strengthX+strengthY,0.,1.);
    return vec4(vec3(strength),1.);
}

vec4 pat15(){
    float strengthX=step(.4,mod(vUv.x*10.-.2,1.))*step(.8,mod(vUv.y*10.,1.));
    float strengthY=step(.8,mod(vUv.x*10.,1.))*step(.4,mod(vUv.y*10.-.2,1.));
    float strength=clamp(strengthX+strengthY,0.,1.);
    return vec4(vec3(strength),1.);
}

vec4 pat16(){
    float strength=abs(vUv.x-.5);
    return vec4(vec3(strength),1.);
}

vec4 pat17(){
    float strength=min(abs(vUv.x-.5),abs(vUv.y-.5));
    return vec4(vec3(strength),1.);
}

vec4 pat18(){
    float strength=max(abs(vUv.x-.5),abs(vUv.y-.5));
    return vec4(vec3(strength),1.);
}

vec4 pat19(){
    float strength=step(.2,max(abs(vUv.x-.5),abs(vUv.y-.5)));
    return vec4(vec3(strength),1.);
}

vec4 pat20(){
    float strength=step(.2,max(abs(vUv.x-.5),abs(vUv.y-.5)));
    strength*=invert(step(.25,max(abs(vUv.x-.5),abs(vUv.y-.5))));
    return vec4(vec3(strength),1.);
}

vec4 pat21(){
    float strength=floor(vUv.x*10.)/10.;
    return vec4(vec3(strength),1.);
}

vec4 pat22(){
    float strength=floor(vUv.x*10.)/10.*floor(vUv.y*10.)/10.;
    return vec4(vec3(strength),1.);
}

vec4 pat23(){
    float strength=random(vUv);
    return vec4(vec3(strength),1.);
}

vec4 pat24(){
    float strength=random(grid(vUv,10.,10.,0.,0.));
    return vec4(vec3(strength),1.);
}

vec4 pat25(){
    float strength=random(grid(vUv,10.,10.,0.,vUv.x*.5));
    return vec4(vec3(strength),1.);
}

vec4 pat26(){
    float strength=length(vUv);
    return vec4(vec3(strength),1.);
}

vec4 pat27(){
    float strength=distance(vUv,vec2(.5));
    return vec4(vec3(strength),1.);
}

vec4 pat28(){
    float strength=invert(distance(vUv,vec2(.5)));
    return vec4(vec3(strength),1.);
}

vec4 pat29(){
    float strength=.015/distance(vUv,vec2(.5));
    return vec4(vec3(strength),1.);
}

vec4 pat30(){
    float strength=.15/distance(vec2(vUv.x,(vUv.y-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}

vec4 pat31(){
    float strength=.15/distance(vec2(vUv.x,(vUv.y-.5)*5.+.5),vec2(.5));
    strength*=.15/distance(vec2(vUv.y,(vUv.x-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}

vec4 pat32(){
    vec2 rUv=rotate(vUv,PI*.25,vec2(.5));
    float strength=.15/distance(vec2(rUv.x,(rUv.y-.5)*5.+.5),vec2(.5));
    strength*=.15/distance(vec2(rUv.y,(rUv.x-.5)*5.+.5),vec2(.5));
    return vec4(vec3(strength),1.);
}

vec4 pat33(){
    float strength=step(.5,distance(vUv,vec2(.5))+.25);
    return vec4(vec3(strength),1.);
}

vec4 pat34(){
    float strength=abs(distance(vUv,vec2(.5))-.25);
    return vec4(vec3(strength),1.);
}

vec4 pat35(){
    float strength=step(.02,abs(distance(vUv,vec2(.5))-.25));
    return vec4(vec3(strength),1.);
}

vec4 pat36(){
    float strength=invert(step(.02,abs(distance(vUv,vec2(.5))-.25)));
    return vec4(vec3(strength),1.);
}

vec4 pat37(){
    vec2 wavedUv=vec2(vUv.x,vUv.y+sin(vUv.x*30.)*.1);
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-.25)));
    return vec4(vec3(strength),1.);
}

vec4 pat38(){
    vec2 wavedUv=vec2(vUv.x+sin(vUv.y*30.)*.1,vUv.y+sin(vUv.x*30.)*.1);
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-.25)));
    return vec4(vec3(strength),1.);
}

vec4 pat39(){
    vec2 wavedUv=vec2(vUv.x+sin(vUv.y*100.)*.1,vUv.y+sin(vUv.x*100.)*.1);
    float radius=.25;
    float strength=invert(step(.01,abs(distance(wavedUv,vec2(.5))-radius)));
    return vec4(vec3(strength),1.);
}

vec4 pat40(){
    float strength=angle(vUv);
    return vec4(vec3(strength),1.);
}

vec4 pat41(){
    float strength=angleOffset(vUv,.5);
    return vec4(vec3(strength),1.);
}

vec4 pat42(){
    float strength=angleOffset(vUv,.5)/(PI*2.)+.5;
    return vec4(vec3(strength),1.);
}

vec4 pat43(){
    float angle=angleOffset(vUv,.5)/(PI*2.)+.5;
    float strength=mod(angle*20.,1.);
    return vec4(vec3(strength),1.);
}

vec4 pat44(){
    float angle=angleOffset(vUv,.5)/(PI*2.)+.5;
    float strength=sin(angle*100.);
    return vec4(vec3(strength),1.);
}

vec4 pat45(){
    float angle=angleOffset(vUv,.5)/(PI*2.)+.5;
    float radius=.25+sin(angle*100.)*.02;
    float strength=invert(step(.01,abs(distance(vUv,vec2(.5))-radius)));
    return vec4(vec3(strength),1.);
}

vec4 pat46(){
    float strength=cnoise(vUv*10.);
    return vec4(vec3(strength),1.);
}

vec4 pat47(){
    float strength=step(0.,cnoise(vUv*10.));
    return vec4(vec3(strength),1.);
}

vec4 pat48(){
    float strength=invert(abs(cnoise(vUv*10.)));
    return vec4(vec3(strength),1.);
}

vec4 pat49(){
    float strength=sin(cnoise(vUv*10.)*20.);
    return vec4(vec3(strength),1.);
}

vec4 pat50(){
    float strength=step(.9,sin(cnoise(vUv*10.)*20.));
    return vec4(vec3(strength),1.);
}

void main()
{
    // gl_FragColor=pat1();
    // gl_FragColor=pat2();
    // gl_FragColor=pat3();
    // gl_FragColor=pat4();
    // gl_FragColor=pat5();
    // gl_FragColor=pat6();
    // gl_FragColor=pat7();
    // gl_FragColor=pat8();
    // gl_FragColor=pat9();
    // gl_FragColor=pat10();
    // gl_FragColor=pat11();
    // gl_FragColor=pat13();
    // gl_FragColor=pat14();
    // gl_FragColor=pat15();
    // gl_FragColor=pat16();
    // gl_FragColor=pat17();
    // gl_FragColor=pat18();
    // gl_FragColor=pat19();
    // gl_FragColor=pat20();
    // gl_FragColor=pat21();
    // gl_FragColor=pat22();
    // gl_FragColor=pat23();
    // gl_FragColor=pat24();
    // gl_FragColor=pat25();
    // gl_FragColor=pat26();
    // gl_FragColor=pat27();
    // gl_FragColor=pat28();
    // gl_FragColor=pat29();
    // gl_FragColor=pat30();
    // gl_FragColor=pat31();
    // gl_FragColor=pat32();
    // gl_FragColor=pat33();
    // gl_FragColor=pat34();
    // gl_FragColor=pat35();
    // gl_FragColor=pat36();
    // gl_FragColor=pat37();
    // gl_FragColor=pat38();
    // gl_FragColor=pat39();
    // gl_FragColor=pat40();
    // gl_FragColor=pat41();
    // gl_FragColor=pat42();
    // gl_FragColor=pat43();
    // gl_FragColor=pat44();
    // gl_FragColor=pat45();
    // gl_FragColor=pat46();
    // gl_FragColor=pat47();
    // gl_FragColor=pat48();
    // gl_FragColor=pat49();
    // gl_FragColor=pat50();
    vec3 blackColor=vec3(0.);
    vec3 uvColor=vec3(vUv,1.);
    // vec3 strength=vec3(pat11());
    vec3 strength=vec3(pat39());
    vec3 mixedColor=mix(blackColor,uvColor,strength);
    gl_FragColor=vec4(mixedColor,1.);
}