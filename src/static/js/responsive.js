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
// Get references to your elements.
const chatPanel = document.getElementById('chatPanel');
const chatButton = document.getElementById('chatButton');
const mainContainer = document.querySelector('main');
const chatCloseButton = document.getElementById('chatCloseButton'); 
const clearChatButton = document.getElementById('clearChatButton');
const chatMessages = document.getElementById('chatMessages');

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

// Adjust the chat panel's positioning responsively.
function adjustChatPanel() {
    if (!mainContainer) return;

    // Mobile view: viewport width is less than 768px.
    if (window.innerWidth < 768) {
        // In mobile view, attach the chat panel to document.body so it is flush with the viewport.
        if (chatPanel.parentElement !== document.body) {
            document.body.appendChild(chatPanel);
        }
        // Use fixed positioning so the panel is flush with the bottom of the viewport.
        chatPanel.classList.remove('absolute');
        chatPanel.classList.add('fixed');

        // Set styles so the panel fills the viewport width and sits at the bottom.
        chatPanel.style.left = '0';
        chatPanel.style.right = '0';
        chatPanel.style.bottom = '0';
        chatPanel.style.top = '';  // clear any top value
        chatPanel.style.width = '100%';
        // Set its height to 75% of the viewport so that the top is visible.
        chatPanel.style.height = '75vh';

        // In mobile view, display the "Chat Me" button only if the chat panel is hidden.
        if (chatPanel.classList.contains('hidden')) {
            chatButton.style.display = 'block';
            // Allow scrolling if the chat panel is not visible.
            document.body.style.overflow = '';
        } else {
            chatButton.style.display = 'none';
            // Disable scrolling when the chat panel is open.
            document.body.style.overflow = 'hidden';
        }
    } else {
        // Desktop view: attach the chat panel to document.body if not already.
        if (chatPanel.parentElement !== document.body) {
            document.body.appendChild(chatPanel);
        }
        // Use fixed positioning for desktop.
        chatPanel.classList.remove('absolute');
        chatPanel.classList.add('fixed');

        // Compute the main container's right edge (accounting for its right padding).
        const containerRect = mainContainer.getBoundingClientRect();
        const mainStyles = window.getComputedStyle(mainContainer);
        const paddingRight = parseFloat(mainStyles.paddingRight) || 0;
        // Align the chat panel’s left edge with the inner right edge of the main container.
        const leftPosition = containerRect.right - paddingRight;
        // Use your desired right gap (28px) for alignment.
        const rightGap = 28;
        const availableWidth = window.innerWidth - leftPosition - rightGap;

        chatPanel.style.left = leftPosition + 'px';
        chatPanel.style.width = (availableWidth > 0 ? availableWidth : 0) + 'px';
        chatPanel.style.right = 'auto'; // remove any mobile override
        chatPanel.style.top = '';
        chatPanel.style.bottom = '';
        chatPanel.style.height = '';    // let your CSS/Tailwind control the height

        // In desktop view, always show the "Chat Me" button.
        chatButton.style.display = '';
        // Ensure scrolling is enabled.
        document.body.style.overflow = '';
    }
}

// Function to scroll the chat messages container to the bottom.
function scrollChatToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Toggle the chat panel when the "Chat Me" button is clicked.
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('hidden');

    // In mobile view, update the "Chat Me" button visibility and scrolling based on chat panel state.
    if (window.innerWidth < 768) {
        if (!chatPanel.classList.contains('hidden')) {
            chatButton.style.display = 'none';
            document.body.style.overflow = 'hidden'; // disable scrolling when chat is open
        } else {
            chatButton.style.display = 'block';
            document.body.style.overflow = '';        // enable scrolling when chat is closed
        }
    }

    // After showing the chat panel, scroll to the bottom of the chat messages.
    if (!chatPanel.classList.contains('hidden')) {
        scrollChatToBottom();
    }
});

// Disable hamburger button clicks in mobile view when the chat panel is open.
hamburger.addEventListener("click", () => {
    // In mobile view, if the chat panel is visible, do not open the mobile menu.
    if (window.innerWidth < 768 && !chatPanel.classList.contains("hidden")) {
        return;
    }
    mobileMenu.classList.toggle("hidden");
});

// If a close button exists inside the chat panel, hide the panel when it's clicked.
if (chatCloseButton) {
    chatCloseButton.addEventListener('click', () => {
        chatPanel.classList.add('hidden');
        if (window.innerWidth < 768) {
            chatButton.style.display = 'block';
            document.body.style.overflow = ''; // re-enable scrolling
        }
    });
}

// Clear all chat messages when the clear chat button is clicked.
if (clearChatButton) {
    clearChatButton.addEventListener('click', () => {
        if (chatMessages) {
            chatMessages.innerHTML = '';
            // Optionally, scroll to the bottom after clearing.
            scrollChatToBottom();
        }
    });
}

// Adjust chat panel positioning on page load and when resizing.
window.addEventListener('load', adjustChatPanel);
window.addEventListener('resize', adjustChatPanel);
