import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"

const fitCameraToObject = function (camera, object, offset, controls) {
  offset = offset || 1.25

  const boundingBox = new THREE.Box3()

  // get bounding box of object - this will be used to setup controls and camera
  boundingBox.setFromObject(object)

  const center = boundingBox.getCenter()

  const size = boundingBox.getSize()

  // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2))

  cameraZ *= offset // zoom out a little so that objects don't fill the screen

  camera.position.z = cameraZ

  const minZ = boundingBox.min.z
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ

  camera.far = cameraToFarEdge * 3
  camera.updateProjectionMatrix()

  if (controls) {
    // set camera to rotate around center of loaded object
    controls.target = center

    // prevent camera from zooming out far enough to create far plane cutoff
    controls.maxDistance = cameraToFarEdge * 2

    controls.saveState()
  } else {
    camera.lookAt(center)
  }
}
const scene = new THREE.Scene()

const light = new THREE.SpotLight()
light.position.set(20, 20, 20)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2.5)
document.getElementById("lightbox").appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 })

let geometry = new THREE.TorusGeometry(10, 3, 16, 100)
let mesh = new THREE.Points(geometry, material)
const loader = new OBJLoader()
/*loader.load(
  "https://github.com/willallstet/lasercut3dPrint/blob/main/frontend/src/assets/cone.stl/cone.stl",
  function (geometry) {
    let material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  },
  (error) => {
    console.log(error)
  }
)*/
loader.load(
  "https://cdn.glitch.com/fcf3c007-b4eb-4250-ba6b-653fdab94ce3%2Fjapanese_temple.obj?1558792651869",
  (obj) => {
    // the request was successfull
    mesh = new THREE.Points(obj.children[0].geometry, material)
    mesh.position.y = -15 //this model is not exactly in the middle by default so I moved it myself
    scene.add(mesh)
    fitCameraToObject(camera, mesh, 50)
  },
  (xhr) => {
    // the request is in progress
    console.log(xhr)
  },
  (err) => {
    // something went wrong
    console.error("loading .obj went wrong, ", err)
  }
)
window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2.5)
  render()
}

export function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()
}

function render() {
  //fitCameraToObject(camera, mesh)
  renderer.render(scene, camera)
}
