const initialPhrase = "Hello, I'm Ade Fiqri";
const staticText = "Hello, I'm ";
const phrases = [
    "Ade Fiqri",
    "AI Researcher",
    "AI Engineer"
];

let isInitialPhase = true;
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let textContent = document.getElementById('text-content');

function typeText() {
    if (isInitialPhase) {
        // Type the initial complete phrase
        textContent.textContent = initialPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === initialPhrase.length) {
            isInitialPhase = false;
            setTimeout(() => {
                isDeleting = true;
                currentCharIndex = phrases[0].length;
                typeText();
            }, 2000);
            return;
        }
        
        setTimeout(typeText, 150);
        return;
    }
    
    const currentPhrase = staticText + phrases[currentPhraseIndex];
    
    if (isDeleting) {
        // Only delete the dynamic part
        const dynamicPart = currentPhrase.substring(staticText.length, staticText.length + currentCharIndex - 1);
        textContent.textContent = staticText + dynamicPart;
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        }
    } else {
        // Type only the dynamic part
        const dynamicPart = phrases[currentPhraseIndex].substring(0, currentCharIndex + 1);
        textContent.textContent = staticText + dynamicPart;
        currentCharIndex++;
        
        if (currentCharIndex === phrases[currentPhraseIndex].length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
            return;
        }
    }
    
    const typingSpeed = isDeleting ? 50 : 150;
    setTimeout(typeText, typingSpeed);
}

// Start the animation
typeText();