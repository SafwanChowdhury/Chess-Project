import './style.css'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

function initScene() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight);
    camera.position.set(0 , 0, 20);

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(0, 15, 0)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.2)
    pointLight2.position.set(0, 15, 20)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0xffffff, 0.2)
    pointLight3.position.set(0, 15, -20)
    scene.add(pointLight3)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)


    const lightHelper = new THREE.PointLightHelper(pointLight2)
    const gridHelper = new THREE.GridHelper(16.9, 8, 0x000000, 0xffffff)
    scene.add(lightHelper, gridHelper)

    scene.background = new THREE.TextureLoader().load('space.jpg');

    const moonTexture = new THREE.TextureLoader().load('moon.jpg');
    const normalTexture = new THREE.TextureLoader().load('normal.jpg');

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
            normalMap: normalTexture
        })
    );

    scene.add(moon)
    moon.position.set(0, 25, 0)

    const loader = new GLTFLoader()
    loader.load(
        'models/ChessBoard.glb',
        function (gltf) {
            scene.add(gltf.scene);
        }
    )
}
function createBoardSquares() {
    var boardSquares = [];
    var squareSize = 2.1; // change this to adjust the size of the squares

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var squareColor = 0x00FF00;
            var squareGeometry = new THREE.BoxGeometry(squareSize, 0.05, squareSize);
            var squareMaterial = new THREE.MeshLambertMaterial({ color: squareColor, transparent: true, opacity: 0 });
            var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
            squareMesh.position.set((i - 3.5) * squareSize, 0 , (j - 3.5) * squareSize);
            boardSquares.push(squareMesh);
        }
    }

    return boardSquares;
}

var boardSquares = createBoardSquares();
for (var i = 0; i < boardSquares.length; i++) {
    scene.add(boardSquares[i]);
}

const coordsMap = [-7.36, -5.36, -3.16, -1.06, 1.06, 3.16, 5.16, 7.36];
let pieces = [];

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
    "models/bKing.glb",
    "models/bQueen.glb",
    "models/bBishopL.glb",
    "models/bKnightL.glb",
    "models/bRookL.glb"
]


const manager = new THREE.LoadingManager();
function loadObject(i, obj, x1, z1) {
    const loader = new GLTFLoader(manager);
    loader.load(obj, function(gltf){
        pieces[i] = gltf.scene
        pieces[i].position.x = coordsMap[x1]
        pieces[i].position.z = coordsMap[z1]
        scene.add(pieces[i])
    })
}

let lenObj = objArray.length;

const initArray = [
    {x: 0, y: 0} , {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0},
    {x: 0, y: 1} , {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1},
    {x: 0, y: 6} , {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
    {x: 0, y: 7} , {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7}
]

function objectLoading(){
    for (let i = 0; i < lenObj; i++) {
        loadObject(i, objArray[i], initArray[i].x, initArray[i].y)
    }
}

function addPieceData(){
    for (let i = 0; i < pieces.length; i++){
        pieces[i].userData.pieceId = i
        pieces[i].userData.indexOfBoardPiece = i
    }
}

objectLoading()

const camControls = new OrbitControls(camera, renderer.domElement);

document.addEventListener('mousedown', onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5);
    var raycaster =  new THREE.Raycaster();
    raycaster.setFromCamera( vector, camera );
/*    var intersectsBoard = raycaster.intersectObjects(boardSquares);
    if (intersectsBoard.length > 0) {
        intersectsBoard[0].object.material.transparent = true;
        if (intersectsBoard[0].object.material.opacity === 0) {
            intersectsBoard[0].object.material.opacity = 1;
        } else {
            intersectsBoard[0].object.material.opacity = 0;
        }
    }*/
    var intersectsPiece = raycaster.intersectObjects(pieces, true);
    if (intersectsPiece.length > 0) {
        if (intersectsPiece[0].object) {
            intersectsPiece[0].object.material.transparent = true;
            console.log(intersectsPiece[0].object.parent.userData.pieceId)
            if (intersectsPiece[0].object.material.opacity === 0.7) {
                intersectsPiece[0].object.material.opacity = 1;
            } else {
                intersectsPiece[0].object.material.opacity = 0.7;
            }
        }
        else{}
    }
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        camControls.enabled = !camControls.enabled
        //camera.position.set(0,20,0)
        //camera.lookAt(0,0,0)
    }
}, true)

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
    initScene()

    addPieceData()
    console.log(pieces[3].userData.pieceId)
    console.log(pieces[3].position.x)
    console.log(pieces[3].position.y)
    animate()
};

function resize_window(camera, renderer){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
}

window.addEventListener('resize',() => resize_window(camera,renderer))

export {
    pieces,
}