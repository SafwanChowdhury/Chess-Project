import './style.css'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {game} from "./script"
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';


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

    const loader2 = new THREE.CubeTextureLoader();
    scene.background = loader2.load([
        'skybox/right.png',
        'skybox/left.png',
        'skybox/top.png',
        'skybox/bottom.png',
        'skybox/front.png',
        'skybox/back.png',
    ]);

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
        pieces[i].userData.hasMoved = false
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
    pieces[i].userData.hasMoved = true
    promotion = false
}



const gameLogic = new game()
gameLogic.whitePieces = whitePieces
gameLogic.blackPieces = blackPieces
gameLogic.cells = boardSquares
gameLogic.pieces = pieces

const camControls = new OrbitControls(camera, renderer.domElement);

document.addEventListener('mousedown', onDocumentMouseDown, false);

let intersectsPiece = null
let intersectsBoard = null
function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5);
    var raycaster =  new THREE.Raycaster();
    raycaster.setFromCamera( vector, camera );
    intersectsBoard = raycaster.intersectObjects(boardSquares);
    intersectsPiece = raycaster.intersectObjects(pieces, true);
    gameLogic.modified = []
    gameLogic.givePiecesEventListeners(intersectsPiece, intersectsBoard)
    //comment out when not testing game states, click through moves till saved game state
/*    incr++
    if (incr < unitTest.length)
        gameLogic.unitTest(unitTest[incr][0], unitTest[incr][1])*/
}

//copy array object to save game state from console
let unitTest = [
    [
        11,
        16
    ],
    [
        20,
        -8
    ],
    [
        4,
        28
    ],
    [
        20,
        -8
    ],
    [
        12,
        8
    ],
    [
        20,
        -8
    ],
    [
        5,
        14
    ],
    [
        20,
        -9
    ],
    [
        6,
        15
    ]
]


let modified = []
let modifiedData = []
let promotion = false
function animate() {
    renderer.setAnimationLoop(render);
}

let onStart = false

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    document.getElementById("title").innerHTML = "Loading";
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    let percentage = Math.floor((itemsLoaded / itemsTotal) * 100).toString();
    document.getElementById("title").innerHTML = percentage;
    document.getElementById("pawn-fill").style.clipPath = `polygon(0% ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`;
};

manager.onLoad = function () {
    document.getElementById("pawn-container").classList.add("loading-finished");
    setTimeout(function() {
        document.getElementById("loading-screen").remove();
    }, 2000);
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
        init()
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


const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
const tempMatrix = new THREE.Matrix4();
let controller1, controller2;
let controllerGrip1, controllerGrip2;
const intersected = [];


function init() {
    setUpVRButton();
    enableVR();
    createControllers()
    createLine()
    createDolly()
}

function setUpVRButton() {
    const button = VRButton.createButton(renderer);
    document.body.appendChild(button);
}

function enableVR() {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local-floor')
}

function createControllers(){
    controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );

    scene.add( controller1 );

    controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );

    scene.add( controller2 );

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );

}

function createLine(){
    const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

    const line = new THREE.Line( geometry );
    line.name = 'line';
    line.scale.z = 5;

    controller1.add( line.clone() );
    controller2.add( line.clone() );
}


function render() {
    //camControls.enabled = gameLogic.selected === null
    modified = gameLogic.modified
    if (modified.length > 0){
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
            console.log(modified)
            modifiedData[0] = modified[0]
            modifiedData[1] = pieces[modified[0]].userData.indexOfBoardPiece
            modifiedData[2] = pieces[modified[0]].userData.side
            promotion = true
            menuObject.position.copy(pieces[modified[0]].children[0].position);
            // show the menu
            menuElement.style.visibility = 'visible';
            loadQueen(modified[0], modified[4], modified[2], modified[1])
        }
        if (modified[6] !== null){
            let castle = gameLogic.castle
            pieces[castle[0]].position.x = coordsMap[castle[2]]
            pieces[castle[0]].position.z = coordsMap[castle[1]]
        }
        pieces[modified[0]].position.x = coordsMap[modified[2]]
        pieces[modified[0]].position.z = coordsMap[modified[1]]
        modified = []
        gameLogic.modified = []
        gameLogic.castle = []
    }
    if (renderer.xr.isPresenting) {
        cleanIntersected();

        intersectObjects( controller1 );
        intersectObjects( controller2 );
        dollyMove()
    }

    renderer.render(scene, camera);
}


function onSelectStart( event ) {
    const controller = event.target;

    const intersections = getIntersections( controller );

    if ( intersections.length > 0 ) {

        const intersection = intersections[ 0 ];

        const object = intersection.object;

        controller.userData.selected = object;

    }
    gameLogic.modified = []
    gameLogic.givePiecesEventListeners(intersectsPiece, intersectsBoard)

}

function onSelectEnd( event ) {

    const controller = event.target;

    if ( controller.userData.selected !== undefined ) {

        controller.userData.selected = undefined;

    }


}

function getIntersections( controller ) {

    tempMatrix.identity().extractRotation( controller.matrixWorld );

    raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
    raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

    intersectsBoard = raycaster.intersectObjects(boardSquares);
    intersectsPiece = raycaster.intersectObjects(pieces, true);

    return raycaster.intersectObjects(gameLogic.turn ? whitePieces : blackPieces, true);

}

function intersectObjects( controller ) {

    // Do not highlight when already selected

    if ( controller.userData.selected !== undefined ) return;

    const line = controller.getObjectByName( 'line' );
    const intersections = getIntersections( controller );

    if ( intersections.length > 0 ) {

        const intersection = intersections[ 0 ];

        const object = intersection.object;
        object.material.emissive.g = 1;
        intersected.push( object );

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 5;

    }

}

function cleanIntersected() {

    while ( intersected.length ) {

        const object = intersected.pop();
        object.material.emissive.g = 0;

    }
}

//https://codepen.io/jason-buchheim/pen/zYqYGXM?editors=0010 - modified and refactored
var dolly;
var cameraVector = new THREE.Vector3(); // create once and reuse it!
// a variable to store the values from the last polling of the gamepads
const prevGamePads = new Map();

//default values for speed movement of each axis
var speedFactor = [1, 1, 1, 1];

function createDolly(){
    //dolly for camera
    dolly = new THREE.Group();
    dolly.position.set(0, 0, 0);
    dolly.name = "dolly";
    scene.add(dolly);
    dolly.add(camera);
    //add the controls to the dolly also or they will not move with the dolly
    dolly.add(controller1);
    dolly.add(controller2);
    dolly.add(controllerGrip1);
    dolly.add(controllerGrip2);
}

function dollyMove() {
    const session = renderer.xr.getSession();

    if (session) {
        const xrCamera = renderer.xr.getCamera(camera);
        xrCamera.getWorldDirection(cameraVector);

        if (isIterable(session.inputSources)) {
            let i = 0;
            for (const source of session.inputSources) {
                if (source && source.handedness) {
                    const handedness = source.handedness;
                    handleGamepad(source, handedness, i);
                    i++;
                }
            }
        }
    }
}

function handleGamepad(source, handedness, index) {
    if (!source.gamepad) return;

    const controller = renderer.xr.getController(index);
    const old = prevGamePads.get(source);
    const data = {
        handedness: handedness,
        buttons: source.gamepad.buttons.map((b) => b.value),
        axes: source.gamepad.axes.slice(0),
    };

    if (old) {
        handleButtons(data, old);
        handleAxes(data, old, source);
    }

    prevGamePads.set(source, data);
}

function handleButtons(data, old) {
    data.buttons.forEach((value, i) => {
        if (value !== old.buttons[i] || Math.abs(value) > 0.8) {
            handleButtonActions(data, value, i);
        }
    });
}

function handleButtonActions(data, value, i) {
    const isButtonDown = value === 1;
    const rotationValue = isButtonDown ? 1 : Math.abs(value);

    if (i === 1) {
        const rotationDirection = data.handedness === "left" ? -1 : 1;
        dolly.rotateY(THREE.MathUtils.degToRad(rotationDirection * rotationValue));
    }

    if (data.handedness === "left" && isButtonDown && i === 3) {
        dolly.position.set(0, 5, 0);
    }
}

function handleAxes(data, old, source) {
    data.axes.forEach((value, i) => {
        if (Math.abs(value) > 0.2) {
            speedFactor[i] > 1 ? (speedFactor[i] = 1) : (speedFactor[i] *= 1.001);

            if (i === 2) {
                handleAxis2(data, source);
            }

            if (i === 3) {
                handleAxis3(data, source);
            }
        } else if (Math.abs(value) > 0.025) {
            speedFactor[i] = 0.025;
        }
    });
}

function handleAxis2(data, source) {
    if (data.handedness === "left") {
        dolly.position.x -= cameraVector.z * speedFactor[2] * data.axes[2];
        dolly.position.z += cameraVector.x * speedFactor[2] * data.axes[2];
    } else {
        dolly.rotateY(-THREE.MathUtils.degToRad(data.axes[2]));
    }
    camControls.update();
}

function handleAxis3(data, source) {
    if (data.handedness === "left") {
        dolly.position.y -= speedFactor[3] * data.axes[3];
    } else {
        dolly.position.x -= cameraVector.x * speedFactor[3] * data.axes[3];
        dolly.position.z -= cameraVector.z * speedFactor[3] * data.axes[3];
    }
    camControls.update();
}

function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function";
}

//end Reference

objectLoading()
