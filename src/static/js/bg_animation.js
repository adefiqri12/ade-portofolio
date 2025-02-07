
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;

// CUSTOMIZABLE: Number of dots to create
const TOTAL_DOTS = 120;

// CUSTOMIZABLE: Cursor interaction radius (in pixels)
const INTERACTION_RADIUS = 100; // How close cursor needs to be to affect dots

// CUSTOMIZABLE: Cursor attraction force
const ATTRACTION_STRENGTH = 0.3;

let dots = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // CUSTOMIZABLE: Dot size range
        this.size = Math.random() * 2 + 1; // Random size between 1-3px

        // CUSTOMIZABLE: Base movement speed
        const baseSpeed = 0.5; // Increase this value for faster movement
        this.speedX = (Math.random() - 0.5) * baseSpeed;
        this.speedY = (Math.random() - 0.5) * baseSpeed;

        // CUSTOMIZABLE: Fade animation speed
        this.fadeSpeed = Math.random() * 0.02 + 0.005; // Higher values = faster fade (Fade in/out speed)

        // CUSTOMIZABLE: Initial opacity settings
        this.fadingIn = Math.random() < 0.5;
        this.opacity = this.fadingIn ? 0 : Math.random() * 0.5 + 0.5; // Max opacity 0.5-1.0
    }

    update(mouseX, mouseY) {
        // Calculate distance to cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // CUSTOMIZABLE: Cursor interaction
        if (distance < INTERACTION_RADIUS) {
            const angle = Math.atan2(dy, dx);
            const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
            this.x += Math.cos(angle) * force * ATTRACTION_STRENGTH;
            this.y += Math.sin(angle) * force * ATTRACTION_STRENGTH;
        }

        // Apply movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Handle fade animation
        if (this.fadingIn) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.fadingIn = false;
            }
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) {
                this.opacity = 0;
                this.fadingIn = true;
            }
        }
    }

    draw() {
        // CUSTOMIZABLE: Dot color and appearance
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Change RGB values for different colors
        ctx.fill();
    }
}

function createDots() {
    for (let i = 0; i < TOTAL_DOTS; i++) {
        dots.push(new Dot(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}
createDots();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        dot.update(lastX, lastY);
        dot.draw();
    });
    requestAnimationFrame(animate);
}

document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    document.documentElement.style.setProperty('--x', lastX + 'px');
    document.documentElement.style.setProperty('--y', lastY + 'px');
});

animate();