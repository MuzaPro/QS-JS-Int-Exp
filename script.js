// State Machine for Quantum Source Interactive Experience v6

// State definitions
const states = {
    1: {
        title: "Introduction to Modestly Sized Quantum Computers",
        descriptions: [
            "Welcome to the future of quantum computing. Instead of requiring factory-sized facilities, our technology will bring universal quantum computers to your laboratory.",
            "<span class='highlight'>Use the navigation buttons above</span> to explore the conceptual structure of a quantum computer that fits in your room (instead of <em>being</em> the room)."
        ],
        image: "assets/images/state1-static.webp"
    },
    2: {
        title: "Quantum System Components",
        descriptions: [
            "Our quantum computer consists of three main components: the vacuum chamber housing the qubits, optical fiber memory for photon storage, and classical processing unit.",
            "This small form factor is made possible thanks to our <span class='highlight'>deterministic approach</span>, which eliminates the massive resource overhead of probabilistic systems, making quantum computing accessible and practical."
        ],
        image: "assets/images/state2-static.webp"
    },
    3: {
        title: "Vacuum Chamber",
        descriptions: [
            "Unlike competing technologies requiring extreme cooling, our <span class='highlight'>vacuum chamber operates at room temperature</span>, dramatically reducing infrastructure costs.",
            "The rubidium atoms are perfectly isolated from environmental noise while remaining accessible for precise manipulation and measurement."
        ],
        image: "assets/images/state3-static.webp"
    },
    5: {
        title: "Photonic Quantum Computing",
        descriptions: [
            "this approach utilizes <span class='highlight'>individual photons as qubits,</span>  to carry out quantum operations at room temperature. ", 
            "By leveraging low-loss waveguides and existing fiber networks, this approach offers scalability and low-decoherence pathways toward large-scale quantum processors."
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
    "3-1": "assets/animations/3to1.webm",
    "1-3": "assets/animations/1to3.webm" 
};

// Current state
let currentState = 1;
let isTransitioning = false;
let resizeTimeout; 

// Audio configuration
let soundEnabled = true;
const buttonSound = new Audio('assets/sound/buttonSFX.wav');
buttonSound.volume = 0.05;

// DOM elements
const stateVisual = document.getElementById('stateVisual');
const stateAnimation = document.getElementById('stateAnimation');

// Desktop content elements
const contentArea = document.getElementById('contentArea');
const mainTitle = document.getElementById('mainTitle');
const description1 = document.getElementById('description1');
const description2 = document.getElementById('description2');

// Mobile content elements
const mobileContentArea = document.getElementById('mobileContentArea');
const mobileMainTitle = document.getElementById('mobileMainTitle');
const mobileDescription1 = document.getElementById('mobileDescription1');
const mobileDescription2 = document.getElementById('mobileDescription2');

// Navigation elements
const allNavItems = document.querySelectorAll('.nav-item');
const audioToggleBtn = document.querySelector('.utility-btn[title="Audio"]');

// Detect current layout mode
function getLayoutMode() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    if (width > 768) {
        return 'desktop';
    } else if (width <= 768 && aspectRatio > 1.3) {
        return 'landscape';
    } else {
        return 'portrait';
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupNavListeners();
    setupAudioListeners();
    preloadAnimations();
    updateActiveNav();
    updateContent(currentState);
});

// Setup audio button listeners
function setupAudioListeners() {
    // Add click sound to all nav buttons
    allNavItems.forEach(item => {
        item.addEventListener('click', playButtonSound);
    });
    
    // Add click sound to utility buttons (except audio toggle)
    document.querySelectorAll('.utility-btn:not([title="Audio"])').forEach(btn => {
        btn.addEventListener('click', playButtonSound);
    });
    
    // Setup audio toggle functionality
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            audioToggleBtn.classList.toggle('muted', !soundEnabled);
            
            // Update icon to show muted state if needed
            const audioPath = audioToggleBtn.querySelector('path');
            if (audioPath) {
                if (soundEnabled) {
                    audioPath.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
                } else {
                    audioPath.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
                }
            }
        });
    }
}

// Setup navigation listeners
function setupNavListeners() {
    allNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = Number(item.dataset.state);
            if (!isTransitioning && target !== currentState && states[target]) {
                transitionToState(target);
            }
        });
    });
}

// Update active navigation state for both desktop and mobile
function updateActiveNav() {
    allNavItems.forEach(item => {
        item.classList.toggle('active', Number(item.dataset.state) === currentState);
    });
}

// Preload animations for smooth playback
function preloadAnimations() {
    Object.values(animations).forEach(path => {
        const video = document.createElement('video');
        video.src = path;
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('disablePictureInPicture', '');
        video.setAttribute('controls', 'false');
        video.onerror = () => {
            console.warn(`Unable to preload animation: ${path}`);
        };
    });
}

// Play button sound function
function playButtonSound() {
    if (soundEnabled) {
        try {
            const soundClone = buttonSound.cloneNode();
            soundClone.volume = 0.05;
            soundClone.play().catch(err => console.warn('Audio playback error:', err));
        } catch (err) {
            console.warn('Audio error:', err);
        }
    }
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
            else {
                // Fallback to instant transition
                console.log(`No animation found for transition ${currentState}-${targetState}, using instant transition`);
                await instantTransition(targetState);
            }
        }

        // Fade out current content based on layout mode
        const layoutMode = getLayoutMode();
        
        if (layoutMode === 'portrait') {
            if (mobileContentArea) {
                mobileContentArea.classList.add('fade-out');
            }
        } else { // desktop or landscape
            if (contentArea) {
                contentArea.classList.add('fade-out');
            }
        }
        
        await wait(300);

        // Update content
        updateContent(targetState);

        // Update state
        currentState = targetState;

        // Update nav state
        updateActiveNav();

        // Fade in new content
        if (layoutMode === 'portrait') {
            if (mobileContentArea) {
                mobileContentArea.classList.remove('fade-out');
            }
        } else { // desktop or landscape
            if (contentArea) {
                contentArea.classList.remove('fade-out');
            }
        }
    } catch (error) {
        console.error('Transition error:', error);
        // Recovery in case of error
        updateContent(targetState);
        currentState = targetState;
        updateActiveNav();
        if (contentArea) {
            contentArea.classList.remove('fade-out');
        }
        if (mobileContentArea) {
            mobileContentArea.classList.remove('fade-out');
        }
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
        
        // Second leg: direct from intermediate to target
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
                // Adjust portrait layout after image loads
                setTimeout(() => {
                    adjustPortraitLayout();
                }, 50);
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
                    adjustPortraitLayout(); // Add this line
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

// Update content for given state (both desktop and mobile)
function updateContent(stateId) {
    const state = states[stateId];
    if (!state) return;

    const layoutMode = getLayoutMode();

    // Update desktop/landscape content
    if (layoutMode === 'desktop' || layoutMode === 'landscape') {
        if (mainTitle) {
            mainTitle.innerHTML = state.title;
        }
        if (description1) {
            description1.innerHTML = state.descriptions[0] || '';
        }
        if (description2) {
            description2.innerHTML = state.descriptions[1] || '';
        }
    }

    // Update mobile portrait content
    if (layoutMode === 'portrait') {
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

// Function to adjust portrait layout
function adjustPortraitLayout() {
    const layoutMode = getLayoutMode();
    
    if (layoutMode === 'portrait') {
        const mobileContentStrip = document.querySelector('.mobile-content-strip');
        const stateVisual = document.getElementById('stateVisual');
        const mobileNavBar = document.querySelector('.mobile-nav-bar');
        
        if (mobileContentStrip && stateVisual && mobileNavBar) {
            // Get the height of the nav bar
            const navHeight = mobileNavBar.offsetHeight;
            
            // Get the displayed height of the image
            const imageRect = stateVisual.getBoundingClientRect();
            const imageBottom = imageRect.bottom;
            
            // Position content strip right after the image
            mobileContentStrip.style.position = 'fixed';
            mobileContentStrip.style.top = imageBottom + 'px';
            mobileContentStrip.style.bottom = 'auto';
            mobileContentStrip.style.maxHeight = `calc(100vh - ${imageBottom}px - 20px)`;
        }
    }
}

// Call on load and resize
window.addEventListener('load', adjustPortraitLayout);
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustPortraitLayout();
        updateContent(currentState);
    }, 250);
});

// Also call after image loads or transitions
stateVisual.addEventListener('load', adjustPortraitLayout);

/* 
 * Transition Logic Summary:
 * Direct transitions: 1↔2, 1↔5, 2↔3, 3→1, 1→3
 * Compound transitions:
 * - 2→5, 3→5: go through state 1 first
 * - 5→2, 5→3: go through state 1 first
 */