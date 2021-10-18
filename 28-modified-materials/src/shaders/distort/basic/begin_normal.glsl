float angle=sin(position.y+uTime)*.4;
mat2 rotateMat=rotate(angle);
objectNormal.xz=objectNormal.xz*rotateMat;