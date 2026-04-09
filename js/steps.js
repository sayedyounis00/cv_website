/**
 * steps.js — Multi-step form navigation & progress bar
 */

const STEPS = [
    'Persönliche Daten',
    'Zielsetzung / Zusammenfassung',
    'Berufserfahrung',
    'Ausbildung',
    'Kompetenzen & Sprachkenntnisse',
    'Zertifizierungen & Kurse'
];

let currentStep = 1;
const totalSteps = 6;

/** Update progress bar label, percentage, and dot indicators */
function updateProgress() {
    const pct = Math.round((currentStep / totalSteps) * 100);
    document.getElementById('progress-label').textContent =
        `Step ${currentStep} of ${totalSteps} — ${STEPS[currentStep - 1]}`;
    document.getElementById('progress-count').textContent = pct + '%';
    document.getElementById('progress-fill').style.width = pct + '%';

    // Dots
    const dotsEl = document.getElementById('step-dots');
    dotsEl.innerHTML = '';
    for (let i = 1; i <= totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = 'step-dot';
        if (i === currentStep) dot.classList.add('active');
        else if (i < currentStep) dot.classList.add('completed');
        dot.onclick = () => goToStep(i);
        dotsEl.appendChild(dot);
    }
}

/** Show a specific step and toggle nav buttons */
function showStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step-' + n).classList.add('active');

    const prev = document.getElementById('btn-prev');
    const next = document.getElementById('btn-next');
    const dl = document.getElementById('btn-download');

    prev.style.display = n === 1 ? 'none' : 'flex';
    next.style.display = n === totalSteps ? 'none' : 'flex';
    dl.style.display = n === totalSteps ? 'flex' : 'none';

    updateProgress();
}

function nextStep() {
    if (currentStep < totalSteps) {
        if (!validateCurrentStep()) return;   // block navigation on invalid
        dismissToast();
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        dismissToast();
        currentStep--;
        showStep(currentStep);
    }
}

function goToStep(n) {
    dismissToast();
    currentStep = n;
    showStep(n);
}
