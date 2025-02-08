const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Snap scroll mechanics
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section:not(#hero)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});


// project cards animation
document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projectsGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const projectCards = Array.from(projectsGrid.children);
    const totalProjects = projectCards.length;
    const cardsPerPage = 2;
    let currentStartIndex = 0;
    let isAnimating = false;

    // Initial setup
    updateVisibility();

    // Handle next button click
    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Slide animation
        projectsGrid.style.transform = 'translateX(-20px)';
        projectsGrid.style.opacity = '0';

        setTimeout(() => {
            currentStartIndex = (currentStartIndex + cardsPerPage) % totalProjects;
            updateVisibility();
            projectsGrid.style.transform = 'translateX(20px)';

            requestAnimationFrame(() => {
                projectsGrid.style.transform = 'translateX(0)';
                projectsGrid.style.opacity = '1';
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            });
        }, 500);
    });

    // Handle previous button click
    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Slide animation
        projectsGrid.style.transform = 'translateX(20px)';
        projectsGrid.style.opacity = '0';

        setTimeout(() => {
            currentStartIndex = (currentStartIndex - cardsPerPage + totalProjects) % totalProjects;
            updateVisibility();
            projectsGrid.style.transform = 'translateX(-20px)';

            requestAnimationFrame(() => {
                projectsGrid.style.transform = 'translateX(0)';
                projectsGrid.style.opacity = '1';
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            });
        }, 500);
    });

    function updateVisibility() {
        projectCards.forEach((card, index) => {
            // Calculate the shifted index for infinite loop
            let shiftedIndex = (index - currentStartIndex + totalProjects) % totalProjects;
            if (shiftedIndex < cardsPerPage) {
                card.style.display = 'block';
                card.style.order = shiftedIndex;
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Chat panel
const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const chatCloseButton = document.getElementById('chatCloseButton');
const clearChatButton = document.getElementById('clearChatButton');
const chatMessages = document.getElementById('chatMessages');

// Toggle the chat panel when the "Chat Me" button is clicked.
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('hidden');
});

// Hide the chat panel when the close button is clicked.
chatCloseButton.addEventListener('click', () => {
    chatPanel.classList.add('hidden');
});

// Clear all chat messages when the clear chat button is clicked.
clearChatButton.addEventListener('click', () => {
    chatMessages.innerHTML = '';
});