import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ky from "kyouka";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
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

const dimension = 3;

const params = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

let geo = null;
let mat = null;
let points = null;

const generateGalaxy = () => {
  if (points) {
    geo.dispose();
    mat.dispose();
    scene.remove(points);
  }

  geo = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * dimension);
  const colors = new Float32Array(params.count * dimension);

  for (let i = 0; i < params.count; i++) {
    const group = i * dimension;
    const r = ky.randomNumberInRange(0, 1) * params.radius;
    const branchAngle =
      ((i % params.branches) / params.branches) * ky.deg2rad(360);
    const spinAngle = params.spin * r;
    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      r;
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      r;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      r;
    positions[group] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[group + 1] = randomY;
    positions[group + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    const colorInside = new THREE.Color(params.insideColor);
    const colorOutside = new THREE.Color(params.outsideColor);
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, r / params.radius);
    colors[group] = mixedColor.r;
    colors[group + 1] = mixedColor.g;
    colors[group + 2] = mixedColor.b;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, dimension));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, dimension));

  mat = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geo, mat);
  scene.add(points);
};

generateGalaxy();

gui
  .add(params, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "radius")
  .min(0.001)
  .max(20)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(params, "randomnessPower")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy);
