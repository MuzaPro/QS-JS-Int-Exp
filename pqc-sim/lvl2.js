class GraphStateDemo {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 6;
        this.atomsEntangled = [];
        this.isAnimating = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        // Buttons
        this.prepBtn = document.getElementById('prepBtn');
        this.cz12Btn = document.getElementById('cz12Btn');
        this.cz23Btn = document.getElementById('cz23Btn');
        this.cz34Btn = document.getElementById('cz34Btn');
        this.cz41Btn = document.getElementById('cz41Btn');
        this.transferBtn = document.getElementById('transferBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Display elements
        this.progressFill = document.getElementById('progressFill');
        this.stepCounter = document.getElementById('stepCounter');
        this.stateDisplay = document.getElementById('stateDisplay');

        // Atoms and indicators
        this.atoms = {
            1: document.getElementById('atom1'),
            2: document.getElementById('atom2'),
            3: document.getElementById('atom3'),
            4: document.getElementById('atom4')
        };

        this.stateIndicators = {
            1: document.getElementById('state1'),
            2: document.getElementById('state2'),
            3: document.getElementById('state3'),
            4: document.getElementById('state4')
        };

        this.entIndicators = {
            1: document.getElementById('ent1'),
            2: document.getElementById('ent2'),
            3: document.getElementById('ent3'),
            4: document.getElementById('ent4')
        };

        // Entanglement links
        this.links = {
            12: document.getElementById('link12'),
            23: document.getElementById('link23'),
            34: document.getElementById('link34'),
            41: document.getElementById('link41')
        };

        // Photons
        this.photons = {
            1: document.getElementById('photon1'),
            2: document.getElementById('photon2'),
            3: document.getElementById('photon3'),
            4: document.getElementById('photon4')
        };
    }

    bindEvents() {
        this.prepBtn.addEventListener('click', () => this.prepareAtoms());
        this.cz12Btn.addEventListener('click', () => this.performCZ(1, 2));
        this.cz23Btn.addEventListener('click', () => this.performCZ(2, 3));
        this.cz34Btn.addEventListener('click', () => this.performCZ(3, 4));
        this.cz41Btn.addEventListener('click', () => this.performCZ(4, 1));
        this.transferBtn.addEventListener('click', () => this.transferToPhotons());
        this.resetBtn.addEventListener('click', () => this.resetProtocol());
    }

    async prepareAtoms() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Activate all atom state indicators
        Object.values(this.stateIndicators).forEach(indicator => {
            indicator.classList.add('active');
        });

        Object.values(this.atoms).forEach(atom => {
            atom.classList.add('active');
        });

        this.updateState("All atoms prepared in superposition |+⟩ = (|0⟩ + |1⟩)/√2. Ready for entanglement generation.");
        this.completeStep(this.prepBtn, this.cz12Btn);
        
        await this.delay(1000);
        this.isAnimating = false;
    }

    async performCZ(atom1, atom2) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Visual entanglement effect
        this.atoms[atom1].classList.add('entangled');
        this.atoms[atom2].classList.add('entangled');
        
        // Show entanglement link
        const linkKey = `${atom1}${atom2}`;
        if (this.links[linkKey]) {
            this.links[linkKey].classList.add('active');
        }

        // Show entanglement indicators
        this.entIndicators[atom1].classList.add('active');
        this.entIndicators[atom2].classList.add('active');

        this.atomsEntangled.push([atom1, atom2]);

        // Update state description
        const pairName = `W${atom1}-W${atom2}`;
        this.updateState(`CZ gate applied between ${pairName}. Atoms now entangled. Conditional phase creates graph edge.`);

        // Enable next button
        this.advanceToNextStep();
        
        await this.delay(1500);
        this.isAnimating = false;
    }

    async transferToPhotons() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Animate photon extraction from each atom
        const atomElements = [
            this.atoms[1], // atom1
            this.atoms[2], // atom2
            this.atoms[3], // atom3
            this.atoms[4]  // atom4
        ];

        for (let i = 1; i <= 4; i++) {
            const photon = this.photons[i];
            const atomRect = atomElements[i-1].getBoundingClientRect();
            const containerRect = atomElements[i-1].closest('.atom-container').getBoundingClientRect();
            
            const x = atomRect.left - containerRect.left + (atomRect.width / 2);
            const y = atomRect.top - containerRect.top + (atomRect.height / 2);
            
            photon.style.left = x + 'px';
            photon.style.top = y + 'px';
            photon.classList.add('moving', 'entangled');
            
            await this.delay(300);
        }

        // Animate photons moving to center to show entanglement
        await this.delay(500);
        
        const container = this.atoms[1].closest('.atom-container');
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        
        Object.values(this.photons).forEach((photon, index) => {
            const radius = 60;
            const angle = (index * Math.PI * 2) / 4;
            
            photon.style.left = (centerX + radius * Math.cos(angle)) + 'px';
            photon.style.top = (centerY + radius * Math.sin(angle)) + 'px';
        });

        this.updateState("SWAP operations complete! 4-photon ring graph state generated: |Ψ⟩ = (|0000⟩ + |0011⟩ + |1100⟩ + |1111⟩)/2");
        this.completeStep(this.transferBtn, null);
        
        await this.delay(2000);
        this.isAnimating = false;
    }

    advanceToNextStep() {
        const buttons = [this.prepBtn, this.cz12Btn, this.cz23Btn, this.cz34Btn, this.cz41Btn, this.transferBtn];
        const currentBtn = buttons[this.currentStep];
        const nextBtn = buttons[this.currentStep + 1];
        
        this.completeStep(currentBtn, nextBtn);
    }

    completeStep(currentBtn, nextBtn) {
        this.currentStep++;
        currentBtn.classList.add('completed');
        currentBtn.disabled = true;
        
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Update progress
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressFill.style.width = progress + '%';
        this.stepCounter.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    updateState(message) {
        const stateText = this.stateDisplay.querySelector('p');
        stateText.textContent = message;
    }

    resetProtocol() {
        this.currentStep = 0;
        this.atomsEntangled = [];
        this.isAnimating = false;

        // Reset all buttons
        const buttons = [this.prepBtn, this.cz12Btn, this.cz23Btn, this.cz34Btn, this.cz41Btn, this.transferBtn];
        buttons.forEach((btn, index) => {
            btn.classList.remove('completed');
            btn.disabled = index !== 0; // Only prep button enabled
        });

        // Reset visual elements
        Object.values(this.atoms).forEach(atom => {
            atom.classList.remove('active', 'entangled');
        });

        Object.values(this.stateIndicators).forEach(indicator => {
            indicator.classList.remove('active');
        });

        Object.values(this.entIndicators).forEach(indicator => {
            indicator.classList.remove('active');
        });

        Object.values(this.links).forEach(link => {
            link.classList.remove('active');
        });

        Object.values(this.photons).forEach(photon => {
            photon.classList.remove('moving', 'entangled');
        });

        // Reset progress
        this.progressFill.style.width = '0%';
        this.stepCounter.textContent = 'Step 0 of 6';
        this.updateState("System reset. Click 'Prepare Atoms' to begin graph state generation protocol.");
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateDisplay() {
        this.resetProtocol();
    }
}

// Initialize the demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GraphStateDemo();
});
