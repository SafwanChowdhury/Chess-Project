function createParticle() {
	const particle = document.createElement("div");
	particle.classList.add("particle");
	return particle;
}

function addParticleToElement(element) {
	const particle = createParticle();
	element.appendChild(particle);

	// Set random position, angle, and animation duration
	const angle = Math.random() * Math.PI * 2;
	const distance = Math.random() * 20 + 10;
	const xPos = element.clientWidth / 2 + Math.cos(angle) * distance;
	const yPos = element.clientHeight / 2 + Math.sin(angle) * distance;
	const duration = Math.random() * 0.6 + 1;

	particle.style.left = `${xPos}px`;
	particle.style.top = `${yPos}px`;
	particle.style.width = `${2 + Math.random() * 2}px`;
	particle.style.height = `${2 + Math.random() * 2}px`;
	particle.style.animationDuration = `${duration}s`;

	// Remove the particle after the animation ends
	setTimeout(() => {
		particle.remove();
	}, duration * 1000);
}

let activeElement = null;
let interval;

function clearParticles(element) {
	const particles = element.querySelectorAll(".particle");
	particles.forEach((particle) => particle.remove());
}

function stopParticleGeneration() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
}

document.querySelectorAll("nav a").forEach((menuItem) => {
	menuItem.addEventListener("mouseenter", () => {
		if (activeElement && activeElement !== menuItem) {
			clearParticles(activeElement);
			stopParticleGeneration();
		}
		activeElement = menuItem;

		if (!interval) {
			interval = setInterval(() => {
				const numParticles = 1;
				for (let i = 0; i < numParticles; i++) {
					addParticleToElement(menuItem);
				}
			}, 100); // Generate particles every 100ms
		}
	});

	menuItem.addEventListener("mouseleave", () => {
		if (activeElement === menuItem) {
			stopParticleGeneration();
		}
	});
});

