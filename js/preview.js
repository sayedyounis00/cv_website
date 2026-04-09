/**
 * preview.js — CV live preview renderer
 */

function renderPreview() {
    const el = document.getElementById('cv-preview');

    // ── Photo ──
    let photoHTML = '';
    if (state.photo) {
        photoHTML = `<div class="cv-photo"><img src="${state.photo}" alt="Profile" style="object-position:${state.photoX}% ${state.photoY}%"></div>`;
    } else {
        const initials = (state.name || '').split(' ')
            .map(w => w[0] || '').join('').toUpperCase().slice(0, 2);
        photoHTML = `<div class="cv-photo"><div class="cv-photo-placeholder">${initials || '?'}</div></div>`;
    }

    // ── Address ──
    const address = [state.city, state.postal, state.country].filter(Boolean).join(', ');

    // ── Contact rows (right side of header) ──
    let contactHTML = '';
    if (state.email || state.phone || address || state.dob) {
        contactHTML = `<div class="cv-header-right">`;
        if (state.email)
            contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">E-Mail</span> <span class="cv-contact-value">${esc(state.email)}</span></div>`;
        if (address)
            contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Adresse</span> <span class="cv-contact-value">${esc(address)}</span></div>`;
        if (state.phone)
            contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Telefonnummer</span> <span class="cv-contact-value">${esc(state.phone)}</span></div>`;
        if (state.dob)
            contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Geburtsdatum</span> <span class="cv-contact-value">${esc(state.dob)}</span></div>`;
        contactHTML += `</div>`;
    }

    // ── Objective ──
    let objectiveHTML = '';
    if (state.objective) {
        objectiveHTML = `
            <div class="cv-section">
                <div class="cv-section-title-full">Zielsetzung</div>
                <div class="cv-section-line"></div>
                <p style="font-size:12px;color:#555;line-height:1.5;margin:0">${esc(state.objective)}</p>
            </div>
        `;
    }

    // ── Experience — two-column grid ──
    let expHTML = '';
    if (state.experience.length) {
        expHTML = `
            <div class="cv-section">
                <div class="cv-section-title-full">Berufserfahrung</div>
                <div class="cv-section-line"></div>
                <div class="cv-two-col">
                    ${state.experience.map(exp => `
                        <div class="cv-entry">
                            <div class="cv-entry-date">${esc(exp.dateFrom)} – ${esc(exp.dateTo)}</div>
                            <div class="cv-entry-title">${esc(exp.title)}</div>
                            <div class="cv-entry-institution">${esc(exp.institution)}</div>
                            ${exp.desc ? `<div class="cv-entry-desc">${esc(exp.desc)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ── Education — two-column grid ──
    let eduHTML = '';
    if (state.education.length) {
        eduHTML = `
            <div class="cv-section">
                <div class="cv-section-title-full">${esc(state.educationTitle || 'Ausbildung')}</div>
                <div class="cv-section-line"></div>
                <div class="cv-two-col">
                    ${state.education.map(edu => `
                        <div class="cv-entry">
                            <div class="cv-entry-date">${esc(edu.dateFrom)} – ${esc(edu.dateTo)}</div>
                            <div class="cv-entry-title">${esc(edu.title)}</div>
                            <div class="cv-entry-institution">${esc(edu.institution)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ── Skills ──
    let skillsSection = '';
    if (state.skills.length) {
        skillsSection = `
            <div class="cv-section" style="margin-bottom:0">
                <div class="cv-section-title-full">Kompetenzen</div>
                <div class="cv-section-line"></div>
                <ul class="cv-skills-list">
                    ${state.skills.map(s => `<li>${esc(s)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // ── Languages ──
    let langSection = '';
    if (state.languages.length) {
        langSection = `
            <div class="cv-section" style="margin-bottom:0">
                <div class="cv-section-title-full">Sprachkenntnisse</div>
                <div class="cv-section-line"></div>
                <div class="cv-lang-table">
                    ${state.languages.map(l => {
            const levelText = l.level === 'Native' ? 'Muttersprache'
                : l.level === 'Fluent' ? 'Fließend'
                    : l.level === 'Advanced' ? 'Fortgeschritten'
                        : l.level === 'Intermediate' ? 'Mittelstufe'
                            : 'Grundkenntnisse';
            const noteText = l.note ? ', ' + l.note : '';
            return `<div class="cv-lang-row"><span class="cv-lang-name">${esc(l.name)}</span><span class="cv-lang-level">${esc(levelText)}${esc(noteText)}</span></div>`;
        }).join('')}
                </div>
            </div>
        `;
    }

    // ── Bottom row: skills + languages side by side ──
    let bottomRowHTML = '';
    if (state.skills.length || state.languages.length) {
        bottomRowHTML = `<div class="cv-bottom-row">${skillsSection}${langSection}</div>`;
    }

    // ── Certifications ──
    let certHTML = '';
    const validCerts = state.certifications.filter(c => {
        if (typeof c === 'string') return c.trim().length > 0;
        return c && typeof c === 'object' && typeof c.name === 'string' && c.name.trim().length > 0;
    });
    if (validCerts.length) {
        certHTML = `
            <div class="cv-section">
                <div class="cv-section-title-full">Zertifizierungen & Kurse</div>
                <div class="cv-section-line"></div>
                <div class="cv-cert-grid">
                    ${validCerts.map(c => {
            const name = typeof c === 'string' ? c : c.name;
            const issuer = typeof c === 'string' ? '' : c.issuer;
            const date = typeof c === 'string' ? '' : c.date;
            const details = [issuer, date].filter(x => typeof x === 'string' && x.trim()).join(' • ');
            return `<div class="cv-cert-item">
                            <div class="cv-cert-name">${esc(name)}</div>
                            ${details ? `<div class="cv-cert-details">${esc(details)}</div>` : ''}
                        </div>`;
        }).join('')}
                </div>
            </div>
        `;
    }

    // ── Assemble full preview ──
    el.innerHTML = `
        <div class="cv-header">
            <div class="cv-header-left">
                ${photoHTML}
                <div class="cv-name-block">
                    <div class="cv-name">${esc(state.name) || 'Your Name'}</div>
                    <div class="cv-title">${esc(state.title) || 'Professional Title'}</div>
                </div>
            </div>
            ${contactHTML}
        </div>
        ${objectiveHTML}
        ${expHTML}
        ${eduHTML}
        ${bottomRowHTML}
        ${certHTML}
    `;
}
