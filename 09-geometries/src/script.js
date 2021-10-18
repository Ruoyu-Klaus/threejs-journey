import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ky from "kyouka";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.Geometry();
// for (let i = 0; i < 50; i++) {
//   for (let j = 0; j < 3; j++) {
//     const randX = ky.randomNumberInRange(-0.5, 0.5) * 4;
//     const randY = ky.randomNumberInRange(-0.5, 0.5) * 4;
//     const randZ = ky.randomNumberInRange(-0.5, 0.5) * 4;
//     const vert = new THREE.Vector3(randX, randY, randZ);
//     geometry.vertices.push(vert);
//   }
//   const vertI = i * 3;
//   geometry.faces.push(new THREE.Face3(vertI, vertI + 1, vertI + 2));
// }
const geometry = new THREE.BufferGeometry();
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = ky.randomNumberInRange(-0.5, 0.5) * 4;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
