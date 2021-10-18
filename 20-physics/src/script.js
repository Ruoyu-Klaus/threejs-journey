import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import ky from "kyouka";
import { World } from "cannon-es";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const world = new CANNON.World();

world.gravity.set(0, -9.82, 0);

world.broadphase = new CANNON.SAPBroadphase(world);

world.allowSleep = true;

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impact = collision.contact.getImpactVelocityAlongNormal();
  if (impact > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

// const concreteMat = new CANNON.Material("concrete");
// const plasticMat = new CANNON.Material("plastic");

// const concretePlasticContactMat = new CANNON.ContactMaterial(
//   concreteMat,
//   plasticMat,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );

// world.addContactMaterial(concretePlasticContactMat);

const objsToUpdate = [];

const geo = new THREE.SphereBufferGeometry(1, 20, 20);
const mat = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (r, pos) => {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(r, r, r);
  mesh.castShadow = true;
  mesh.position.copy(pos);
  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3().copy(pos),
    shape: new CANNON.Sphere(r),
  });
  world.addBody(body);

  body.addEventListener("collide", (col) => playHitSound(col));

  objsToUpdate.push({ mesh, body });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

// Create box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
  });
  body.position.copy(position);
  world.addBody(body);

  body.addEventListener("collide", (col) => playHitSound(col));

  // Save in objects
  objsToUpdate.push({ mesh, body });
};

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

const defaultMat = new CANNON.Material("default");
const defaultContactMat = new CANNON.ContactMaterial(defaultMat, defaultMat, {
  friction: 0.1,
  restitution: 0.7,
});
world.defaultContactMaterial = defaultContactMat;

// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: new CANNON.Sphere(0.5),
// });

// world.addBody(sphereBody);

const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  ky.deg2rad(90)
);

world.addBody(floorBody);

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  world.step(1 / 60);

  // sphere.position.copy(sphereBody.position);

  // wind
  // sphereBody.applyLocalForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

  objsToUpdate.forEach((obj) => {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

class Debug {
  createSphere() {
    createSphere(ky.randomNumberInRange(0, 0.5), {
      x: ky.randomNumberInRange(-0.5, 0.5) * 3,
      y: 3,
      z: ky.randomNumberInRange(-0.5, 0.5) * 3,
    });
  }
  createBox() {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  }
  reset() {
    objsToUpdate.forEach((obj) => {
      scene.remove(obj.mesh);
      world.removeBody(obj.body);
      obj.body.removeEventListener("collide", () => playHitSound());
    });
  }
}

const debug = new Debug();

gui.add(debug, "createSphere");
gui.add(debug, "createBox");
gui.add(debug, "reset");
