import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh1 = new THREE.Mesh(geometry, material);
mesh1.position.x = -1.5;
const mesh2 = new THREE.Mesh(geometry, material);
const mesh3 = new THREE.Mesh(geometry, material);
mesh3.position.x = 1.5;

const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);
group.add(mesh3);
scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  555
);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//Animation
// const clock = new THREE.Clock();

gsap.to(group.position, { duration: 1, delay: 1, x: 1 });
gsap.to(group.position, { duration: 1, delay: 2, x: 0 });

const tick = () => {
  // Clock
  // const elapsedTime = clock.getElapsedTime();

  // Update Objects
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime);

  // camera.lookAt(group.position);

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
