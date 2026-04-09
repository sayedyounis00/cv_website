/**
 * app.js — Application bootstrap
 */

function init() {
    // Populate form inputs from state
    document.getElementById('inp-name').value = state.name;
    document.getElementById('inp-title').value = state.title;
    document.getElementById('inp-email').value = state.email;
    document.getElementById('inp-phone').value = state.phone;
    document.getElementById('inp-dob').value = state.dob;
    document.getElementById('inp-city').value = state.city;
    document.getElementById('inp-postal').value = state.postal;
    document.getElementById('inp-country').value = state.country;
    document.getElementById('inp-objective').value = state.objective;
    document.getElementById('inp-edu-title').value = state.educationTitle;

    // Render dynamic lists
    renderExperienceList();
    renderEducationList();
    renderSkillTags();
    renderLanguageList();
    renderCertList();

    // Render preview
    renderPreview();

    // Set initial step
    showStep(1);
}

document.addEventListener('DOMContentLoaded', init);
