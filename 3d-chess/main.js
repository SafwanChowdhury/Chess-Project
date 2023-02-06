import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";
import {load} from "three/addons/libs/opentype.module.js";
import init from "three/addons/offscreen/scene.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);



const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(0,15,0)
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 0.2)
pointLight2.position.set(0,15,20)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xffffff, 0.2)
pointLight3.position.set(0,15,-20)
scene.add(pointLight3)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


const lightHelper = new THREE.PointLightHelper(pointLight2)
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
moon.position.set(0,25,0)

const mtlLoader = new MTLLoader();
mtlLoader.load(
    "models/ChessBoard.mtl",
    function (materials){
        materials.preload();
        const loader = new OBJLoader();
        loader.setMaterials(materials);
        loader.load(
            'models/ChessBoard.obj',
            function (object) {
                scene.add(object);
            }
        );
    }
)


const coordsMap = [7.36, 5.36, 3.16, 1.06, -1.06, -3.16, -5.16, -7.36];

let pieces = [];

const mtlArray = [
    "models/wRookR.mtl",
    "models/wKnightR.mtl",
    "models/wBishopR.mtl",
    "models/wKing.mtl",
    "models/wQueen.mtl",
    "models/wBishopL.mtl",
    "models/wKnightL.mtl",
    "models/wRookL.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/wPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bPawn.mtl",
    "models/bRookR.mtl",
    "models/bKnightR.mtl",
    "models/bBishopR.mtl",
    "models/bQueen.mtl",
    "models/bKing.mtl",
    "models/bBishopL.mtl",
    "models/bKnightL.mtl",
    "models/bRookL.mtl"
]

const objArray = [
    "models/wRookR.obj",
    "models/wKnightR.obj",
    "models/wBishopR.obj",
    "models/wKing.obj",
    "models/wQueen.obj",
    "models/wBishopL.obj",
    "models/wKnightL.obj",
    "models/wRookL.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/wPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bPawn.obj",
    "models/bRookR.obj",
    "models/bKnightR.obj",
    "models/bBishopR.obj",
    "models/bQueen.obj",
    "models/bKing.obj",
    "models/bBishopL.obj",
    "models/bKnightL.obj",
    "models/bRookL.obj"
]

function loadObject(mtl, obj, x1, z1){
    mtlLoader.load(
        mtl,
        function (materials){
            materials.preload();
            const loader = new OBJLoader();
            loader.setMaterials(materials);
            loader.load(
                obj,
                function (object) {
                    scene.add(object)
                    pieces.push(object)
                    object.position.x = coordsMap[x1];
                    object.position.z = coordsMap[z1];
                }
            )
        }
    )
}

let lenMTL = mtlArray.length;

const initArray = [
    {x: 0, y: 7} , {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7},
    {x: 0, y: 6} , {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
    {x: 0, y: 1} , {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1},
    {x: 0, y: 0} , {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}
]

for (let i = 0; i < lenMTL; i++) {
    loadObject(mtlArray[i], objArray[i], initArray[i].x, initArray[i].y)
}


function animate(){
    requestAnimationFrame(animate);
/*    let num = Math.floor(Math.random() * 32)
    pieces[num].position.x = coordsMap[Math.floor(Math.random() * 8)]
    pieces[num].position.z = coordsMap[Math.floor(Math.random() * 8)]*/
    controls.update();
    renderer.render(scene,camera);
}

animate()