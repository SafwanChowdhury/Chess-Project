import "./CSS/game.css";
import "./CSS/loading.css";
import "./CSS/popup.css";
import socket from "./socket.js";
import * as THREE from "three";
import { endGame } from "./issue.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {game} from "./script";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import {initScene,pieces,blackPieces,whitePieces,camera,renderer,scene,boardSquares,coordsMap,takenMap,takenWhite, initArray,takenBlack,loadQueen,manager} from "./scene.js";

function addPieceData(){ //function used to add data to the piece objects after loading
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

function addPromotionData(){ //used to update the piece data after promotion
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
function onDocumentMouseDown(event) { //interaction with the board and pieces
	if (gameLogic.continue) {
		if (clientID[0] == gameLogic.turn ? 1 : 0) { //checks if it is the players turn
			let vector = new THREE.Vector3(
				(event.clientX / window.innerWidth) * 2 - 1,
				-(event.clientY / window.innerHeight) * 2 + 1,
				0.5);
			let raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(vector, camera); //creates a ray from the camera to the mouse position
			intersectsBoard = raycaster.intersectObjects(boardSquares); //checks if the ray intersects with any of the board squares
			intersectsPiece = raycaster.intersectObjects(pieces, true); //checks if the ray intersects with any of the pieces
			gameLogic.modified = [];
			gameLogic.givePiecesEventListeners(intersectsPiece, intersectsBoard); //sends the interacted piece or board square to the game logic
		}
	}
}

let modified = [];
let modifiedData = [];
let promotion = false;
let received = false;
let connected = false;
let cameraMoved = false;


function animate() { //animation loop
	requestAnimationFrame(animate);
	camControls.enabled = gameLogic.selected === null; //disables the camera controls if a piece is selected
	if (connected && cameraMoved === false){ //game start animation
		if (clientID[0]){
			if (camera.position.x > 0.20) {
				camera.position.x = camera.position.x - 0.1;
			}
			if (camera.position.y > 16.3) {
				camera.position.y = camera.position.y - (1 / 39);
			}
			if (camera.position.z > -11.5) {
				camera.position.z = camera.position.z - (17 / 120);
			}
			if (camera.rotation.x > -2.1845696263287486) {
				camera.rotation.x = camera.rotation.x - (0.58918/78);
			}
			if (camera.rotation.y > -0.009568585566868008) {
				camera.rotation.y = camera.rotation.y - (0.42157/78);
			}
			if (camera.rotation.z < 3.128012569910931) {
				camera.rotation.z = camera.rotation.z + (1.49589/78);
			}
			else{
				cameraMoved = true;
				camControls.enabled = true;
			}
		}
		else {
			if (camera.position.x > -0.10) {
				camera.position.x = camera.position.x - 0.1;
			}
			if (camera.position.y > 16.3) {
				camera.position.y = camera.position.y - (1 / 39);
			}
			if (camera.position.z < 11.5) {
				camera.position.z = camera.position.z + (17 / 120);
			}
			if (camera.rotation.x < -0.9289476942162901) {
				camera.rotation.x = camera.rotation.x + (0.66644/78);
			}
			if (camera.rotation.y > 0.009568585566868008) {
				camera.rotation.y = camera.rotation.y - (0.41201282561550545/78);
			}
			if (camera.rotation.z > -0.007967086578719378) {
				camera.rotation.z = camera.rotation.z - (1.62416/78);
			}
			else{
				cameraMoved = true;
				camControls.enabled = true;
			}
		}
	}
	modified = gameLogic.modified;
	sessionStorage.setItem("movesLog", JSON.stringify(gameLogic.movesLog)); //saves the moves log to the session storage
	if (modified.length > 0){ //checks if the game logic has modified data
		if (clientID[0] == modified[5]) {
			gameLogic.moveSend.push(clientID[0]);
			if (modified[4] !== null) {
				gameLogic.moveSend.push(gameLogic.promoted);
			}
			sendActionToOpponent(gameLogic.moveSend);
			modified[5] = !modified[5];
		}
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
		received = false;
		updateTurnOverlay(); //updates the turn overlay
	}
	renderer.render(scene,camera); //renders the scene
}



let onStart = false;

manager.onStart = function (url, itemsLoaded, itemsTotal) {
	if (!onStart) {
		document.getElementById("title").innerHTML = "Loading";
	}
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) { //updates the loading screen
	if (!onStart) {
		let percentage = Math.floor((itemsLoaded / itemsTotal) * 100).toString();
		document.getElementById("title").innerHTML = percentage;
		document.getElementById("pawn-fill").style.clipPath = `polygon(0% ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`;
	}
};

manager.onLoad = function () {
	if (!onStart) { //initialises the game once all the assets have been loaded
		document.getElementById("pawn-container").classList.add("loading-finished");
		setTimeout(function() {
			document.getElementById("loading-screen").remove();
		}, 2000);
		document.getElementById("title").innerHTML = "Online Chess Game";
		onStart = true;
		initScene();
		addPieceData();
		gameLogic.initKing();
		loaded = 1;
		animate();
	}
	if (promotion){
		addPromotionData();
	}
};

let loaded = 0;
let clientID = [];
let roomId = null;

function initialiseGame(){ //connect to server once game initialisation is complete
	roomId = sessionStorage.getItem("roomId");

	if (loaded){
		const message = {
			type: "loaded",
			room: roomId
		};
		socket.send(JSON.stringify(message));
	}

	socket.addEventListener("message", function(event) {
		const message = JSON.parse(event.data);
		switch (message.type) {
		case "clientIndex":
			clientID[0] = message.index;
			console.log(clientID[0]);
			gameLogic.clientID = clientID[0];
			updateTurnOverlay();
			turnOverlay.hidden = false;
			break;
		case "start":
			camera.position.set(8, 18.3, -0.1369);
			camera.rotation.set(-1.578, 0.41, 1.589);
			camControls.enabled = false;
			connected = true;
			break;
		case "disconnect":
			console.log("Opponent disconnected");
			gameLogic.popupAlert.textContent = "Forfeit!!";
			gameLogic.checkText.textContent = "Opponent Disconnected";
			gameLogic.popupPawn.style.filter = "invert(50%) sepia(100%) saturate(500%) hue-rotate(350deg)";
			gameLogic.checkPopup.hidden = false;
			gameLogic.checkContainer.style.pointerEvents = "auto";
			if (gameLogic.movesLog.length > 2) {
				endGame();
			}
			break;
		case "action":
			gameLogic.unitTest(message.data[0], message.data[1], message.data[3]);
		}
	});


	socket.addEventListener("close", function(event) {
		console.log("Disconnected from server");
		location.reload();
	});
}

const turnOverlay = document.getElementById("turn-overlay");
const turnText = document.getElementById("turn-text");
const popup = document.getElementById("end-screen");
const box = document.getElementById("success-box");
function updateTurnOverlay() { //updates the turn overlay
	if (clientID[0] == 0) {
		turnText.textContent = gameLogic.turn ? "White's Turn" : "Your Turn";
		turnText.style.color = gameLogic.turn ? "White" : "Grey";
	}
	else {
		turnText.textContent = gameLogic.turn ? "Your Turn" : "Black's Turn";
		turnText.style.color = gameLogic.turn ? "White" : "Grey";
	}
}

updateTurnOverlay();
turnOverlay.hidden = true;
popup.style.pointerEvents = "none";
box.hidden = true;
// Add the turn overlay to the scene
const turnOverlayObject = new CSS3DObject(turnOverlay);
scene.add(turnOverlayObject);


function sendActionToOpponent(actionData) { //sends the action data to the opponent
	const message = {
		type: "action",
		room: roomId,
		data: actionData
	};
	socket.send(JSON.stringify(message));
}

document.addEventListener("joinGame", function() { //event listener for when the user joins a game
	initialiseGame();
});

function takeScreenshot() { //takes a screenshot of the game
	const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
	renderer.setSize(window.innerWidth / 5, window.innerHeight / 5);
	renderer.render(scene, camera);
	const dataURL = renderer.domElement.toDataURL("image/png");
	sessionStorage.setItem("screenshot", dataURL);
}



export { takeScreenshot };