import "./CSS/game.css";
import "./CSS/loading.css";
import "./CSS/popup.css";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {game} from "./script";
import {CSS3DObject} from "three/addons/renderers/CSS3DRenderer.js";
import {updateScene,initScene,pieces,blackPieces,whitePieces,camera,renderer,scene,boardSquares,coordsMap,takenMap,takenWhite, initArray,takenBlack,loadQueen,manager} from "./scene.js";

function addPieceData(){
	for (let i = 0; i < pieces.length; i++){
		pieces[i].userData.pieceId = i;
		pieces[i].userData.taken = false;
		pieces[i].userData.hasMoved = false;
		if (pieces[i].userData.pieceId < 16) {
			pieces[i].userData.indexOfBoardPiece = i;
		}
		else{
			pieces[i].userData.indexOfBoardPiece = i+32;
		}
		pieces[i].userData.name = pieces[i].children[0].name;
		if (pieces[i].userData.name === "Pawn"){
			pieces[i].userData.moveTwo = true;
		}
		if (i < 16){
			pieces[i].userData.side = "white";
			whitePieces.push(pieces[i]);
		}
		else{
			pieces[i].userData.side = "black";
			blackPieces.push(pieces[i]);
		}
	}
}

function addPromotionData(){
	let i = modifiedData[0];
	let index = modifiedData[1];
	let side = modifiedData[2];
	pieces[i].userData.name = pieces[i].children[0].name;
	pieces[i].userData.pieceId = i;
	pieces[i].userData.indexOfBoardPiece = index;
	pieces[i].userData.taken = false;
	pieces[i].userData.isQueen = true;
	pieces[i].userData.side = side;
	pieces[i].userData.hasMoved = true;
	promotion = false;
}



const gameLogic = new game();
gameLogic.whitePieces = whitePieces;
gameLogic.blackPieces = blackPieces;
gameLogic.cells = boardSquares;
gameLogic.pieces = pieces;

const camControls = new OrbitControls(camera, renderer.domElement);

document.addEventListener("mousedown", onDocumentMouseDown, false);

let intersectsPiece = null;
let intersectsBoard = null;
function onDocumentMouseDown(event) {
	if (gameLogic.continue) {
		var vector = new THREE.Vector3(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1,
			0.5);
		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(vector, camera);
		intersectsBoard = raycaster.intersectObjects(boardSquares);
		intersectsPiece = raycaster.intersectObjects(pieces, true);
		gameLogic.modified = [];
		gameLogic.givePiecesEventListeners(intersectsPiece, intersectsBoard);
		//comment out when not testing game states, click through moves till saved game state
		incr++
		if (incr < unitTest.length)
			gameLogic.unitTest(unitTest[incr][0], unitTest[incr][1])
	}
}


const filename = "/python_helpers/movesLog.txt"; // Replace with the name and path of your text file
let unitTest;

fetch(filename)
	.then(response => response.text())
	.then(contents => {
		unitTest = JSON.parse(contents);
		console.log(unitTest);
	})
	.catch(error => console.error(error));

let modified = [];
let modifiedData = [];
let promotion = false;
let incr = -1;
function animate() {
	requestAnimationFrame(animate);
	//camControls.enabled = gameLogic.selected === null
	modified = gameLogic.modified;
	sessionStorage.setItem("movesLog", JSON.stringify(gameLogic.movesLog));
	if (modified.length > 0){
		if (modified[3] !== null){
			if (modified[3] < 16) {
				takenWhite.push(pieces[modified[3]]);
				pieces[modified[3]].position.x = -takenMap[initArray[takenWhite.indexOf(pieces[modified[3]])].y];
				pieces[modified[3]].position.z = coordsMap[initArray[takenWhite.indexOf(pieces[modified[3]])].x];
			}
			else if (modified[3] >= 16){
				takenBlack.push(pieces[modified[3]]);
				pieces[modified[3]].position.x = takenMap[initArray[takenBlack.indexOf(pieces[modified[3]])].y];
				pieces[modified[3]].position.z = -coordsMap[initArray[takenBlack.indexOf(pieces[modified[3]])].x];
			}
		}
		if (modified[4] !== null){
			console.log(modified);
			modifiedData[0] = modified[0];
			modifiedData[1] = pieces[modified[0]].userData.indexOfBoardPiece;
			modifiedData[2] = pieces[modified[0]].userData.side;
			promotion = true;
			loadQueen(modified[0], modified[4], modified[2], modified[1]);
		}
		if (modified[6] !== null){
			let castle = gameLogic.castle;
			pieces[castle[0]].position.x = coordsMap[castle[2]];
			pieces[castle[0]].position.z = coordsMap[castle[1]];
		}
		pieces[modified[0]].position.x = coordsMap[modified[2]];
		pieces[modified[0]].position.z = coordsMap[modified[1]];
		modified = [];
		gameLogic.modified = [];
		gameLogic.castle = [];
		updateTurnOverlay();
	}
	renderer.render(scene, camera);
}

let onStart = false;

manager.onStart = function (url, itemsLoaded, itemsTotal) {
	document.getElementById("title").innerHTML = "Loading";
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
	if (!onStart) {
		let percentage = Math.floor((itemsLoaded / itemsTotal) * 100).toString();
		document.getElementById("title").innerHTML = percentage;
		document.getElementById("pawn-fill").style.clipPath = `polygon(0% ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`;
	}
};

manager.onLoad = function () {
	if (!onStart) {
		document.getElementById("pawn-container").classList.add("loading-finished");
		setTimeout(function() {
			document.getElementById("loading-screen").remove();
		}, 2000);
		document.getElementById("title").innerHTML = "Online Chess Game";
		onStart = true;
		initScene();
		addPieceData();
		gameLogic.initKing();
		camera.position.x = 8;
		camera.position.y = 18.3;
		camera.position.z = -0.45;
		camera.rotation.x = -1.59;
		camera.rotation.y = 0.41;
		camera.rotation.z = 1.63;
		animate();
	}
	if (promotion){
		addPromotionData();
	}
};

const turnOverlay = document.getElementById("turn-overlay");
const turnText = document.getElementById("turn-text");
const popup = document.getElementById("end-screen");
const box = document.getElementById("success-box");

function updateTurnOverlay() {
	if (gameLogic.turn) {
		turnText.textContent = gameLogic.turn ? "White's Turn" : "Your Turn";
		turnText.style.color = gameLogic.turn ? "White" : "Grey";
	}
	else {
		turnText.textContent = gameLogic.turn ? "Your Turn" : "Black's Turn";
		turnText.style.color = gameLogic.turn ? "White" : "Grey";
	}
}

updateTurnOverlay();
turnOverlay.hidden = false;
popup.style.pointerEvents = "none";
box.hidden = true;
// Add the turn overlay to the scene
const turnOverlayObject = new CSS3DObject(turnOverlay);
scene.add(turnOverlayObject);

