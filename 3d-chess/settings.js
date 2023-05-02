// Create the HTML structure for the settings popup
function createSettingsPopup() {
	const popup = document.createElement("div");
	popup.classList.add("settings-popup");

	const popupContent = document.createElement("div");
	popupContent.classList.add("settings-popup-content");
	popupContent.addEventListener("click", (event) => {
		event.stopPropagation();
	});
	popup.appendChild(popupContent);

	const settingsHeader = document.createElement("h2");
	settingsHeader.textContent = "Settings";
	settingsHeader.style.color = "#f1c453";
	settingsHeader.style.marginBottom = "20px";
	popupContent.appendChild(settingsHeader);

	const container = document.createElement("div");
	container.id = "settings-container";
	popupContent.appendChild(container);

	// Mode settings
	const modeLabel = document.createElement("label");
	modeLabel.textContent = "Mode:";
	modeLabel.style.color = "#f1c453";
	modeLabel.style.marginBottom = "5px";
	container.appendChild(modeLabel);

	const modes = ["Standard", "Wizard", "Night"];
	modes.forEach((mode) => {
		const modeInput = document.createElement("input");
		modeInput.type = "radio";
		modeInput.id = mode;
		modeInput.name = "mode";
		modeInput.value = mode;
		modeInput.addEventListener("change", () => {
			sessionStorage.setItem("selectedMode", mode);
		});

		container.appendChild(modeInput);

		const modeInputLabel = document.createElement("label");
		modeInputLabel.setAttribute("for", mode);
		modeInputLabel.textContent = mode;
		modeInputLabel.style.color = "#f1c453";
		modeInputLabel.style.marginRight = "10px";
		container.appendChild(modeInputLabel);
	});

	container.appendChild(document.createElement("br"));
	container.appendChild(document.createElement("br"));

	// Color settings
	const colors = [
		{ label: "White Pieces", id: "whitePieces", storageKey: "whitePiecesColor" },
		{ label: "Black Pieces", id: "blackPieces", storageKey: "blackPiecesColor" },
	];

	colors.forEach((color) => {
		const colorContainer = document.createElement("div");
		colorContainer.classList.add("color-container");

		const colorLabel = document.createElement("label");
		colorLabel.textContent = color.label + " Pieces:";
		colorContainer.appendChild(colorLabel);

		const colorInput = document.createElement("input");
		colorInput.type = "color";
		colorInput.id = color.id;
		colorInput.name = color.id;
		colorInput.value = sessionStorage.getItem(color.storageKey) || color.defaultColor; // Set the initial value to the stored value or the default
		colorInput.addEventListener("change", () => {
			sessionStorage.setItem(color.storageKey, colorInput.value);
		});
		colorContainer.appendChild(colorInput);

		container.appendChild(colorContainer);
	});

	const confirmButton = document.createElement("button");
	confirmButton.textContent = "Confirm";
	confirmButton.style.backgroundColor = "#f1c453";
	confirmButton.style.color = "#1c2a3a";
	confirmButton.style.padding = "0.8rem 2rem";
	confirmButton.style.fontSize = "1.2rem";
	confirmButton.style.fontWeight = "700";
	confirmButton.style.borderRadius = "5px";
	confirmButton.style.textDecoration = "none";
	confirmButton.style.cursor = "pointer";
	confirmButton.style.transition = "background-color 0.3s, box-shadow 0.3s";
	confirmButton.addEventListener("mouseover", () => {
		confirmButton.style.backgroundColor = "#ffd700";
		confirmButton.style.boxShadow = "0 0 10px #f1c453";
	});
	confirmButton.addEventListener("mouseout", () => {
		confirmButton.style.backgroundColor = "#f1c453";
		confirmButton.style.boxShadow = "none";
	});
	confirmButton.addEventListener("click", () => {
		location.reload();
	});
	container.appendChild(confirmButton);

	const closeButton = document.createElement("button");
	closeButton.textContent = "X";
	closeButton.style.position = "absolute";
	closeButton.style.top = "10px";
	closeButton.style.right = "20px";
	closeButton.style.background = "none";
	closeButton.style.border = "none";
	closeButton.style.fontSize = "24px";
	closeButton.style.color = "#f1c453";
	closeButton.style.cursor = "pointer";
	closeButton.addEventListener("click", () => {
		document.body.removeChild(popup);
	});
	popupContent.appendChild(closeButton);
	document.body.appendChild(popup);

	return popup;
}

// Show the settings popup when the settings menu option is clicked
function showSettingsPopup() {
	const popup = createSettingsPopup();
	const closeButton = popup.querySelector("button");
	closeButton.addEventListener("click", () => {
		document.body.removeChild(popup);
	});
}

const settingsLink = document.querySelector("nav li a#settings");
settingsLink.addEventListener("click", (event) => {

	event.preventDefault();
	showSettingsPopup();
});