import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "dat.gui";
import distortCommonShader from "./shaders/distort/common.glsl";
import distortBasicBeginNormalVertexShader from "./shaders/distort/basic/begin_normal.glsl";
import distortBasicBeginVertexShader from "./shaders/distort/basic/begin_vertex.glsl";
import distortDepthBeginVertexShader from "./shaders/distort/depth/begin_vertex.glsl";

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
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load("/models/LeePerrySmith/color.jpg");
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load("/models/LeePerrySmith/normal.jpg");

// Material
const customUniforms = {
  uTime: {
    value: 0,
  },
};

const COMMON_SHADER_CHUNK = "#include <common>";
const BEGIN_NORMAL_VERTEX_CHUNK = "#include <beginnormal_vertex>";
const BEGIN_VERTEX_CHUNK = "#include <begin_vertex>";
const MODIFIRED_COMMON_SHADER_CHUNK = `
${COMMON_SHADER_CHUNK}
${distortCommonShader}`;
const MODIFIRED_BASIC_BEGIN_NORMAL_VRETEX_CHUNK = `
${BEGIN_NORMAL_VERTEX_CHUNK}
${distortBasicBeginNormalVertexShader}`;
const MODIFIRED_BASIC_BEGIN_VERTEX_CHUNK = `
${BEGIN_VERTEX_CHUNK}
${distortBasicBeginVertexShader}`;
const MODIFIRED_DEPTH_BEGIN_VERTEX_CHUNK = `
${BEGIN_VERTEX_CHUNK}
${distortDepthBeginVertexShader}`;
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
});
const matHook = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader
    .replace(COMMON_SHADER_CHUNK, MODIFIRED_COMMON_SHADER_CHUNK)
    .replace(
      BEGIN_NORMAL_VERTEX_CHUNK,
      MODIFIRED_BASIC_BEGIN_NORMAL_VRETEX_CHUNK
    )
    .replace(BEGIN_VERTEX_CHUNK, MODIFIRED_BASIC_BEGIN_VERTEX_CHUNK);
  console.log(shader);
};
material.onBeforeCompile = matHook;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
);
plane.rotation.y = Math.PI;
plane.position.y = -5;
plane.position.z = 5;
scene.add(plane);

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});
const depthMatHook = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader
    .replace(COMMON_SHADER_CHUNK, MODIFIRED_COMMON_SHADER_CHUNK)
    .replace(BEGIN_VERTEX_CHUNK, MODIFIRED_DEPTH_BEGIN_VERTEX_CHUNK);
  console.log(shader);
};
depthMaterial.onBeforeCompile = depthMatHook;

/**
 * Models
 */
gltfLoader.load("/models/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
  // Model
  const mesh = gltf.scene.children[0];
  mesh.rotation.y = Math.PI * 0.5;
  mesh.material = material;
  mesh.customDepthMaterial = depthMaterial;
  scene.add(mesh);

  // Update materials
  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  customUniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
