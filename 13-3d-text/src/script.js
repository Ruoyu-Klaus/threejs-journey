import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// const fontLoader = new THREE.FontLoader()

// fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
//   const textGeo = new THREE.TextBufferGeometry('Hello three.js', {
//     font,
//     size: 0.5,
//     height: 0.2,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 5,
//   })
//   const mat = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
//   const text = new THREE.Mesh(textGeo, mat)
//   scene.add(text)
//   textGeo.computeBoundingBox()
//   //   console.log(textGeometry.boundingBox);
//   //   textGeometry.translate(
//   //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
//   //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
//   //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
//   //   );
//   textGeo.center()

//   const donutGeo = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
//   for (let i = 0; i < 100; i++) {
//     const donut = new THREE.Mesh(donutGeo, mat)
//     scene.add(donut)
//     donut.position.copy(
//       new THREE.Vector3(
//         ky.randomNumberInRange(-0.5, 0.5) * 10,
//         ky.randomNumberInRange(-0.5, 0.5) * 10,
//         ky.randomNumberInRange(-0.5, 0.5) * 10
//       )
//     )
//     donut.rotation.x = ky.randomNumberInRange(0, 1) * ky.deg2rad(180)
//     donut.rotation.y = ky.randomNumberInRange(0, 1) * ky.deg2rad(180)
//     const scale = ky.randomNumberInRange(0, 1)
//     donut.scale.set(scale, scale, scale)
//   }
// })
