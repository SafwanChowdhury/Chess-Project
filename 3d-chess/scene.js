import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
});

function initScene() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight);
    camera.position.set(8, 18.3, -0.1369);
    camera.rotation.set(-1.578, 0.41, 1.589);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.2);
    pointLight2.position.set(0, 15, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 0.2);
    pointLight3.position.set(0, 15, -20);
    scene.add(pointLight3);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const loader2 = new THREE.CubeTextureLoader();
    scene.background = loader2.load([
        "skybox/right.png",
        "skybox/left.png",
        "skybox/top.png",
        "skybox/bottom.png",
        "skybox/front.png",
        "skybox/back.png",
    ]);

    const moonTexture = new THREE.TextureLoader().load("moon.jpg");
    const normalTexture = new THREE.TextureLoader().load("normal.jpg");

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
            normalMap: normalTexture
        })
    );

    scene.add(moon);
    moon.position.set(0, 25, 0);

    const loader = new GLTFLoader();
    loader.load(
        "models/ChessBoard.glb",
        function (gltf) {
            scene.add(gltf.scene);
        }
    );
}
function createBoardSquares() {
    let boardSquares = [];
    let squareSize = 2.1; // change this to adjust the size of the squares

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let squareColor = 0x00FF00;
            let squareGeometry = new THREE.BoxGeometry(squareSize, 0.05, squareSize);
            let squareMaterial = new THREE.MeshLambertMaterial({ color: squareColor, transparent: true, opacity: 0 });
            let squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
            squareMesh.position.set((j - 3.5) * squareSize, 0 , (i - 3.5) * squareSize);
            boardSquares.push(squareMesh);
        }
    }

    return boardSquares;
}

const boardSquares = createBoardSquares();
for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].userData.index = i;
    scene.add(boardSquares[i]);
}

let pieces = [];
let whitePieces = [];
let blackPieces = [];
let takenWhite = [];
let takenBlack = [];

const standard = [
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
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wPawn.glb",
    "models/wRookR.glb",
    "models/wKnightR.glb",
    "models/wBishopR.glb",
    "models/wKing.glb",
    "models/wQueen.glb",
    "models/wBishopL.glb",
    "models/wKnightL.glb",
    "models/wRookL.glb"
];

const wizard = [
    "models/wizard/wRookR.glb",
    "models/wizard/wKnightR.glb",
    "models/wizard/wBishopR.glb",
    "models/wizard/wKing.glb",
    "models/wizard/wQueen.glb",
    "models/wizard/wBishopL.glb",
    "models/wizard/wKnightL.glb",
    "models/wizard/wRookL.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wPawn.glb",
    "models/wizard/wRookR.glb",
    "models/wizard/wKnightR.glb",
    "models/wizard/wBishopR.glb",
    "models/wizard/wKing.glb",
    "models/wizard/wQueen.glb",
    "models/wizard/wBishopL.glb",
    "models/wizard/wKnightL.glb",
    "models/wizard/wRookL.glb"
];

const objArray = standard;
const coordsMap = [-7.36, -5.36, -3.16, -1.06, 1.06, 3.16, 5.16, 7.36];
const takenMap = [11.56, 13.66];

const manager = new THREE.LoadingManager();
function loadObject(i, obj, x1, z1, rot) {
    const loader = new GLTFLoader(manager);
    loader.load(obj, function(gltf){
        pieces[i] = gltf.scene;
        pieces[i].position.x = coordsMap[x1];
        pieces[i].position.z = coordsMap[z1];
        if (rot) {
            pieces[i].rotation.y =  Math.PI;
            pieces[i].children[0].material.color.setHex(0x363636)
        }
        scene.add(pieces[i]);
    });
}

let lenObj = objArray.length;

const initArray = [
    {x: 0, y: 0} , {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0},
    {x: 0, y: 1} , {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1},
    {x: 0, y: 6} , {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
    {x: 0, y: 7} , {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7}
];

function objectLoading(){
    for (let i = 0; i < lenObj; i++) {
        if (i > 15){
            loadObject(i, objArray[i], initArray[i].x, initArray[i].y, true);
        }
        else {
            loadObject(i, objArray[i], initArray[i].x, initArray[i].y, false);
        }
    }
}

function loadQueen(i, obj, x1, z1){
    let rot = true;
    if (i < 16){
        rot = false;
    }
    scene.remove(pieces[i]);
    loadObject(i, obj, x1, z1, rot);
}

function resize_window(camera, renderer){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener("resize",() => resize_window(camera,renderer));


export {initScene, pieces,blackPieces,whitePieces,camera,renderer,scene,boardSquares,coordsMap,takenMap,takenWhite, initArray,takenBlack,loadQueen,objectLoading,manager};