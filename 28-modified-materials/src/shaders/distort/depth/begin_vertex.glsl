float angle=sin(position.y+uTime)*.4;
mat2 rotateMat=rotate(angle);
transformed.xz=rotateMat*transformed.xz;