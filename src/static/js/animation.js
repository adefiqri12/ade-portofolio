let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    updateGradientPosition();
});

window.addEventListener('scroll', updateGradientPosition);

function updateGradientPosition() {
    const x = lastX + window.scrollX;
    const y = lastY + window.scrollY;
    
    document.documentElement.style.setProperty('--x', x + 'px');
    document.documentElement.style.setProperty('--y', y + 'px');
}

// Initialize gradient position
updateGradientPosition();