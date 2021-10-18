import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

const dirLight = new THREE.DirectionalLight("#ffffff", 3);
dirLight.position.set(0.25, 3, -2.25);
scene.add(dirLight);

gui
  .add(dirLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui.add(dirLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
gui.add(dirLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
gui.add(dirLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");

const gltfLoader = new GLTFLoader();
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   const helmet = gltf.scene;
//   helmet.scale.set(10, 10, 10);
//   helmet.position.set(0, -4, 0);
//   helmet.rotation.y = THREE.MathUtils.degToRad(90);
//   scene.add(helmet);
//   gui
//     .add(helmet.rotation, "y")
//     .min(-Math.PI)
//     .max(Math.PI)
//     .step(0.001)
//     .name("rotation");
//   updateAllMats();
// });
gltfLoader.load("/models/hamburger.glb", (gltf) => {
  const burger = gltf.scene;
  burger.scale.set(0.3, 0.3, 0.3);
  burger.position.set(0, -1, 0);
  scene.add(burger);
  updateAllMats();
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
scene.background = envMap;
scene.environment = envMap;
envMap.encoding = THREE.sRGBEncoding;

const updateAllMats = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      console.log(child);
      child.material.envMap = envMap;
      child.material.envMapIntensity = debug.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

class Debug {
  constructor() {
    this.envMapIntensity = 5;
  }
}

const debug = new Debug();

gui
  .add(debug, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onFinishChange(updateAllMats);

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
dirLight.castShadow = true;

// const dirLightCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera)
// scene.add(dirLightCameraHelper)

dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.far = 15;
dirLight.shadow.normalBias = 0.05;

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMats();
  });

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
