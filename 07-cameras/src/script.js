import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// Canvas
const canvas = document.querySelector('canvas.webgl')

const materialParams = {
  color: 0xff0000,
  wireframe: true,
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  new THREE.MeshBasicMaterial({ ...materialParams })
)
scene.add(mesh)

// Create My Own Geometry (Triangle)
const myGeometry = new THREE.Geometry()
const vertices1 = new THREE.Vector3(2, 2, 0)
myGeometry.vertices.push(vertices1)
const vertices2 = new THREE.Vector3(2, 0, 0)
myGeometry.vertices.push(vertices2)
const vertices3 = new THREE.Vector3(4, 0, 0)
myGeometry.vertices.push(vertices3)

const face = new THREE.Face3(0, 1, 2)
myGeometry.faces.push(face)

const myGeometryMesh = new THREE.Mesh(
  myGeometry,
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)

scene.add(myGeometryMesh)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
)

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// Add damping effect
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener('mousemove', e => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = -(e.clientY / sizes.height - 0.5)
})

// GUI
const gui = new dat.GUI()
gui.add(mesh.position, 'y', -3, 3, 0.01)
gui.add(mesh, 'visible')
gui.add(mesh.material, 'wireframe')

gui.addColor(materialParams, 'color').onChange(() => {
  // update color
  mesh.material.color.set(materialParams.color)
})

const tick = () => {
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  // Update objects

  controls.update()

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
