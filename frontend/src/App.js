import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
function App() {
  const scene = new THREE.Scene();

  const light = new THREE.SpotLight();
  light.position.set(20, 20, 20);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 });

  let geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  let mesh = new THREE.Points(geometry, material);
  const loader = new STLLoader();
  loader.load(
    "/cone.stl",
    function (geometry) {
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
  scene.add(mesh);

  window.addEventListener("resize", onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  //const stats = Stats();
  //document.body.appendChild(stats.dom);

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    render();

    //stats.update();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
  return (
    <body>
      <img src="./src/assets/5074859E-836C-4FE9-A734-B29EE3F33B56.JPG"></img>
      Upload a model
    </body>
  );
}

export default App;
