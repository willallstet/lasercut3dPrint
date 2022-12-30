import * as THREE from "three"
import React, { useState } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
function fitCameraToObject(camera, object, offset) {
  offset = offset || 1.5

  const boundingBox = new THREE.Box3()

  boundingBox.setFromObject(object)

  const center = boundingBox.getCenter(new THREE.Vector3())
  const size = boundingBox.getSize(new THREE.Vector3())

  const startDistance = center.distanceTo(camera.position)
  // here we must check if the screen is horizontal or vertical, because camera.fov is
  // based on the vertical direction.
  const endDistance =
    camera.aspect > 1
      ? (size.y / 2 + offset) / Math.abs(Math.tan(camera.fov / 2))
      : (size.y / 2 + offset) /
        Math.abs(Math.tan(camera.fov / 2)) /
        camera.aspect

  camera.position.set(
    (camera.position.x * endDistance) / startDistance,
    (camera.position.y * endDistance) / startDistance,
    (camera.position.z * endDistance * 0.9) / startDistance
  )
  camera.lookAt(center)
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

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1 })

let geometry = new THREE.TorusGeometry(10, 3, 16, 100)
let mesh = new THREE.Points(geometry, material)
scene.add(mesh)
fitCameraToObject(camera, mesh)
document.getElementById("lightbox").appendChild(renderer.domElement)
window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2.5)
  render()
}
export function changeMesh(fileLoc) {
  scene.remove(scene.children[0])
  const loader = new OBJLoader()
  loader.load(
    fileLoc,
    (obj) => {
      // the request was successfull
      let mesh = new THREE.Points(obj.children[0].geometry, material)
      mesh.position.y = -15 //this model is not exactly in the middle by default so I moved it myself
      fitCameraToObject(camera, mesh)
      mesh.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
      })
      scene.add(mesh)
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
}

export function animate() {
  mesh.rotation.y += 0.001
  mesh.rotation.x += 0.005
  requestAnimationFrame(animate)

  controls.update()

  render()
}

function render() {
  //fitCameraToObject(camera, mesh)
  renderer.render(scene, camera)
}
