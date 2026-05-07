/**
 * preview.js — CV live preview renderer (5 templates)
 */

let currentTemplate = 'classic';

function selectTemplate(name) {
    currentTemplate = name;
    // Update active button
    document.querySelectorAll('.tmpl-thumb').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tmpl-btn-' + name);
    if (btn) btn.classList.add('active');
    // Apply template class to cv-page
    const cvPage = document.getElementById('cv-page');
    if (cvPage) {
        cvPage.className = 'cv-page tmpl-' + name;
    }
    renderPreview();
}

// ── Shared helpers ──────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function photoHTML(style) {
    if (state.photo) {
        return `<div class="cv-photo cv-photo-${style}"><img src="${state.photo}" alt="Profile" style="object-position:${state.photoX}% ${state.photoY}%"></div>`;
    }
    const initials = (state.name || '').split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2);
    return `<div class="cv-photo cv-photo-${style}"><div class="cv-photo-placeholder">${initials || '?'}</div></div>`;
}

// ── TEMPLATE 1: CLASSIC ─────────────────────────────────────
function renderClassic() {
    const address = [state.city, state.postal, state.country].filter(Boolean).join(', ');
    const contacts = [
        state.email   ? `<span><i class="fas fa-envelope"></i> ${esc(state.email)}</span>` : '',
        state.phone   ? `<span><i class="fas fa-phone"></i> ${esc(state.phone)}</span>` : '',
        address       ? `<span><i class="fas fa-map-marker-alt"></i> ${esc(address)}</span>` : '',
        state.dob     ? `<span><i class="fas fa-birthday-cake"></i> ${esc(state.dob)}</span>` : '',
    ].filter(Boolean).join('');

    const objective = state.objective ? `
        <div class="cls-section">
            <div class="cls-section-title">Zielsetzung</div>
            <p class="cls-objective">${esc(state.objective)}</p>
        </div>` : '';

    const experience = state.experience.length ? `
        <div class="cls-section">
            <div class="cls-section-title">Berufserfahrung</div>
            ${state.experience.map(e => `
                <div class="cls-entry">
                    <div class="cls-entry-left">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div>
                    <div class="cls-entry-right">
                        <div class="cls-entry-title">${esc(e.title)}</div>
                        <div class="cls-entry-sub">${esc(e.institution)}</div>
                        ${e.desc ? `<div class="cls-entry-desc">${esc(e.desc)}</div>` : ''}
                    </div>
                </div>`).join('')}
        </div>` : '';

    const education = state.education.length ? `
        <div class="cls-section">
            <div class="cls-section-title">${esc(state.educationTitle || 'Ausbildung')}</div>
            ${state.education.map(e => `
                <div class="cls-entry">
                    <div class="cls-entry-left">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div>
                    <div class="cls-entry-right">
                        <div class="cls-entry-title">${esc(e.title)}</div>
                        <div class="cls-entry-sub">${esc(e.institution)}</div>
                    </div>
                </div>`).join('')}
        </div>` : '';

    const skills = state.skills.length ? `
        <div class="cls-section">
            <div class="cls-section-title">Kompetenzen</div>
            <div class="cls-skills">${state.skills.map(s => `<span class="cls-skill-tag">${esc(s)}</span>`).join('')}</div>
        </div>` : '';

    const langs = state.languages.length ? `
        <div class="cls-section">
            <div class="cls-section-title">Sprachkenntnisse</div>
            ${state.languages.map(l => {
                const lv = { Native: 'Muttersprache', Fluent: 'Fließend', Advanced: 'Fortgeschritten', Intermediate: 'Mittelstufe' }[l.level] || 'Grundkenntnisse';
                return `<div class="cls-entry">
                    <div class="cls-entry-left">${esc(l.name)}</div>
                    <div class="cls-entry-right"><span class="cls-entry-title">${esc(lv)}${l.note ? ', ' + esc(l.note) : ''}</span></div>
                </div>`;
            }).join('')}
        </div>` : '';

    const validCerts = state.certifications.filter(c => (typeof c === 'string' ? c.trim() : c?.name?.trim()));
    const certs = validCerts.length ? `
        <div class="cls-section">
            <div class="cls-section-title">Zertifizierungen</div>
            ${validCerts.map(c => {
                const name = typeof c === 'string' ? c : c.name;
                const det = typeof c === 'object' ? [c.issuer, c.date].filter(Boolean).join(' · ') : '';
                return `<div class="cls-cert"><span class="cls-cert-name">${esc(name)}</span>${det ? `<span class="cls-cert-det"> — ${esc(det)}</span>` : ''}</div>`;
            }).join('')}
        </div>` : '';

    const hobbies = state.hobbies.length ? `
        <div class="cls-section">
            <div class="cls-section-title">Interessen & Hobbies</div>
            <div class="cls-skills">${state.hobbies.map(h => `<span class="cls-skill-tag">${esc(h)}</span>`).join('')}</div>
        </div>` : '';

    return `
        <div class="cls-header">
            ${photoHTML('cls')}
            <div class="cls-header-text">
                <div class="cls-name">${esc(state.name) || 'Your Name'}</div>
                <div class="cls-title">${esc(state.title) || 'Professional Title'}</div>
                ${contacts ? `<div class="cls-contacts">${contacts}</div>` : ''}
            </div>
        </div>
        <div class="cls-divider"></div>
        ${objective}${experience}${education}${skills}${langs}${certs}${hobbies}`;
}

// ── TEMPLATE 2: MODERN ──────────────────────────────────────
function renderModern() {
    const address = [state.city, state.postal, state.country].filter(Boolean).join(', ');
    let contactHTML = '';
    if (state.email || state.phone || address || state.dob) {
        contactHTML = `<div class="cv-header-right">`;
        if (state.email) contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">E-Mail</span><span class="cv-contact-value">${esc(state.email)}</span></div>`;
        if (address)     contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Adresse</span><span class="cv-contact-value">${esc(address)}</span></div>`;
        if (state.phone) contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Telefon</span><span class="cv-contact-value">${esc(state.phone)}</span></div>`;
        if (state.dob)   contactHTML += `<div class="cv-contact-row"><span class="cv-contact-label">Geburtsdatum</span><span class="cv-contact-value">${esc(state.dob)}</span></div>`;
        contactHTML += `</div>`;
    }
    const objectiveHTML = state.objective ? `<div class="cv-section"><div class="cv-section-title-full">Zielsetzung</div><div class="cv-section-line"></div><p style="font-size:12px;color:#555;line-height:1.5;margin:0">${esc(state.objective)}</p></div>` : '';
    const expHTML = state.experience.length ? `<div class="cv-section"><div class="cv-section-title-full">Berufserfahrung</div><div class="cv-section-line"></div><div class="cv-two-col">${state.experience.map(e => `<div class="cv-entry"><div class="cv-entry-date">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div><div class="cv-entry-title">${esc(e.title)}</div><div class="cv-entry-institution">${esc(e.institution)}</div>${e.desc ? `<div class="cv-entry-desc">${esc(e.desc)}</div>` : ''}</div>`).join('')}</div></div>` : '';
    const eduHTML = state.education.length ? `<div class="cv-section"><div class="cv-section-title-full">${esc(state.educationTitle || 'Ausbildung')}</div><div class="cv-section-line"></div><div class="cv-two-col">${state.education.map(e => `<div class="cv-entry"><div class="cv-entry-date">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div><div class="cv-entry-title">${esc(e.title)}</div><div class="cv-entry-institution">${esc(e.institution)}</div></div>`).join('')}</div></div>` : '';
    const skillsSec = state.skills.length ? `<div class="cv-section" style="margin-bottom:0"><div class="cv-section-title-full">Kompetenzen</div><div class="cv-section-line"></div><ul class="cv-skills-list">${state.skills.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : '';
    const langSec = state.languages.length ? `<div class="cv-section" style="margin-bottom:0"><div class="cv-section-title-full">Sprachkenntnisse</div><div class="cv-section-line"></div><div class="cv-lang-table">${state.languages.map(l => {
        const lv = { Native: 'Muttersprache', Fluent: 'Fließend', Advanced: 'Fortgeschritten', Intermediate: 'Mittelstufe' }[l.level] || 'Grundkenntnisse';
        return `<div class="cv-lang-row"><span class="cv-lang-name">${esc(l.name)}</span><span class="cv-lang-level">${esc(lv)}${l.note ? ', ' + esc(l.note) : ''}</span></div>`;
    }).join('')}</div></div>` : '';
    const bottomRow = (state.skills.length || state.languages.length) ? `<div class="cv-bottom-row">${skillsSec}${langSec}</div>` : '';
    const validCerts = state.certifications.filter(c => (typeof c === 'string' ? c.trim() : c?.name?.trim()));
    const certHTML = validCerts.length ? `<div class="cv-section"><div class="cv-section-title-full">Zertifizierungen &amp; Kurse</div><div class="cv-section-line"></div><div class="cv-cert-grid">${validCerts.map(c => {
        const name = typeof c === 'string' ? c : c.name;
        const det = typeof c === 'object' ? [c.issuer, c.date].filter(Boolean).join(' • ') : '';
        return `<div class="cv-cert-item"><div class="cv-cert-name">${esc(name)}</div>${det ? `<div class="cv-cert-details">${esc(det)}</div>` : ''}</div>`;
    }).join('')}</div></div>` : '';

    const hobbyHTML = state.hobbies.length ? `<div class="cv-section"><div class="cv-section-title-full">Interessen & Hobbies</div><div class="cv-section-line"></div><div class="cv-hobby-tags">${state.hobbies.map(h => `<span class="cv-hobby-tag">${esc(h)}</span>`).join('')}</div></div>` : '';

    return `
        <div class="cv-header">
            <div class="cv-header-left">${photoHTML('mod')}<div class="cv-name-block"><div class="cv-name">${esc(state.name) || 'Your Name'}</div><div class="cv-title">${esc(state.title) || 'Professional Title'}</div></div></div>
            ${contactHTML}
        </div>
        ${objectiveHTML}${expHTML}${eduHTML}${bottomRow}${certHTML}${hobbyHTML}`;
}


// ── TEMPLATE 4: SIDEBAR ─────────────────────────────────────
function renderSidebar() {
    const address = [state.city, state.postal, state.country].filter(Boolean).join(', ');
    const lv = (l) => ({ Native: 'Muttersprache', Fluent: 'Fließend', Advanced: 'Fortgeschritten', Intermediate: 'Mittelstufe' }[l] || 'Grundkenntnisse');

    const sidebarContact = [
        state.email ? `<div class="sb-contact-item"><i class="fas fa-envelope"></i><span>${esc(state.email)}</span></div>` : '',
        state.phone ? `<div class="sb-contact-item"><i class="fas fa-phone"></i><span>${esc(state.phone)}</span></div>` : '',
        address     ? `<div class="sb-contact-item"><i class="fas fa-map-marker-alt"></i><span>${esc(address)}</span></div>` : '',
        state.dob   ? `<div class="sb-contact-item"><i class="fas fa-birthday-cake"></i><span>${esc(state.dob)}</span></div>` : '',
    ].filter(Boolean).join('');

    const sidebarSkills = state.skills.length ? `
        <div class="sb-sidebar-section">
            <div class="sb-sidebar-heading">Kompetenzen</div>
            ${state.skills.map(s => `<div class="sb-skill-item"><span class="sb-skill-bullet">▸</span>${esc(s)}</div>`).join('')}
        </div>` : '';

    const sidebarLangs = state.languages.length ? `
        <div class="sb-sidebar-section">
            <div class="sb-sidebar-heading">Sprachen</div>
            ${state.languages.map(l => `
                <div class="sb-lang-item">
                    <span class="sb-lang-name">${esc(l.name)}</span>
                    <span class="sb-lang-lv">${lv(l.level)}</span>
                </div>`).join('')}
        </div>` : '';

    const validCerts = state.certifications.filter(c => (typeof c === 'string' ? c.trim() : c?.name?.trim()));
    const sidebarCerts = validCerts.length ? `
        <div class="sb-sidebar-section">
            <div class="sb-sidebar-heading">Zertifizierungen</div>
            ${validCerts.map(c => {
                const name = typeof c === 'string' ? c : c.name;
                const det = typeof c === 'object' ? [c.issuer, c.date].filter(Boolean).join(' · ') : '';
                return `<div class="sb-cert-item"><div class="sb-cert-name">${esc(name)}</div>${det ? `<div class="sb-cert-det">${esc(det)}</div>` : ''}</div>`;
            }).join('')}
        </div>` : '';

    const mainObjective = state.objective ? `
        <div class="sb-main-section">
            <div class="sb-main-heading">Zielsetzung</div>
            <p class="sb-para">${esc(state.objective)}</p>
        </div>` : '';

    const mainExp = state.experience.length ? `
        <div class="sb-main-section">
            <div class="sb-main-heading">Berufserfahrung</div>
            ${state.experience.map(e => `
                <div class="sb-entry">
                    <div class="sb-entry-dot"></div>
                    <div class="sb-entry-content">
                        <div class="sb-entry-date">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div>
                        <div class="sb-entry-title">${esc(e.title)}</div>
                        <div class="sb-entry-inst">${esc(e.institution)}</div>
                        ${e.desc ? `<div class="sb-entry-desc">${esc(e.desc)}</div>` : ''}
                    </div>
                </div>`).join('')}
        </div>` : '';

    const mainEdu = state.education.length ? `
        <div class="sb-main-section">
            <div class="sb-main-heading">${esc(state.educationTitle || 'Ausbildung')}</div>
            ${state.education.map(e => `
                <div class="sb-entry">
                    <div class="sb-entry-dot"></div>
                    <div class="sb-entry-content">
                        <div class="sb-entry-date">${esc(e.dateFrom)} – ${esc(e.dateTo)}</div>
                        <div class="sb-entry-title">${esc(e.title)}</div>
                        <div class="sb-entry-inst">${esc(e.institution)}</div>
                    </div>
                </div>`).join('')}
        </div>` : '';

    const sidebarHobbies = state.hobbies.length ? `
        <div class="sb-sidebar-section">
            <div class="sb-sidebar-heading">Interessen</div>
            ${state.hobbies.map(h => `<div class="sb-skill-item"><span class="sb-skill-bullet">▸</span>${esc(h)}</div>`).join('')}
        </div>` : '';

    return `
        <div class="sb-layout">
            <div class="sb-sidebar">
                ${photoHTML('sb')}
                <div class="sb-sidebar-name">${esc(state.name) || 'Your Name'}</div>
                <div class="sb-sidebar-title">${esc(state.title) || 'Professional Title'}</div>
                ${sidebarContact ? `<div class="sb-sidebar-section">${sidebarContact}</div>` : ''}
                ${sidebarSkills}${sidebarLangs}${sidebarCerts}${sidebarHobbies}
            </div>
            <div class="sb-main">
                ${mainObjective}${mainExp}${mainEdu}
            </div>
        </div>`;
}

// ── TEMPLATE 5: CREATIVE ────────────────────────────────────
function renderCreative() {
    const address = [state.city,state.postal, state.country].filter(Boolean).join(', ');
    const lv = (l) => ({ Native: 'Muttersprache', Fluent: 'Fließend', Advanced: 'Fortgeschritten', Intermediate: 'Mittelstufe' }[l] || 'Grundkenntnisse');

    const objective = state.objective ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Zielsetzung</span></div>
            <p class="cr-para">${esc(state.objective)}</p>
        </div>` : '';

    const experience = state.experience.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Berufserfahrung</span></div>
            ${state.experience.map(e => `
                <div class="cr-entry">
                    <div class="cr-entry-badge">${esc(e.dateFrom)}<br>${esc(e.dateTo)}</div>
                    <div class="cr-entry-body">
                        <div class="cr-entry-title">${esc(e.title)}</div>
                        <div class="cr-entry-inst">${esc(e.institution)}</div>
                        ${e.desc ? `<div class="cr-entry-desc">${esc(e.desc)}</div>` : ''}
                    </div>
                </div>`).join('')}
        </div>` : '';

    const education = state.education.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>${esc(state.educationTitle || 'Ausbildung')}</span></div>
            ${state.education.map(e => `
                <div class="cr-entry">
                    <div class="cr-entry-badge">${esc(e.dateFrom)}<br>${esc(e.dateTo)}</div>
                    <div class="cr-entry-body">
                        <div class="cr-entry-title">${esc(e.title)}</div>
                        <div class="cr-entry-inst">${esc(e.institution)}</div>
                    </div>
                </div>`).join('')}
        </div>` : '';

    const skills = state.skills.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Kompetenzen</span></div>
            <div class="cr-tags">${state.skills.map(s => `<span class="cr-tag">${esc(s)}</span>`).join('')}</div>
        </div>` : '';

    const langs = state.languages.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Sprachen</span></div>
            <div class="cr-lang-grid">${state.languages.map(l => `
                <div class="cr-lang-item">
                    <div class="cr-lang-name">${esc(l.name)}</div>
                    <div class="cr-lang-lv">${lv(l.level)}</div>
                </div>`).join('')}
            </div>
        </div>` : '';

    const validCerts = state.certifications.filter(c => (typeof c === 'string' ? c.trim() : c?.name?.trim()));
    const certs = validCerts.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Zertifizierungen</span></div>
            <div class="cr-certs">${validCerts.map(c => {
                const name = typeof c === 'string' ? c : c.name;
                const det = typeof c === 'object' ? [c.issuer, c.date].filter(Boolean).join(' · ') : '';
                return `<div class="cr-cert"><span class="cr-cert-name">${esc(name)}</span>${det ? `<span class="cr-cert-det"> — ${esc(det)}</span>` : ''}</div>`;
            }).join('')}
            </div>
        </div>` : '';

    const hobbies = state.hobbies.length ? `
        <div class="cr-section">
            <div class="cr-section-title"><span>Interessen & Hobbies</span></div>
            <div class="cr-tags">${state.hobbies.map(h => `<span class="cr-tag cr-hobby-tag">${esc(h)}</span>`).join('')}</div>
        </div>` : '';

    return `
        <div class="cr-header">
            ${photoHTML('cr')}
            <div class="cr-header-text">
                <div class="cr-name">${esc(state.name) || 'Your Name'}</div>
                <div class="cr-job-title">${esc(state.title) || 'Professional Title'}</div>
                <div class="cr-contacts">
                    ${state.email ? `<span><i class="fas fa-envelope"></i> ${esc(state.email)}</span>` : ''}
                    ${state.phone ? `<span><i class="fas fa-phone"></i> ${esc(state.phone)}</span>` : ''}
                    ${address ? `<span><i class="fas fa-map-marker-alt"></i> ${esc(address)}</span>` : ''}
                    ${state.dob ? `<span><i class="fas fa-birthday-cake"></i> ${esc(state.dob)}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="cr-body">
            ${objective}${experience}${education}${skills}${langs}${certs}${hobbies}
        </div>`;
}

// ── Main render dispatcher ───────────────────────────────────
function renderPreview() {
    const el = document.getElementById('cv-preview');
    const cvPage = document.getElementById('cv-page');

    if (cvPage) cvPage.className = 'cv-page tmpl-' + currentTemplate;

    const renderers = {
        classic:  renderClassic,
        modern:   renderModern,
        sidebar:  renderSidebar,
        creative: renderCreative,
    };
    el.innerHTML = (renderers[currentTemplate] || renderClassic)();
}
