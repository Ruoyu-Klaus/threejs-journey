import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// const mat = new THREE.MeshBasicMaterial({map: doorColorTexture});
// mat.color = new THREE.Color(0xff0000)
// mat.wireframe = true;
// mat.transparent = true;
// mat.opacity = 0.5
// mat.alphaMap = doorAlphaTexture;
// mat.side = THREE.DoubleSide;

// const mat = new THREE.MeshNormalMaterial()
// mat.flatShading = true;

// const mat = new THREE.MeshMatcapMaterial();
// mat.matcap = matcapTexture

// const mat = new THREE.MeshDepthMaterial();

// const mat = new THREE.MeshLambertMaterial()

// const mat = new THREE.MeshPhongMaterial()
// mat.shininess = 100;
// mat.specular = new THREE.Color(0x1188ff)

// const mat = new THREE.MeshToonMaterial()
// mat.gradientMap = gradientTexture;

// const mat = new THREE.MeshStandardMaterial();
// mat.metalness = 0;
// mat.roughness = 1;
// mat.map = doorColorTexture;

const mat = new THREE.MeshStandardMaterial()
mat.metalness = 0.7;
mat.roughness = 0.2;

const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
mat.envMap = envMapTexture

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), mat);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 100, 100), mat);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
  mat
);
torus.position.x = 1.5;

const meshes = [sphere, plane, torus];

// meshes.forEach((mesh) => {
//   mesh.geometry.setAttribute(
//     "uv2",
//     new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
//   );
// });
// mat.aoMap = doorAmbientOcclusionTexture
// mat.aoMapIntensity = 1
// mat.displacementMap = doorHeightTexture
// mat.displacementScale = 0.05
// mat.metalnessMap = doorMetalnessTexture
// mat.roughnessMap = doorRoughnessTexture
// mat.normalMap = doorNormalTexture
// mat.normalScale.set(0.5, 0.5)
// mat.transparent = true
// mat.alphaMap = doorAlphaTexture

scene.add(...meshes);

const ambiLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambiLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  meshes.forEach((mesh) => {
    mesh.rotation.x = 0.15 * elapsedTime;
    mesh.rotation.y = 0.1 * elapsedTime;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const gui = new dat.GUI();
gui.add(mat, "metalness").min(0).max(1).step(0.0001);
gui.add(mat, "roughness").min(0).max(1).step(0.0001);
