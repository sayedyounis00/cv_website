/**
 * forms.js — Dynamic form list renderers
 * (Experience, Education, Skills, Languages, Certifications)
 */

// ─── EXPERIENCE ───────────────────────────────────────────
function renderExperienceList() {
    const container = document.getElementById('exp-list');
    container.innerHTML = '';
    state.experience.forEach((exp, i) => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `
            <div class="entry-header" onclick="toggleEntry(this)">
                <div class="entry-header-left">
                    <div class="entry-icon"><i class="fas fa-briefcase"></i></div>
                    <div>
                        <div class="entry-title">${exp.title || 'Untitled'}</div>
                        <div class="entry-subtitle">${exp.institution || ''} · ${exp.dateFrom || ''}–${exp.dateTo || ''}</div>
                    </div>
                </div>
                <div class="entry-header-right">
                    <button class="entry-toggle"><i class="fas fa-chevron-down"></i></button>
                    <button class="entry-delete" onclick="event.stopPropagation();removeExperience(${i})"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="entry-body">
                <div class="form-row">
                    <div class="form-group"><label>From</label><input type="text" value="${exp.dateFrom}" oninput="state.experience[${i}].dateFrom=this.value;renderPreview();updateEntryHeader(this)"></div>
                    <div class="form-group"><label>To</label><input type="text" value="${exp.dateTo}" oninput="state.experience[${i}].dateTo=this.value;renderPreview();updateEntryHeader(this)"></div>
                </div>
                <div class="form-group"><label>Job Title</label><input type="text" value="${esc(exp.title)}" oninput="state.experience[${i}].title=this.value;renderPreview();updateEntryHeader(this)"></div>
                <div class="form-group"><label>Company / Institution</label><input type="text" value="${esc(exp.institution)}" oninput="state.experience[${i}].institution=this.value;renderPreview();updateEntryHeader(this)"></div>
                <div class="form-group"><label>Description</label><textarea rows="3" oninput="state.experience[${i}].desc=this.value;renderPreview()">${exp.desc}</textarea></div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addExperience() {
    state.experience.push({ dateFrom: '', dateTo: '', title: '', institution: '', desc: '' });
    renderExperienceList();
    renderPreview();
    // Auto-expand the newly added card and focus its first input
    const container = document.getElementById('exp-list');
    const lastCard = container.lastElementChild;
    if (lastCard) {
        const header = lastCard.querySelector('.entry-header');
        if (header) toggleEntry(header);
        const firstInput = lastCard.querySelector('.entry-body input');
        if (firstInput) firstInput.focus();
    }
}

function removeExperience(i) {
    state.experience.splice(i, 1);
    renderExperienceList();
    renderPreview();
}

// ─── EDUCATION ────────────────────────────────────────────
function renderEducationList() {
    const container = document.getElementById('edu-list');
    container.innerHTML = '';
    state.education.forEach((edu, i) => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.innerHTML = `
            <div class="entry-header" onclick="toggleEntry(this)">
                <div class="entry-header-left">
                    <div class="entry-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div>
                        <div class="entry-title">${edu.title || 'Untitled'}</div>
                        <div class="entry-subtitle">${edu.institution || ''} · ${edu.dateFrom || ''}–${edu.dateTo || ''}</div>
                    </div>
                </div>
                <div class="entry-header-right">
                    <button class="entry-toggle"><i class="fas fa-chevron-down"></i></button>
                    <button class="entry-delete" onclick="event.stopPropagation();removeEducation(${i})"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="entry-body">
                <div class="form-row">
                    <div class="form-group"><label>From</label><input type="text" value="${edu.dateFrom}" oninput="state.education[${i}].dateFrom=this.value;renderPreview();updateEntryHeader(this)"></div>
                    <div class="form-group"><label>To</label><input type="text" value="${edu.dateTo}" oninput="state.education[${i}].dateTo=this.value;renderPreview();updateEntryHeader(this)"></div>
                </div>
                <div class="form-group"><label>Degree / Certificate</label><input type="text" value="${esc(edu.title)}" oninput="state.education[${i}].title=this.value;renderPreview();updateEntryHeader(this)"></div>
                <div class="form-group"><label>Institution</label><input type="text" value="${esc(edu.institution)}" oninput="state.education[${i}].institution=this.value;renderPreview();updateEntryHeader(this)"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addEducation() {
    state.education.push({ dateFrom: '', dateTo: '', title: '', institution: '' });
    renderEducationList();
    renderPreview();
    // Auto-expand the newly added card and focus its first input
    const container = document.getElementById('edu-list');
    const lastCard = container.lastElementChild;
    if (lastCard) {
        const header = lastCard.querySelector('.entry-header');
        if (header) toggleEntry(header);
        const firstInput = lastCard.querySelector('.entry-body input');
        if (firstInput) firstInput.focus();
    }
}

function removeEducation(i) {
    state.education.splice(i, 1);
    renderEducationList();
    renderPreview();
}

// ─── SKILLS ───────────────────────────────────────────────
function renderSkillTags() {
    const container = document.getElementById('skills-container');
    container.querySelectorAll('.tag-pill').forEach(p => p.remove());
    const inp = document.getElementById('skill-input');
    state.skills.forEach((skill, i) => {
        const pill = document.createElement('span');
        pill.className = 'tag-pill';
        pill.innerHTML = `${esc(skill)} <button onclick="removeSkill(${i})">&times;</button>`;
        container.insertBefore(pill, inp);
    });
}

function handleSkillKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val) {
            state.skills.push(val);
            e.target.value = '';
            renderSkillTags();
            renderPreview();
        }
    }
}

function removeSkill(i) {
    state.skills.splice(i, 1);
    renderSkillTags();
    renderPreview();
}

// ─── LANGUAGES ────────────────────────────────────────────
function renderLanguageList() {
    const container = document.getElementById('lang-list');
    container.innerHTML = '';
    state.languages.forEach((lang, i) => {
        const div = document.createElement('div');
        div.className = 'cert-entry';
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <input type="text" value="${esc(lang.name)}" placeholder="Language" style="flex:1" oninput="state.languages[${i}].name=this.value;renderPreview()">
            <select onchange="state.languages[${i}].level=this.value;renderPreview()" style="flex:1;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:'Inter',sans-serif;font-size:0.9rem;">
                <option value="Native" ${lang.level === 'Native' ? 'selected' : ''}>Native</option>
                <option value="Fluent" ${lang.level === 'Fluent' ? 'selected' : ''}>Fluent</option>
                <option value="Advanced" ${lang.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                <option value="Intermediate" ${lang.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Basic" ${lang.level === 'Basic' ? 'selected' : ''}>Basic</option>
            </select>
            <input type="text" value="${esc(lang.note || '')}" placeholder="Note (optional)" style="flex:1" oninput="state.languages[${i}].note=this.value;renderPreview()">
            <button class="entry-delete" onclick="removeLanguage(${i})"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(div);
    });
}

function addLanguage() {
    state.languages.push({ name: '', level: 'Intermediate', note: '' });
    renderLanguageList();
    renderPreview();
}

function removeLanguage(i) {
    state.languages.splice(i, 1);
    renderLanguageList();
    renderPreview();
}

// ─── CERTIFICATIONS ───────────────────────────────────────
function renderCertList() {
    const container = document.getElementById('cert-list');
    container.innerHTML = '';
    state.certifications.forEach((cert, i) => {
        // Normalize legacy strings into objects
        if (typeof cert === 'string') {
            cert = { name: cert, issuer: '', date: '' };
            state.certifications[i] = cert;
        }
        const nameStr = cert && cert.name ? cert.name : '';
        const issuerStr = cert && cert.issuer ? cert.issuer : '';
        const dateStr = cert && cert.date ? cert.date : '';

        const div = document.createElement('div');
        div.className = 'entry-card';
        div.style.padding = '16px';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">Course #${i + 1}</span>
                <button class="entry-delete" onclick="removeCertification(${i})"><i class="fas fa-times"></i></button>
            </div>
            <div class="form-group">
                <input type="text" value="${esc(nameStr).replace(/"/g, '&quot;')}" placeholder="Course / Certificate Name" oninput="state.certifications[${i}].name=this.value;renderPreview()">
            </div>
            <div class="form-row" style="margin-bottom:0;">
                <div class="form-group" style="margin-bottom:0;">
                    <input type="text" value="${esc(issuerStr).replace(/"/g, '&quot;')}" placeholder="Institution" oninput="state.certifications[${i}].issuer=this.value;renderPreview()">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <input type="text" value="${esc(dateStr).replace(/"/g, '&quot;')}" placeholder="Date / Year" oninput="state.certifications[${i}].date=this.value;renderPreview()">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function addCertification() {
    state.certifications.push({ name: '', issuer: '', date: '' });
    renderCertList();
    renderPreview();
}

function removeCertification(i) {
    state.certifications.splice(i, 1);
    renderCertList();
    renderPreview();
}

// ─── HOBBIES ──────────────────────────────────────────────

const PRESET_HOBBIES = [
    { name: 'Lesen', icon: 'fa-book' },
    { name: 'Reisen', icon: 'fa-plane' },
    { name: 'Kochen', icon: 'fa-utensils' },
    { name: 'Sport', icon: 'fa-running' },
    { name: 'Musik', icon: 'fa-music' },
    { name: 'Fotografie', icon: 'fa-camera' },
    { name: 'Malen', icon: 'fa-paint-brush' },
    { name: 'Wandern', icon: 'fa-hiking' },
    { name: 'Schwimmen', icon: 'fa-swimmer' },
    { name: 'Radfahren', icon: 'fa-bicycle' },
    { name: 'Yoga', icon: 'fa-spa' },
    { name: 'Gärtnern', icon: 'fa-seedling' },
    { name: 'Filme', icon: 'fa-film' },
    { name: 'Gaming', icon: 'fa-gamepad' },
    { name: 'Tanzen', icon: 'fa-compact-disc' },
    { name: 'Schreiben', icon: 'fa-pen-fancy' },
    { name: 'Ehrenamt', icon: 'fa-hands-helping' },
    { name: 'Sprachen lernen', icon: 'fa-language' },
    { name: 'Handwerk', icon: 'fa-tools' },
    { name: 'Meditation', icon: 'fa-om' }
];

function renderHobbyPresets() {
    const grid = document.getElementById('hobby-preset-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PRESET_HOBBIES.forEach(hobby => {
        const chip = document.createElement('button');
        chip.className = 'hobby-chip';
        if (state.hobbies.includes(hobby.name)) {
            chip.classList.add('selected');
        }
        chip.innerHTML = `<i class="fas ${hobby.icon}"></i><span>${hobby.name}</span>`;
        chip.onclick = () => toggleHobby(hobby.name);
        grid.appendChild(chip);
    });
}

function toggleHobby(name) {
    const idx = state.hobbies.indexOf(name);
    if (idx >= 0) {
        state.hobbies.splice(idx, 1);
    } else {
        state.hobbies.push(name);
    }
    renderHobbyPresets();
    renderSelectedHobbies();
    renderPreview();
}

function renderSelectedHobbies() {
    const container = document.getElementById('hobby-selected-list');
    const emptyMsg = document.getElementById('hobby-empty-msg');
    if (!container) return;

    // Remove all pills, keep the empty message
    container.querySelectorAll('.hobby-selected-pill').forEach(p => p.remove());

    if (state.hobbies.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'flex';
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    state.hobbies.forEach((hobby, i) => {
        const pill = document.createElement('div');
        pill.className = 'hobby-selected-pill';
        // Find icon for preset hobbies
        const preset = PRESET_HOBBIES.find(p => p.name === hobby);
        const iconClass = preset ? preset.icon : 'fa-star';
        pill.innerHTML = `<i class="fas ${iconClass}"></i><span>${esc(hobby)}</span><button onclick="removeHobby(${i})" title="Entfernen"><i class="fas fa-times"></i></button>`;
        container.appendChild(pill);
    });
}

function removeHobby(i) {
    state.hobbies.splice(i, 1);
    renderHobbyPresets();
    renderSelectedHobbies();
    renderPreview();
}

function addCustomHobby() {
    const input = document.getElementById('hobby-custom-input');
    const val = input.value.trim();
    if (val && !state.hobbies.includes(val)) {
        state.hobbies.push(val);
        input.value = '';
        renderHobbyPresets();
        renderSelectedHobbies();
        renderPreview();
    }
}

function handleHobbyCustomKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addCustomHobby();
    }
}
