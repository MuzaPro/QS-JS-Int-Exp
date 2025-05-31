// State Machine for Quantum Source Interactive Experience v5

// State definitions
const states = {
    1: {
        title: "Introduction to Modestly Sized Quantum Computing",
        descriptions: [
            "Welcome to the future of quantum computing. Instead of requiring factory-sized facilities, our technology brings universal quantum computers to your laboratory.",
            "The text will introduce the interactive elements and invite visitors to explore the conceptual structure of a quantum computer that fits in your room (instead of <em>being</em> the room)."
        ],
        image: "assets/images/state1-static.webp"
    },
    2: {
        title: "Quantum System Components",
        descriptions: [
            "Our quantum computer consists of three main components: the vacuum chamber housing the qubits, optical fiber memory for photon storage, and classical processing unit.",
            "This <span class='highlight'>deterministic approach</span> eliminates the massive resource overhead of probabilistic systems, making quantum computing accessible and practical."
        ],
        image: "assets/images/state2-static.webp"
    },
    3: {
        title: "Room Temperature Advantage",
        descriptions: [
            "Unlike competing technologies requiring extreme cooling, our <span class='highlight'>vacuum chamber operates at room temperature</span>, dramatically reducing infrastructure costs.",
            "The rubidium atoms are perfectly isolated from environmental noise while remaining accessible for precise manipulation and measurement."
        ],
        image: "assets/images/state3-static.webp"
    },
    5: {
        title: "Breakthrough Technology",
        descriptions: [
            "Our <span class='highlight'>photon-atom integration</span> achieves deterministic quantum operations with 10,000x greater efficiency than probabilistic approaches.",
            "This technology enables the construction of million-qubit systems in compact form factors, bringing practical quantum computing within reach of enterprises and governments worldwide."
        ],
        image: "assets/images/state5-static.webp"
    }
};

// Animation paths
const animations = {
    "1-2": "assets/animations/1to2.webm",
    "2-1": "assets/animations/2to1.webm",
    "1-5": "assets/animations/1to5.webm",
    "5-1": "assets/animations/5to1.webm",
    "2-3": "assets/animations/2to3.webm",
    "3-2": "assets/animations/3to2.webm",
    "3-1": "assets/animations/3to1.webm"  // Added direct 3->1 transition
};

// Current state
let currentState = 1;
let isTransitioning = false;

// DOM elements
const stateVisual = document.getElementById('stateVisual');
const stateAnimation = document.getElementById('stateAnimation');
const contentArea = document.getElementById('contentArea');
const mainTitle = document.getElementById('mainTitle');
const description1 = document.getElementById('description1');
const description2 = document.getElementById('description2');
// Mobile content elements
const mobileContentArea = document.getElementById('mobileContentArea');
const mobileMainTitle = document.getElementById('mobileMainTitle');
const mobileDescription1 = document.getElementById('mobileDescription1');
const mobileDescription2 = document.getElementById('mobileDescription2');
const navItems = document.querySelectorAll('.nav-item');

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupNavListeners();
    preloadAnimations();
    updateActiveNav();
});

// Setup navigation listeners
function setupNavListeners() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = Number(item.dataset.state);
            if (!isTransitioning && target !== currentState && states[target]) {
                transitionToState(target);
            }
        });
    });
}

// Update active navigation state
function updateActiveNav() {
    navItems.forEach(item => {
        item.classList.toggle('active', Number(item.dataset.state) === currentState);
    });
}

// Preload animations for smooth playback
function preloadAnimations() {
    Object.values(animations).forEach(path => {
        const video = document.createElement('video');
        video.src = path;
        video.preload = 'auto';
        video.onerror = () => {
            console.warn(`Unable to preload animation: ${path}`);
        };
    });
}

// Main transition function
async function transitionToState(targetState) {
    if (isTransitioning || targetState === currentState || !states[targetState]) return;

    isTransitioning = true;

    const key = `${currentState}-${targetState}`;
    const animationPath = animations[key];
    
    try {
        // Check if direct animation exists
        if (animationPath) {
            console.log(`Playing direct transition: ${currentState} → ${targetState}`);
            await playTransitionAnimation(animationPath, targetState);
        } 
        // Handle compound transitions
        else {
            // For 2->5 or 3->5: go through state 1 first
            if ((currentState === 2 && targetState === 5) || 
                (currentState === 3 && targetState === 5)) {
                console.log(`Using compound transition: ${currentState} → 1 → ${targetState}`);
                await performCompoundTransition(currentState, 1, targetState);
            }
            // For 5->2 or 5->3: go through state 1 first  
            else if ((currentState === 5 && targetState === 2) ||
                     (currentState === 5 && targetState === 3)) {
                console.log(`Using compound transition: ${currentState} → 1 → ${targetState}`);
                await performCompoundTransition(currentState, 1, targetState);
            }
            // For 1->3: go through state 2
            else if (currentState === 1 && targetState === 3) {
                console.log(`Using compound transition: ${currentState} → 2 → ${targetState}`);
                await performCompoundTransition(currentState, 2, targetState);
            }
            else {
                // Fallback to instant transition
                console.log(`No animation found for transition ${currentState}-${targetState}, using instant transition`);
                await instantTransition(targetState);
            }
        }

        // Fade out current content
        contentArea.classList.add('fade-out');
        await wait(300);

        // Update content
        updateContent(targetState);

        // Update state
        currentState = targetState;

        // Update nav state
        updateActiveNav();

        // Fade in new content
        contentArea.classList.remove('fade-out');
    } catch (error) {
        console.error('Transition error:', error);
        // Recovery in case of error
        updateContent(targetState);
        currentState = targetState;
        updateActiveNav();
        contentArea.classList.remove('fade-out');
    } finally {
        isTransitioning = false;
    }
}

// Compound transition through intermediate state
async function performCompoundTransition(fromState, intermediateState, toState) {
    console.log(`Starting compound transition: ${fromState} → ${intermediateState} → ${toState}`);
    
    try {
        // First leg: from current to intermediate
        const firstKey = `${fromState}-${intermediateState}`;
        const firstAnimation = animations[firstKey];
        
        if (firstAnimation) {
            await playTransitionAnimation(firstAnimation, intermediateState);
            console.log(`First leg complete: ${fromState} → ${intermediateState}`);
        } else {
            await instantTransition(intermediateState);
            console.log(`First leg complete (instant): ${fromState} → ${intermediateState}`);
        }
        
        // Brief pause between animations
        await wait(100);
        
        // Second leg: from intermediate to target
        const secondKey = `${intermediateState}-${toState}`;
        const secondAnimation = animations[secondKey];
        
        if (secondAnimation) {
            await playTransitionAnimation(secondAnimation, toState);
            console.log(`Second leg complete: ${intermediateState} → ${toState}`);
        } else {
            await instantTransition(toState);
            console.log(`Second leg complete (instant): ${intermediateState} → ${toState}`);
        }
        
        console.log(`Compound transition complete: ${fromState} → ${intermediateState} → ${toState}`);
    } catch (error) {
        console.error('Error in compound transition:', error);
        // Fallback to direct instant transition
        await instantTransition(toState);
    }
}

// Instant transition fallback when no animation exists
function instantTransition(targetState) {
    return new Promise((resolve) => {
        const newState = states[targetState];
        if (newState && newState.image) {
            const tempImg = new Image();
            tempImg.onload = () => {
                stateVisual.src = tempImg.src;
                resolve();
            };
            tempImg.onerror = () => {
                console.warn(`Failed to load image: ${newState.image}`);
                resolve();
            };
            tempImg.src = newState.image;
        } else {
            resolve();
        }
    });
}

// Play transition animation
function playTransitionAnimation(animationPath, targetState) {
    return new Promise((resolve, reject) => {
        stateAnimation.src = animationPath;

        stateAnimation.onloadedmetadata = () => {
            stateAnimation.currentTime = 0;
            stateAnimation.playbackRate = 1;

            // Show the video instantly
            stateAnimation.classList.add('playing');
            stateAnimation
                .play()
                .catch(err => {
                    console.error('Playback error:', err);
                    updateToTargetImage();
                });
        };

        stateAnimation.onended = () => {
            updateToTargetImage();
        };

        stateAnimation.onerror = () => {
            console.error(`Failed to load animation: ${animationPath}`);
            // Fallback to instant transition
            instantTransition(targetState).then(resolve).catch(reject);
        };

        function updateToTargetImage() {
            const newState = states[targetState];
            if (newState && newState.image) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    stateVisual.src = tempImg.src;
                    setTimeout(() => {
                        stateAnimation.classList.remove('playing');
                        resolve();
                    }, 50);
                };
                tempImg.onerror = () => {
                    console.warn(`Failed to load image: ${newState.image}`);
                    stateAnimation.classList.remove('playing');
                    resolve();
                };
                tempImg.src = newState.image;
            } else {
                stateAnimation.classList.remove('playing');
                resolve();
            }
        }
    });
}

// Update content for given state
function updateContent(stateId) {
    const state = states[stateId];
    if (!state) return;

    // Update desktop content
    mainTitle.innerHTML = state.title;
    description1.innerHTML = state.descriptions[0] || '';
    description2.innerHTML = state.descriptions[1] || '';

    // Update mobile content
    if (mobileMainTitle) {
        mobileMainTitle.innerHTML = state.title;
    }
    if (mobileDescription1) {
        mobileDescription1.innerHTML = state.descriptions[0] || '';
    }
    if (mobileDescription2) {
        mobileDescription2.innerHTML = state.descriptions[1] || '';
    }
}

// Utility delay function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state?.stateId !== undefined) {
        transitionToState(event.state.stateId);
    }
});

/* 
 * Transition Logic Summary:
 * Direct transitions: 1↔2, 1↔5, 2↔3, 3→1
 * Compound transitions:
 * - 1→3: goes through state 2
 * - 2→5, 3→5: go through state 1 first
 * - 5→2, 5→3: go through state 1 first
 */