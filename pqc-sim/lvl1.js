class WSystemDemo {
    constructor() {
        this.controlFieldActive = false;
        this.atomState = 'sr';
        this.isAnimating = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.controlToggle = document.getElementById('controlToggle');
        this.photonButton = document.getElementById('photonButton');
        this.operationMode = document.getElementById('operationMode');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.controlBeam = document.getElementById('controlBeam');
        this.inputPhoton = document.getElementById('inputPhoton');
        this.outputPhoton = document.getElementById('outputPhoton');
        
        // State population indicators
        this.populations = {
            sr: document.getElementById('sr-pop'),
            sl: document.getElementById('sl-pop'),
            e0: document.getElementById('e0-pop'),
            el: document.getElementById('el-pop'),
            er: document.getElementById('er-pop')
        };

        // Electrons in excited states
        this.electrons = {
            e0: document.getElementById('e0-electron'),
            el: document.getElementById('el-electron'),
            er: document.getElementById('er-electron')
        };

        // Energy levels
        this.levels = {
            e0: document.getElementById('e0-level'),
            el: document.getElementById('el-level'),
            er: document.getElementById('er-level')
        };

        // Transition pathways
        this.pathways = {
            swap: document.getElementById('swapPath'),
            cz1: document.getElementById('czPath1'),
            cz2: document.getElementById('czPath2')
        };

        // Step indicators
        this.steps = [
            document.getElementById('step1'),
            document.getElementById('step2'),
            document.getElementById('step3'),
            document.getElementById('step4')
        ];
    }

    bindEvents() {
        this.controlToggle.addEventListener('click', () => {
            this.toggleControlField();
        });

        this.photonButton.addEventListener('click', () => {
            this.sendPhoton();
        });
    }

    toggleControlField() {
        this.controlFieldActive = !this.controlFieldActive;
        this.updateDisplay();
    }

    async sendPhoton() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.photonButton.disabled = true;
        this.clearSteps();
        
        if (this.controlFieldActive) {
            await this.performCZGate();
        } else {
            await this.performSWAPGate();
        }

        setTimeout(() => {
            this.isAnimating = false;
            this.photonButton.disabled = false;
            this.clearSteps();
        }, 3000);
    }

    async performSWAPGate() {
        // Step 1: Photon approaches
        this.activateStep(0);
        this.inputPhoton.style.opacity = '1';
        await this.delay(1500);

        // Step 2: Absorption |sr⟩ → |e0⟩
        this.activateStep(1);
        this.populations.sr.classList.remove('active');
        this.populations.e0.classList.add('active');
        this.electrons.e0.classList.add('active');
        this.inputPhoton.style.opacity = '0';
        await this.delay(1500);

        // Step 3: Quantum interference
        this.activateStep(2);
        await this.delay(1500);

        // Step 4: Emission |e0⟩ → |sl⟩ + photon
        this.activateStep(3);
        this.populations.e0.classList.remove('active');
        this.electrons.e0.classList.remove('active');
        this.populations.sl.classList.add('active');
        this.outputPhoton.style.opacity = '1';
        this.atomState = 'sl';
        
        this.updateStatus("SWAP completed: Photon absorbed |sr⟩→|e0⟩, then SPRINT emission |e0⟩→|sl⟩ + photon (different mode). Quantum states exchanged!");
        
        await this.delay(2000);
        this.outputPhoton.style.opacity = '0';
    }

    async performCZGate() {
        // Step 1: Photon approaches
        this.activateStep(0);
        this.steps[1].textContent = "2. Virtual interaction with |er⟩ state";
        this.steps[2].textContent = "3. Photon acquires conditional phase";
        this.steps[3].textContent = "4. Photon exits unchanged, atom in |sr⟩";
        
        this.inputPhoton.style.opacity = '1';
        await this.delay(1200);

        // Step 2: Virtual interaction
        this.activateStep(1);
        this.electrons.er.classList.add('active');
        await this.delay(1200);

        // Step 3: Phase acquisition
        this.activateStep(2);
        this.inputPhoton.style.transform = 'rotate(180deg)'; // Visual indication of phase
        await this.delay(1200);

        // Step 4: Exit
        this.activateStep(3);
        this.electrons.er.classList.remove('active');
        this.outputPhoton.style.opacity = '1';
        this.inputPhoton.style.opacity = '0';
        this.inputPhoton.style.transform = 'rotate(0deg)';
        
        this.updateStatus("CZ Gate: Photon acquired conditional phase through virtual interaction with |er⟩. Atom remains in |sr⟩ state. No state exchange.");
        
        await this.delay(2000);
        this.outputPhoton.style.opacity = '0';
    }

    activateStep(stepIndex) {
        // Keep all previous steps active and add the new one
        this.steps.forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('active');
            }
        });
    }

    clearSteps() {
        this.steps.forEach(step => step.classList.remove('active'));
        // Reset step text
        this.steps[1].textContent = "2. Atom absorbs photon (|sr⟩ → |e0⟩)";
        this.steps[2].textContent = "3. Quantum interference in emission";
        this.steps[3].textContent = "4. Atom emits to |sl⟩ + photon (different mode)";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateDisplay() {
        // Update control toggle button
        if (this.controlFieldActive) {
            this.controlToggle.textContent = 'Control Field ON';
            this.controlToggle.classList.add('active');
            this.controlBeam.classList.add('active');
        } else {
            this.controlToggle.textContent = 'Control Field OFF';
            this.controlToggle.classList.remove('active');
            this.controlBeam.classList.remove('active');
        }

        // Update operation mode and pathways
        const modeTitle = this.operationMode.querySelector('h4');
        const modeDesc = this.operationMode.querySelector('p');
        
        if (this.controlFieldActive) {
            modeTitle.textContent = 'CZ Mode';
            modeDesc.textContent = 'Control field blocks |e0⟩ transitions. Only |sl⟩↔|el⟩ and |sr⟩↔|er⟩ active.';
            
            // Block e0 transitions
            this.levels.e0.classList.add('blocked');
            this.pathways.swap.classList.remove('active');
            this.pathways.swap.classList.add('blocked');
            this.pathways.cz1.classList.add('active');
            this.pathways.cz2.classList.add('active');
            
            this.updateStatus("Control field ON: Couples |e0⟩ to 6S₁/₂ manifold, blocking SPRINT pathway. System configured for CZ operations via |sl⟩↔|el⟩ and |sr⟩↔|er⟩.");
        } else {
            modeTitle.textContent = 'SWAP Mode';
            modeDesc.textContent = 'All transitions active. SPRINT mechanism: |sl⟩↔|e0⟩↔|sr⟩ pathway enables state exchange.';
            
            // Enable all transitions
            this.levels.e0.classList.remove('blocked');
            this.pathways.swap.classList.add('active');
            this.pathways.swap.classList.remove('blocked');
            this.pathways.cz1.classList.remove('active');
            this.pathways.cz2.classList.remove('active');
            
            this.updateStatus("Control field OFF: All W-system transitions available. SPRINT pathway |sl⟩↔|e0⟩↔|sr⟩ enables deterministic photon-atom state exchange.");
        }

        this.updateAtomStateDisplay();
    }

    updateAtomStateDisplay() {
        // Clear all ground state populations
        this.populations.sr.classList.remove('active');
        this.populations.sl.classList.remove('active');
        
        // Show current state
        if (this.populations[this.atomState]) {
            this.populations[this.atomState].classList.add('active');
        }
    }

    updateStatus(message) {
        const statusText = this.statusDisplay.querySelector('p');
        statusText.textContent = message;
    }
}

// Initialize the demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WSystemDemo();
});
