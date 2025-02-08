// Get initial screen dimensions
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// Calculate base values for different screen sizes
function calculateResponsiveValues() {
    // Calculate screen area in pixels
    const screenArea = screenWidth * screenHeight;
    
    // Base density (dots per million pixels)
    const DOT_DENSITY = 10; // Adjust this value to change overall dot density
    
    // Calculate total dots based on screen area
    const calculatedDots = Math.floor((screenArea * DOT_DENSITY) / 1000000);
    
    // Set minimum and maximum dots
    const MIN_DOTS = 100;
    const MAX_DOTS = 300;
    
    // Clamp the number of dots between min and max
    return {
        totalDots: Math.min(Math.max(calculatedDots, MIN_DOTS), MAX_DOTS),
        // Scale dot size based on screen width
        minDotSize: Math.max(screenWidth * 0.001, 0.5),  // Minimum 0.5px
        maxDotSize: Math.max(screenWidth * 0.002, 1.5)   // Minimum 1.5px
    };
}

// Initial responsive values
let responsiveValues = calculateResponsiveValues();

// CUSTOMIZABLE: Cursor interaction radius (in pixels)
const INTERACTION_RADIUS = Math.min(screenWidth, screenHeight) * 0.1; // 10% of smallest screen dimension
const REPULSION_STRENGTH = 4; // Adjust this value to change repulsion strength

let dots = [];
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    // Recalculate responsive values
    responsiveValues = calculateResponsiveValues();
    
    // Recreate dots with new values
    createDots();
}

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Size now uses responsive values
        this.size = Math.random() * 
            (responsiveValues.maxDotSize - responsiveValues.minDotSize) + 
            responsiveValues.minDotSize;

        // Speed scales with screen size
        const baseSpeed = Math.min(screenWidth, screenHeight) * 0.0004;
        this.speedX = (Math.random() - 0.5) * baseSpeed;
        this.speedY = (Math.random() - 0.5) * baseSpeed;

        this.fadeSpeed = Math.random() * 0.02 + 0.005;
        this.fadingIn = Math.random() < 0.5;
        this.opacity = this.fadingIn ? 0 : Math.random() * 0.5 + 0.5;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < INTERACTION_RADIUS) {
            const angle = Math.atan2(dy, dx);
            const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
            this.x -= Math.cos(angle) * force * REPULSION_STRENGTH;
            this.y -= Math.sin(angle) * force * REPULSION_STRENGTH;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > screenWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > screenHeight) this.speedY *= -1;

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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function createDots() {
    dots = []; // Clear existing dots
    for (let i = 0; i < responsiveValues.totalDots; i++) {
        dots.push(new Dot(
            Math.random() * screenWidth,
            Math.random() * screenHeight
        ));
    }
}

function animate() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    dots.forEach(dot => {
        dot.update(lastX, lastY);
        dot.draw();
    });
    requestAnimationFrame(animate);
}

// Initialize
let lastX = 0;
let lastY = 0;

document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    document.documentElement.style.setProperty('--x', lastX + 'px');
    document.documentElement.style.setProperty('--y', lastY + 'px');
});

// Handle window resize
window.addEventListener('resize', debounce(resizeCanvas, 250));

// Debounce function to prevent excessive resizing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initial setup
resizeCanvas();
animate();