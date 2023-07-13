import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();

// const box = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 'lightgrey' });
// const mesh = new THREE.Mesh(box, material);
// mesh.rotation.set(1, 0, 0);

const group = new THREE.Group();
group.position.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'oxff0000' })
);
// const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'ox00ff00' }));
// const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'ox0000ff' }));
group.add(cube1);
// group.add(cube1, cube2, cube3);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Cameras
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 1, 3);
// camera.lookAt(mesh.position); // focus on something particular
scene.add(camera);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Render
const canvas = document.querySelector('.webgl');

if (!canvas) {
  throw new Error('no canvas found');
}
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Animations
gsap.to(group.position, { x: 2, duration: 1, delay: 1 });
gsap.to(group.position, { x: 0, duration: 1, delay: 2 });

const animate = () => {
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};
animate(); //

console.log(THREE);
