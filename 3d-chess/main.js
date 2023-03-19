import './style.css'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {game} from "./script"
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import {mod} from "three/nodes";


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
            squareMesh.position.set((j - 3.5) * squareSize, 0 , (i - 3.5) * squareSize);
            boardSquares.push(squareMesh);
        }
    }

    return boardSquares;
}

const boardSquares = createBoardSquares();
for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].userData.index = i
    scene.add(boardSquares[i]);
}

let pieces = [];
let whitePieces = [];
let blackPieces = [];
let takenWhite = [];
let takenBlack = [];

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

const coordsMap = [-7.36, -5.36, -3.16, -1.06, 1.06, 3.16, 5.16, 7.36];
const takenMap = [11.56, 13.66];

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
        pieces[i].userData.taken = false
        if (pieces[i].userData.pieceId < 16) {
            pieces[i].userData.indexOfBoardPiece = i
        }
        else{
            pieces[i].userData.indexOfBoardPiece = i+32
        }
        pieces[i].userData.name = pieces[i].children[0].name
        if (pieces[i].userData.name === "Pawn"){
            pieces[i].userData.moveTwo = true
        }
        if (i < 16){
            pieces[i].userData.side = "white"
            whitePieces.push(pieces[i])
        }
        else{
            pieces[i].userData.side = "black"
            blackPieces.push(pieces[i])
        }
    }
}

function loadQueen(i, obj, x1, z1){
    scene.remove(pieces[i])
    loadObject(i, obj, x1, z1)
}

function addPromotionData(){
    let i = modifiedData[0]
    let index = modifiedData[1]
    let side = modifiedData[2]
    pieces[i].userData.name = pieces[i].children[0].name
    pieces[i].userData.pieceId = i
    pieces[i].userData.indexOfBoardPiece = index
    pieces[i].userData.taken = false
    pieces[i].userData.isQueen = true
    pieces[i].userData.side = side
    promotion = false
}



const gameLogic = new game()
gameLogic.whitePieces = whitePieces
gameLogic.blackPieces = blackPieces
gameLogic.cells = boardSquares
gameLogic.pieces = pieces

const camControls = new OrbitControls(camera, renderer.domElement);

const menuElement = document.getElementById('menu');
const menuObject = new CSS2DObject(menuElement);
menuObject.position.set(0, 0, 0);
scene.add(menuObject);

document.addEventListener('mousedown', onDocumentMouseDown, false);

let intersectsPiece = null
let intersectsBoard = null
function onDocumentMouseDown(event) {
    if (clientID[0] == gameLogic.turn ? 1 : 0) {
        menuElement.style.visibility = 'hidden';
        var vector = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(vector, camera);
        intersectsBoard = raycaster.intersectObjects(boardSquares);
        intersectsPiece = raycaster.intersectObjects(pieces, true);
        gameLogic.modified = []
        gameLogic.givePiecesEventListeners(intersectsPiece, intersectsBoard)
    }
}

//copy array object to save game state from console
let unitTest = [
    [
        11,
        16
    ],
    [
        20,
        -16
    ],
    [
        11,
        9
    ],
    [
        19,
        -16
    ],
    [
        4,
        7
    ],
    [
        19,
        -8
    ],
    [
        4,
        16
    ],
    [
        26,
        -7
    ],
    [
        4,
        4
    ],
    [
        28,
        -8
    ],
    [
        4,
        8
    ],
    [
        28,
        -9
    ],
    [
        3,
        1
    ],
    [
        22,
        -8
    ],
    [
        12,
        16
    ],
    [
        22,
        -8
    ],
    [
        5,
        35
    ],
    [
        22,
        -8
    ],
    [
        3,
        1
    ],
    [
        28,
        -40
    ]
]


let modified = []
let modifiedData = []
let promotion = false
let received = false
let incr = -1
function animate() {
    requestAnimationFrame(animate);
    camControls.enabled = gameLogic.selected === null
    modified = gameLogic.modified
    if (modified.length > 0){
        if (clientID[0] == modified[5]) {
            gameLogic.moveSend.push(clientID[0])
            sendActionToOpponent(gameLogic.moveSend)
            modified[5] = !modified[5]
        }
        if (modified[3] !== null){
            if (modified[3] < 16) {
                takenWhite.push(pieces[modified[3]])
                pieces[modified[3]].position.x = -takenMap[initArray[takenWhite.indexOf(pieces[modified[3]])].y]
                pieces[modified[3]].position.z = coordsMap[initArray[takenWhite.indexOf(pieces[modified[3]])].x]
                pieces[modified[3]].userData.taken = true
            }
            else if (modified[3] >= 16){
                takenBlack.push(pieces[modified[3]])
                pieces[modified[3]].position.x = takenMap[initArray[takenBlack.indexOf(pieces[modified[3]])].y]
                pieces[modified[3]].position.z = -coordsMap[initArray[takenBlack.indexOf(pieces[modified[3]])].x]
                pieces[modified[3]].userData.taken = true
            }
        }
        if (modified[4] !== null){
            modifiedData[0] = modified[0]
            modifiedData[1] = pieces[modified[0]].userData.indexOfBoardPiece
            modifiedData[2] = pieces[modified[0]].userData.side
            promotion = true
            menuObject.position.copy(pieces[modified[0]].children[0].position);
            // show the menu
            menuElement.style.visibility = 'visible';
            loadQueen(modified[0], modified[4], modified[2], modified[1])
        }
        pieces[modified[0]].position.x = coordsMap[modified[2]]
        pieces[modified[0]].position.z = coordsMap[modified[1]]
        modified = []
        gameLogic.modified = []
        received = false
    }
    renderer.render(scene,camera);
}

let onStart = false

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    document.getElementById("title").innerHTML = "Loading";
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    document.getElementById("title").innerHTML = (Math.floor((itemsLoaded / itemsTotal) * 100).toString());
    console.log(Math.floor((itemsLoaded / itemsTotal) * 100))
};

manager.onLoad = function () {
    document.getElementById("title").innerHTML = "Loading Complete";
    console.log('Loading complete!');
    document.getElementById("title").innerHTML = "Online Chess Game";
    if (!onStart) {
        onStart = true
        initScene()
        addPieceData()
        gameLogic.initKing()
        camera.position.x = 8
        camera.position.y = 18.3
        camera.position.z = -0.45
        camera.rotation.x = -1.59
        camera.rotation.y = 0.41
        camera.rotation.z = 1.63
        // Send a rejoin message to the server
        const message = {
            type: 'rejoin',
            room: roomId
        };
        socket.send(JSON.stringify(message));
        animate()
    }
    if (promotion){
        addPromotionData()
    }
}

function resize_window(camera, renderer){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
}

window.addEventListener('resize',() => resize_window(camera,renderer))

const socket = new WebSocket('ws://192.168.1.88:8080');

socket.addEventListener('open', function(event) {
    console.log('Connected to server');
    objectLoading();
});

let clientID = []
socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'clientIndex':
            clientID[0] = message.index
            console.log(clientID[0])
            break
        case 'action':
            gameLogic.unitTest(message.data[0], message.data[1]);
    }
});

function sendActionToOpponent(actionData) {
    const message = {
        type: 'action',
        room: roomId,
        data: actionData
    };
    socket.send(JSON.stringify(message));
}


socket.addEventListener('close', function(event) {
    console.log('Disconnected from server');
});

const roomId = sessionStorage.getItem('roomId');


