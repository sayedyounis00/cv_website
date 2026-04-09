/**
 * validation.js — Per-step form validation
 *
 * Each step has a validate() method that returns { valid: boolean, errors: string[] }.
 * Errors are displayed via showStepErrors() and cleared on input.
 */

// ─── ERROR UI ─────────────────────────────────────────────

/** Mark a field as invalid and attach an error message below it */
function markFieldError(id, message) {
    const field = document.getElementById(id);
    if (!field) return;
    field.classList.add('field-error');
    // Avoid duplicate error messages
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-msg')) {
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.textContent = message;
        field.parentNode.insertBefore(msg, field.nextSibling);
    }
    // Auto-clear on interaction
    field.addEventListener('input', () => clearFieldError(id), { once: true });
    field.addEventListener('change', () => clearFieldError(id), { once: true });
}

function clearFieldError(id) {
    const field = document.getElementById(id);
    if (!field) return;
    field.classList.remove('field-error');
    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-msg')) {
        field.nextElementSibling.remove();
    }
}

/** Show a step-level toast banner with a list of errors */
function showStepErrors(errors) {
    // Remove any existing banner
    const existing = document.getElementById('validation-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'validation-toast';
    toast.className = 'validation-toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-exclamation-circle"></i></div>
        <div class="toast-body">
            <div class="toast-title">Please fix the following before continuing:</div>
            <ul class="toast-list">
                ${errors.map(e => `<li>${e}</li>`).join('')}
            </ul>
        </div>
        <button class="toast-close" onclick="dismissToast()"><i class="fas fa-times"></i></button>
    `;

    const formArea = document.getElementById('form-area');
    formArea.insertBefore(toast, formArea.firstChild);

    // Scroll to top of form so errors are visible
    formArea.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-dismiss after 6s
    setTimeout(dismissToast, 6000);
}

function dismissToast() {
    const toast = document.getElementById('validation-toast');
    if (toast) {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }
}

// ─── PER-STEP VALIDATORS ──────────────────────────────────

const validators = {

    /** Step 1: Personal Info */
    1() {
        const errors = [];
        const requiredFields = [
            { id: 'inp-name', label: 'Full Name' },
            { id: 'inp-title', label: 'Professional Title' },
            { id: 'inp-email', label: 'Email' },
            { id: 'inp-phone', label: 'Phone' },
            { id: 'inp-dob', label: 'Date of Birth' },
            { id: 'inp-city', label: 'City' },
            { id: 'inp-postal', label: 'Postal Code' },
            { id: 'inp-country', label: 'Country' }
        ];

        requiredFields.forEach(({ id, label }) => {
            const el = document.getElementById(id);
            if (!el || !el.value.trim()) {
                errors.push(`${label} is required.`);
                markFieldError(id, `${label} is required.`);
            }
        });

        // Basic email format check
        const emailEl = document.getElementById('inp-email');
        if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            errors.push('Email address format is invalid.');
            markFieldError('inp-email', 'Enter a valid email address.');
        }

        return { valid: errors.length === 0, errors };
    },

    /** Step 2: Objective */
    2() {
        const errors = [];
        const el = document.getElementById('inp-objective');
        if (!el || !el.value.trim()) {
            errors.push('Career Objective is required.');
            markFieldError('inp-objective', 'Please write a short career objective.');
        }
        return { valid: errors.length === 0, errors };
    },

    /** Step 3: Work Experience — at least one entry with a title */
    3() {
        const errors = [];
        if (state.experience.length === 0) {
            errors.push('Add at least one work experience entry.');
        } else {
            const incomplete = state.experience.some(e => !e.title || !e.title.trim());
            if (incomplete) {
                errors.push('Each experience entry must have a Job Title.');
                highlightIncompleteEntries('exp-list', 'Job Title');
            }
        }
        return { valid: errors.length === 0, errors };
    },

    /** Step 4: Education — at least one entry with a title */
    4() {
        const errors = [];
        if (state.education.length === 0) {
            errors.push('Add at least one education entry.');
        } else {
            const incomplete = state.education.some(e => !e.title || !e.title.trim());
            if (incomplete) {
                errors.push('Each education entry must have a Degree / Certificate name.');
                highlightIncompleteEntries('edu-list', 'Degree / Certificate');
            }
        }
        return { valid: errors.length === 0, errors };
    },

    /** Step 5: Skills & Languages */
    5() {
        const errors = [];
        if (state.skills.length === 0) {
            errors.push('Add at least one skill.');
        }
        if (state.languages.length === 0) {
            errors.push('Add at least one language.');
        } else {
            const incomplete = state.languages.some(l => !l.name || !l.name.trim());
            if (incomplete) {
                errors.push('Each language entry must have a name.');
            }
        }
        return { valid: errors.length === 0, errors };
    },

    /** Step 6: Certifications — optional, always valid */
    6() {
        return { valid: true, errors: [] };
    }
};

/** Highlight entry cards that are missing required data */
function highlightIncompleteEntries(listId, missingField) {
    const container = document.getElementById(listId);
    if (!container) return;
    container.querySelectorAll('.entry-card').forEach((card, i) => {
        const inputs = card.querySelectorAll('input[type="text"]');
        // The title input is typically the 3rd input (after dateFrom, dateTo)
        // Find any input that is visually labelled as Title
        inputs.forEach(inp => {
            if (!inp.value.trim() && inp.getAttribute('oninput') && inp.getAttribute('oninput').includes('.title')) {
                inp.classList.add('field-error');
                if (!inp.nextElementSibling || !inp.nextElementSibling.classList.contains('error-msg')) {
                    const msg = document.createElement('span');
                    msg.className = 'error-msg';
                    msg.textContent = `${missingField} is required.`;
                    inp.parentNode.insertBefore(msg, inp.nextSibling);
                }
                // Expand the card body so the error is visible
                const body = card.querySelector('.entry-body');
                if (body && !body.classList.contains('open')) {
                    const header = card.querySelector('.entry-header');
                    if (header) toggleEntry(header);
                }
                inp.addEventListener('input', () => {
                    inp.classList.remove('field-error');
                    if (inp.nextElementSibling && inp.nextElementSibling.classList.contains('error-msg')) {
                        inp.nextElementSibling.remove();
                    }
                }, { once: true });
            }
        });
    });
}

// ─── HOOK INTO NAVIGATION ────────────────────────────────

/**
 * Validate the current step before moving forward.
 * Returns true if valid (navigation allowed), false otherwise.
 */
function validateCurrentStep() {
    const validator = validators[currentStep];
    if (!validator) return true;

    const { valid, errors } = validator();
    if (!valid) {
        showStepErrors(errors);
        // Shake the Next button
        const btn = document.getElementById('btn-next');
        btn.classList.remove('btn-shake');
        void btn.offsetWidth; // reflow to restart animation
        btn.classList.add('btn-shake');
        setTimeout(() => btn.classList.remove('btn-shake'), 500);
    }
    return valid;
}
