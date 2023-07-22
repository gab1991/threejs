import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { GUI } from 'dat.gui';

const parameters = {
  color: '#f8ebeb',
  spin: () => {
    gsap.to(cube1.rotation, { duration: 2, y: cube1.rotation.y + 10 });
  },
};

// Cursor listener
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

const scene = new THREE.Scene();

// const box = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 'lightgrey' });
// const mesh = new THREE.Mesh(box, material);
// mesh.rotation.set(1, 0, 0);

// const group = new THREE.Group();
// scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: parameters.color, wireframe: true })
);
scene.add(cube1);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  console.log(window.devicePixelRatio);

  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // max out at 2. Higher values can be burdensome
});

// Cameras
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(2, 0, 0);
// camera.lookAt(mesh.position); // focus on something particular
scene.add(camera);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Render
const canvas = document.querySelector<HTMLElement>('.webgl');

if (!canvas) {
  throw new Error('no canvas found');
}
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // max out at 2. Higher values can be burdensome
renderer.render(scene, camera);

// Camera controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animations
// gsap.to(group.position, { x: 2, duration: 1, delay: 1 });
// gsap.to(group.position, { x: 0, duration: 1, delay: 2 });

const animate = () => {
  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};
animate(); //

// Debug
const gui = new GUI();
gui.add(cube1.position, 'y', -3, 3, 0.01).name('cubeY');
gui.add(cube1, 'visible');
gui.add(cube1.material, 'wireframe');
gui.addColor(parameters, 'color').onChange(() => {
  cube1.material.color.set(parameters.color);
});
gui.add(parameters, 'spin');
