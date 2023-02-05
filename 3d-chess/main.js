import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 });
const torus = new THREE.Mesh( geometry, material );
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(5,5,5)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const controls = new OrbitControls(camera, renderer.domElement);



const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');


const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3,32,32),
    new THREE.MeshStandardMaterial( {
        map: moonTexture,
        normalMap: normalTexture
    })
);

scene.add(moon)

moon.position.z = 30;
moon.position.setX(-10);

const loader = new OBJLoader();

loader.load('')

function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();
    renderer.render(scene,camera);
}

animate()