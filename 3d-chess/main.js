import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "./DragControls";
import {MathUtils} from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);

camera.position.set(0 , 0, 20);


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
const gridHelper = new THREE.GridHelper(16.9, 8, 0x000000, 0xffffff)
scene.add(lightHelper, gridHelper)




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

const loader = new GLTFLoader()
loader.load(
    'models/ChessBoard.glb',
    function ( gltf ) {
        scene.add(gltf.scene);
    }
)


const coordsMap = [7.36, 5.36, 3.16, 1.06, -1.06, -3.16, -5.16, -7.36];

let pieces = [];
let pieceData = []

const objArray = [
    "models/wRookR.glb",
    "models/wKnightR.glb",
    "models/wBishopR.glb",
    "models/wKing.glb",
    "models/wQueen.glb",
    "models/wBishopL.glb",
    "models/wKnightL.glb",
    "models/wRookL.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bPawn.glb",
    "models/bRookR.glb",
    "models/bKnightR.glb",
    "models/bBishopR.glb",
    "models/bQueen.glb",
    "models/bKing.glb",
    "models/bBishopL.glb",
    "models/bKnightL.glb",
    "models/bRookL.glb"
]


const manager = new THREE.LoadingManager();


/*function loadObject(obj, x1, z1){
    const loader = new GLTFLoader( manager );
    loader.load(
        obj,
        function (object) {
            object.scene.position.x = coordsMap[x1];
            object.scene.position.z = coordsMap[z1];
            scene.add(object.scene)
        }
    )
}*/

async function loadObject(i, obj, x1, z1) {
    const loader = new GLTFLoader(manager);
    const piece = await loader.loadAsync(obj)
    piece.scene.position.x = coordsMap[x1]
    piece.scene.position.z = coordsMap[z1]
    scene.add(piece.scene)
    console.log("added piece" + i)
    return piece
}



let lenObj = objArray.length;

const initArray = [
    {x: 0, y: 7} , {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7},
    {x: 0, y: 6} , {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
    {x: 0, y: 1} , {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1},
    {x: 0, y: 0} , {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}
]

function objectLoading(){
    for (let i = 0; i < lenObj; i++) {
        pieces[i] = loadObject(i, objArray[i], initArray[i].x, initArray[i].y)
    }
}

objectLoading()

const camControls = new OrbitControls(camera, renderer.domElement);
/*const dragControls = new DragControls(pieces, camera, renderer.domElement);

dragControls.addEventListener( 'dragstart', function ( event ) {

    event.object.material.emissive.set( 0xaaaaaa );
} );

dragControls.addEventListener( 'dragend', function ( event ) {

    event.object.material.emissive.set( 0x000000 );
    console.log(event.object.name)
} );


dragControls.enabled = false*/
window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        //dragControls.enabled = !dragControls.enabled
        camControls.enabled = !camControls.enabled
        //camera.position.set(0,20,0)
        //camera.lookAt(0,0,0)
    }
}, true)


function animate(){
    requestAnimationFrame(animate);
/*    let num = Math.floor(Math.random() * 32)
    pieces[num].position.x = coordsMap[Math.floor(Math.random() * 8)]
    pieces[num].position.z = coordsMap[Math.floor(Math.random() * 8)]*/
    // camControls.update()
    renderer.render(scene,camera);
}

manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    document.getElementById("title").innerHTML = "Loading";
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    document.getElementById("title").innerHTML = (Math.floor((itemsLoaded/itemsTotal) * 100).toString());
    console.log(Math.floor((itemsLoaded/itemsTotal) * 100))
};


manager.onLoad = function ( ) {
    document.getElementById("title").innerHTML = "Loading Complete";
    console.log( 'Loading complete!');
    document.getElementById("title").innerHTML = "Online Chess Game";
    animate()
};

function resize_window(camera, renderer){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
}

window.addEventListener('resize',() => resize_window(camera,renderer))