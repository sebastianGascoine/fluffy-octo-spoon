import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";

const loader = new GLTFLoader();

// ------------------------------------------------
// GLB LOADING
// ------------------------------------------------

loader.load("../Items/Chess3D_Black.glb", function (gltf) {
    sword = gltf.scene; // sword 3D object is loaded
    sword.scale.set(2, 2, 2);
    sword.position.y = 4;
    scene.add(sword);
});

// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
const scene = new THREE.Scene();

// Create a basic perspective camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 4;

// Create a renderer with Antialiasing
const renderer = new THREE.WebGLRenderer({antialias: true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: "#433F81"});
const cube = new THREE.Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

// Render Loop
const render = function () {
    requestAnimationFrame(render);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
};

render();
