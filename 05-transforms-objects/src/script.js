import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

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
group.scale.y = 2;
group.rotation.y = 0.2;

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
