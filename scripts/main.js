const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let w, h, particles = [];
let particleDistance = 40;
let time = 0;

const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
};

// Initialize canvas and animation
function init() {
    resizeReset();
    animationLoop();
}

// Handle resizing while maintaining animation state
function resizeReset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    // Temporarily store new particles
    const newParticles = [];
    for (let y = (((h - particleDistance) % particleDistance) + particleDistance) / 2; y < h; y += particleDistance) {
        for (let x = (((w - particleDistance) % particleDistance) + particleDistance) / 2; x < w; x += particleDistance) {
            newParticles.push(new Particle(x, y));
        }
    }

    // Safely update particles after creating the new set
    particles = newParticles;
}

// Main animation loop
function animationLoop() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White fade effect
    ctx.fillRect(0, 0, w, h); // Fill the canvas for fade effect

    time += 0.1; // Increment time for throbbing effect
    drawScene();
    requestAnimationFrame(animationLoop);
}

// Draw all particles in the scene
function drawScene() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
}

// Track mouse movements, adjusting to canvas coordinates
function mousemove(e) {
    mouse.x = e.clientX; // Use clientX for mouse position relative to viewport
    mouse.y = e.clientY; // Use clientY for mouse position relative to viewport
}

// Reset mouse position when out of canvas
function mouseout() {
    mouse.x = undefined;
    mouse.y = undefined;
}

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSize = Math.random() * 3 + 1; // Random size between 1 and 5
        this.baseX = this.x;
        this.baseY = this.y;
        this.speed = Math.random() * 25 + 5;
        this.throbOffset = Math.random() * Math.PI * 2;
        this.color = "rgba(209, 209, 209, 1)"; // Default color
    }

    draw() {
        let throbbingSize = this.baseSize + Math.sin(time + this.throbOffset) * 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, throbbingSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let directionX = forceDirectionX * force * this.speed;
        let directionY = forceDirectionY * force * this.speed;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
            this.color = "#6370fe";
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
            this.color = "rgba(209, 209, 209, 1)";
        }
    }
}

// Initialize and add event listeners
init();
window.addEventListener("resize", () => {
    // Debounce resizing to avoid lag
    clearTimeout(resizeReset.timer);
    resizeReset.timer = setTimeout(() => {
        resizeReset(); // Resize the canvas and reset particles
        mouse.x = undefined; // Reset mouse position after resize
        mouse.y = undefined;
    }, 100);
});
window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseout", mouseout);
