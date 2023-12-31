import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import cartoonFont from './fonts/cartoon.json?url';
import burnRubberFont from './fonts/burn_rubber.json?url';
import gsap from 'gsap';
import { GUI } from 'dat.gui';
import baseColorTexture from './textures/Substance_Graph_BaseColor.jpg';
import ambientOclusionTexture from './textures/Substance_Graph_AmbientOcclusion.jpg';
import heightTexture from './textures/Substance_Graph_Height.png';
import normalTexture from './textures/Substance_Graph_Normal.jpg';
import roughnessTexture from './textures/Substance_Graph_Roughness.jpg';
import goldMatcapTexture from './textures/metal_matcap.png';

const parameters = {
  color: '#ffffff',
  spin: () => {
    gsap.to(cube1.rotation, { duration: 2, y: cube1.rotation.y + 10 });
  },
};

// GUI
const gui = new GUI();

const scene = new THREE.Scene();

// Lights
// - ambient
const ambientLightSettings = {
  color: '#383434',
  intensity: 0.5,
};
const ambientLight = new THREE.AmbientLight(
  ambientLightSettings.color,
  ambientLightSettings.intensity
);
scene.add(ambientLight);
const ambientLightGui = gui.addFolder('ambientLight');
ambientLightGui.open();
ambientLightGui.add(ambientLightSettings, 'intensity').min(0).max(1).step(0.01);
ambientLightGui.addColor(ambientLightSettings, 'color').onChange((newColor) => {
  ambientLight.color.set(newColor);
});

// - directional
const dirLightSettings = {
  color: '#b8b8dd',
  intensity: 0.5,
};
const dirLight = new THREE.DirectionalLight(dirLightSettings.color, dirLightSettings.intensity);
dirLight.position.set(2, 2, 0);
scene.add(dirLight);

// - hepsphere
const hemisphereLightSetting = {
  skyColor: '#d62f2f',
  floorColor: '#b8b8dd',
  intensity: 0.5,
};
const hemSpehreLight = new THREE.HemisphereLight(
  hemisphereLightSetting.skyColor,
  hemisphereLightSetting.floorColor,
  hemisphereLightSetting.intensity
);
scene.add(hemSpehreLight);

// - dirlight helper
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.4);
scene.add(dirLightHelper);

//Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const boxTextures = {
  color: textureLoader.load(baseColorTexture),
  ao: textureLoader.load(ambientOclusionTexture),
  roughness: textureLoader.load(roughnessTexture),
  height: textureLoader.load(heightTexture),
  normal: textureLoader.load(normalTexture),
};

//Fonts
const fontLoader = new FontLoader(loadingManager);

fontLoader.load(cartoonFont, (font) => {
  const textGeometry = new TextGeometry('flat font with 0 height', {
    font,
    size: 0.4,
    height: 0, // zero thickness
    curveSegments: 12,
    bevelEnabled: false,
  });

  const textMaterial = new THREE.MeshBasicMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.y = 1.5;
  scene.add(textMesh);
});

fontLoader.load(burnRubberFont, (font) => {
  const textGeometry = new TextGeometry('volumetric font', {
    font,
    size: 0.4,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const matCapTexture = textureLoader.load(goldMatcapTexture);
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.y = 1;
  scene.add(textMesh);
});

// Geometries
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ roughness: 0.1 })
);
floorMesh.rotateX(-Math.PI / 2);
floorMesh.position.y = -0.5;
scene.add(floorMesh);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ map: boxTextures.color, roughness: 0.1 })
);
scene.add(cube1);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  new THREE.MeshStandardMaterial({ color: 'gray' })
);
sphere.position.z = 1.3;
scene.add(sphere);

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

// Shadows
renderer.shadowMap.enabled = true;
floorMesh.receiveShadow = true;
cube1.castShadow = true;
sphere.castShadow = true;

dirLight.castShadow = true;
// sizes has to fit scene only to produce better shadow maps
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.far = 6;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -3;
dirLight.shadow.camera.right = 3;
dirLight.shadow.camera.top = 3;
dirLight.shadow.radius = 3; // edges blur

const shadowCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(shadowCameraHelper);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};
animate(); //

// Debug
gui.add(cube1.position, 'y', -3, 3, 0.01).name('cubeY');
gui.add(cube1, 'visible');
gui.add(cube1.material, 'wireframe');
gui.addColor(parameters, 'color').onChange(() => {
  cube1.material.color.set(parameters.color);
});
gui.add(parameters, 'spin');
