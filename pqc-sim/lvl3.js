// Surface code lattice configuration
const LATTICE_SIZE = 5; // 5x5 lattice
const QUBIT_SPACING = 100;
const OFFSET = 50;

let errorMode = null;
let latticeState = {};
let syndromeResults = {};
let physicalErrorCount = 0;
let logicalErrorCount = 0;
let correctionAttempts = 0;

// Initialize the surface code lattice
function initializeLattice() {
    const container = document.getElementById('surface-code-container');
    container.innerHTML = '';
    
    // Create stabilizer lines first (background)
    createStabilizerLines(container);
    
    // Create qubits
    for (let row = 0; row < LATTICE_SIZE; row++) {
        for (let col = 0; col < LATTICE_SIZE; col++) {
            const isDataQubit = (row + col) % 2 === 0;
            const qubitId = `q_${row}_${col}`;
            
            const qubit = document.createElement('div');
            qubit.className = `qubit-node ${isDataQubit ? 'data-qubit' : 'ancilla-qubit'}`;
            qubit.id = qubitId;
            qubit.style.left = `${OFFSET + col * QUBIT_SPACING}px`;
            qubit.style.top = `${OFFSET + row * QUBIT_SPACING}px`;
            
            const label = document.createElement('span');
            label.textContent = isDataQubit ? 'D' : 'A';
            qubit.appendChild(label);
            
            if (isDataQubit) {
                qubit.onclick = () => toggleError(row, col);
            }
            
            container.appendChild(qubit);
            
            // Initialize state
            latticeState[qubitId] = {
                row: row,
                col: col,
                isData: isDataQubit,
                errorX: false,
                errorZ: false
            };
        }
    }
}

// Create stabilizer visualization lines
function createStabilizerLines(container) {
    // Create horizontal and vertical stabilizer indicators
    for (let row = 0; row < LATTICE_SIZE; row++) {
        for (let col = 0; col < LATTICE_SIZE; col++) {
            if ((row + col) % 2 === 1) { // Ancilla positions
                // Create cross pattern for stabilizers
                const hLine = document.createElement('div');
                hLine.className = 'stabilizer-line';
                hLine.style.width = `${QUBIT_SPACING * 2}px`;
                hLine.style.height = '2px';
                hLine.style.left = `${OFFSET + (col - 1) * QUBIT_SPACING + 20}px`;
                hLine.style.top = `${OFFSET + row * QUBIT_SPACING + 19}px`;
                hLine.id = `stab_h_${row}_${col}`;
                container.appendChild(hLine);
                
                const vLine = document.createElement('div');
                vLine.className = 'stabilizer-line';
                vLine.style.width = '2px';
                vLine.style.height = `${QUBIT_SPACING * 2}px`;
                vLine.style.left = `${OFFSET + col * QUBIT_SPACING + 19}px`;
                vLine.style.top = `${OFFSET + (row - 1) * QUBIT_SPACING + 20}px`;
                vLine.id = `stab_v_${row}_${col}`;
                container.appendChild(vLine);
            }
        }
    }
}

// Set the current error injection mode
function setErrorMode(mode) {
    errorMode = mode;
    updateStatus(`${mode} error mode active - Click data qubits to inject errors`);
}

// Toggle error on a qubit
function toggleError(row, col) {
    if (!errorMode) {
        updateStatus('Please select an error type first');
        return;
    }
    
    const qubitId = `q_${row}_${col}`;
    const qubit = document.getElementById(qubitId);
    const state = latticeState[qubitId];
    
    if (!state.isData) return;
    
    if (errorMode === 'X') {
        state.errorX = !state.errorX;
        if (state.errorX) {
            qubit.classList.add('error-x');
            physicalErrorCount++;
        } else {
            qubit.classList.remove('error-x');
            physicalErrorCount = Math.max(0, physicalErrorCount - 1);
        }
    } else if (errorMode === 'Z') {
        state.errorZ = !state.errorZ;
        if (state.errorZ) {
            qubit.classList.add('error-z');
            physicalErrorCount++;
        } else {
            qubit.classList.remove('error-z');
            physicalErrorCount = Math.max(0, physicalErrorCount - 1);
        }
    }
    
    updateErrorDisplay();
    updateStatus('Error injected - Measure syndromes to detect');
    document.getElementById('correctButton').disabled = true;
}

// Inject random error
function injectRandomError() {
    const dataQubits = Object.keys(latticeState).filter(id => latticeState[id].isData);
    const randomQubit = dataQubits[Math.floor(Math.random() * dataQubits.length)];
    const state = latticeState[randomQubit];
    
    errorMode = Math.random() < 0.5 ? 'X' : 'Z';
    toggleError(state.row, state.col);
}

// Measure syndrome (ancilla qubits)
function measureSyndromes() {
    syndromeResults = {};
    let syndromeDetected = false;
    
    // Clear previous syndrome highlights
    document.querySelectorAll('.ancilla-qubit').forEach(q => {
        q.classList.remove('syndrome-active');
    });
    document.querySelectorAll('.stabilizer-line').forEach(l => {
        l.classList.remove('active');
    });
    
    // Check each ancilla qubit
    for (let row = 0; row < LATTICE_SIZE; row++) {
        for (let col = 0; col < LATTICE_SIZE; col++) {
            if ((row + col) % 2 === 1) { // Ancilla qubit
                const ancillaId = `q_${row}_${col}`;
                let xParity = 0;
                let zParity = 0;
                
                // Check neighboring data qubits
                const neighbors = [
                    [row - 1, col], [row + 1, col],
                    [row, col - 1], [row, col + 1]
                ];
                
                neighbors.forEach(([r, c]) => {
                    if (r >= 0 && r < LATTICE_SIZE && c >= 0 && c < LATTICE_SIZE) {
                        const neighborId = `q_${r}_${c}`;
                        const neighborState = latticeState[neighborId];
                        if (neighborState && neighborState.isData) {
                            if (neighborState.errorX) xParity ^= 1;
                            if (neighborState.errorZ) zParity ^= 1;
                        }
                    }
                });
                
                syndromeResults[ancillaId] = { xParity, zParity };
                
                // Highlight active syndromes
                if (xParity || zParity) {
                    syndromeDetected = true;
                    document.getElementById(ancillaId).classList.add('syndrome-active');
                    
                    // Highlight stabilizer lines
                    const hLine = document.getElementById(`stab_h_${row}_${col}`);
                    const vLine = document.getElementById(`stab_v_${row}_${col}`);
                    if (hLine) hLine.classList.add('active');
                    if (vLine) vLine.classList.add('active');
                }
            }
        }
    }
    
    if (syndromeDetected) {
        updateStatus('Syndromes detected! Errors found - Apply correction');
        document.getElementById('correctButton').disabled = false;
    } else if (physicalErrorCount > 0) {
        updateStatus('No syndromes detected - Undetectable error pattern!');
        logicalErrorCount++;
        updateErrorDisplay();
    } else {
        updateStatus('No syndromes detected - System is error-free');
    }
}

// Apply error correction based on syndrome measurements
function applyCorrection() {
    correctionAttempts++;
    let correctionSuccess = true;
    
    // Simple correction strategy - fix errors based on syndrome pattern
    // In a real surface code, this would use minimum weight perfect matching
    
    Object.keys(syndromeResults).forEach(ancillaId => {
        const syndrome = syndromeResults[ancillaId];
        const ancillaState = latticeState[ancillaId];
        
        if (syndrome.xParity || syndrome.zParity) {
            // Find neighboring data qubits with errors
            const neighbors = [
                [ancillaState.row - 1, ancillaState.col],
                [ancillaState.row + 1, ancillaState.col],
                [ancillaState.row, ancillaState.col - 1],
                [ancillaState.row, ancillaState.col + 1]
            ];
            
            neighbors.forEach(([r, c]) => {
                if (r >= 0 && r < LATTICE_SIZE && c >= 0 && c < LATTICE_SIZE) {
                    const neighborId = `q_${r}_${c}`;
                    const neighborState = latticeState[neighborId];
                    
                    if (neighborState && neighborState.isData) {
                        const qubit = document.getElementById(neighborId);
                        
                        if (syndrome.xParity && neighborState.errorX) {
                            neighborState.errorX = false;
                            qubit.classList.remove('error-x');
                            physicalErrorCount = Math.max(0, physicalErrorCount - 1);
                        }
                        if (syndrome.zParity && neighborState.errorZ) {
                            neighborState.errorZ = false;
                            qubit.classList.remove('error-z');
                            physicalErrorCount = Math.max(0, physicalErrorCount - 1);
                        }
                    }
                }
            });
        }
    });
    
    // Clear syndrome highlights
    document.querySelectorAll('.syndrome-active').forEach(q => {
        q.classList.remove('syndrome-active');
    });
    document.querySelectorAll('.stabilizer-line.active').forEach(l => {
        l.classList.remove('active');
    });
    
    updateErrorDisplay();
    
    if (physicalErrorCount === 0) {
        updateStatus('✓ Error correction successful! All errors fixed');
    } else {
        updateStatus('⚠ Partial correction - Some errors remain');
        logicalErrorCount++;
    }
    
    document.getElementById('correctButton').disabled = true;
}

// Reset the lattice
function resetLattice() {
    initializeLattice();
    physicalErrorCount = 0;
    logicalErrorCount = 0;
    correctionAttempts = 0;
    errorMode = null;
    syndromeResults = {};
    updateErrorDisplay();
    updateStatus('Lattice reset - Ready for new errors');
    document.getElementById('correctButton').disabled = true;
}

// Update status display
function updateStatus(message) {
    document.getElementById('statusText').textContent = message;
}

// Update error count display
function updateErrorDisplay() {
    document.getElementById('physicalErrors').textContent = physicalErrorCount;
    document.getElementById('logicalErrors').textContent = logicalErrorCount;
}

// Initialize on load
window.onload = () => {
    initializeLattice();
    updateErrorDisplay();
};
