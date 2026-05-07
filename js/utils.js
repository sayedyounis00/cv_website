/**
 * utils.js — Shared utility functions
 */

/** Escape HTML to prevent XSS */
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

/** Auto-format date text input to DD.MM.YYYY */
function formatDate(input) {
    let val = input.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length > 2) val = val.slice(0, 2) + '.' + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + '.' + val.slice(5);
    if (val.length > 10) val = val.slice(0, 10); // max length
    input.value = val;
}

/** Toggle collapsible entry card body */
function toggleEntry(header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.entry-toggle i');
    body.classList.toggle('open');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

/** Update the header text when editing a card's fields (in-place, no re-render) */
function updateEntryHeader(input) {
    const card = input.closest('.entry-card');
    if (!card) return;

    // Gather current values from all inputs inside this card's body
    const body = card.querySelector('.entry-body');
    if (!body) return;
    const inputs = body.querySelectorAll('input[type="text"]');

    // Determine which state array this belongs to
    const step = input.closest('.form-step');
    let stateArr, idx;
    if (step.id === 'step-3') {
        stateArr = state.experience;
    } else if (step.id === 'step-4') {
        stateArr = state.education;
    } else {
        return;
    }

    // Find the card's index among siblings
    const container = card.parentElement;
    idx = Array.from(container.children).indexOf(card);
    if (idx < 0 || !stateArr[idx]) return;

    const item = stateArr[idx];

    // Update the header text in-place
    const titleEl = card.querySelector('.entry-title');
    const subtitleEl = card.querySelector('.entry-subtitle');
    if (titleEl) titleEl.textContent = item.title || 'Untitled';
    if (subtitleEl) subtitleEl.textContent = `${item.institution || ''} · ${item.dateFrom || ''}–${item.dateTo || ''}`;
}

/** Update a single state key and re-render preview */
function updateState(key, value) {
    state[key] = value;
    renderPreview();
}

/** Handle profile photo upload */
function handlePhoto(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        state.photo = e.target.result;
        state.photoX = 50;
        state.photoY = 50;
        buildPhotoAdjuster(e.target.result);
        renderPreview();
    };
    reader.readAsDataURL(input.files[0]);
}

/**
 * Build the drag-to-reposition photo widget inside #photo-upload.
 * The image fills the container and the user drags it to pan.
 */
function buildPhotoAdjuster(src) {
    const uploadBox = document.getElementById('photo-upload');

    uploadBox.innerHTML = `
        <div class="photo-adjuster" id="photo-adjuster">
            <img id="photo-adj-img"
                 src="${src}"
                 alt="Profile"
                 draggable="false"
                 style="object-position: ${state.photoX}% ${state.photoY}%">
            <div class="photo-adj-hint">
                <i class="fas fa-arrows-alt"></i> Drag to reposition
            </div>
        </div>
        <div class="photo-adj-meta">
            <span class="photo-adj-label">Photo uploaded</span>
            <button class="photo-adj-change" onclick="document.getElementById('photo-input').click()">
                <i class="fas fa-sync-alt"></i> Change
            </button>
        </div>`;

    // Attach drag handling
    initPhotoDrag(document.getElementById('photo-adjuster'), document.getElementById('photo-adj-img'));
}

/** Mouse + touch drag-to-reposition logic */
function initPhotoDrag(zone, img) {
    let dragging = false;
    let startX, startY, startPosX, startPosY;

    function onStart(e) {
        dragging = true;
        zone.classList.add('dragging');
        const pt = e.touches ? e.touches[0] : e;
        startX = pt.clientX;
        startY = pt.clientY;
        startPosX = state.photoX;
        startPosY = state.photoY;
        e.preventDefault();
    }

    function onMove(e) {
        if (!dragging) return;
        const pt = e.touches ? e.touches[0] : e;
        // Sensitivity: divide delta by zone size so 1px drag ≈ proportional % shift
        // Moving left  → positive X offset → image appears to shift right → reduce X
        const dx = ((pt.clientX - startX) / zone.offsetWidth) * 100;
        const dy = ((pt.clientY - startY) / zone.offsetHeight) * 100;
        state.photoX = Math.min(100, Math.max(0, startPosX - dx));
        state.photoY = Math.min(100, Math.max(0, startPosY - dy));
        img.style.objectPosition = `${state.photoX}% ${state.photoY}%`;
        renderPreview();
        e.preventDefault();
    }

    function onEnd() {
        dragging = false;
        zone.classList.remove('dragging');
    }

    zone.addEventListener('mousedown', onStart);
    zone.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
}

/** Download CV as PDF directly — no print dialog */
function printCV() {
    const cvPage = document.getElementById('cv-page');
    const cvInner = document.getElementById('cv-preview');

    // Save original styles we'll modify
    const origTransform = cvPage.style.transform;
    const origOrigin = cvPage.style.transformOrigin;
    const origMinHeight = cvPage.style.minHeight;
    const origMaxWidth = cvPage.style.maxWidth;
    const origWidth = cvPage.style.width;
    const origBoxShadow = cvPage.style.boxShadow;
    const origBorderRadius = cvPage.style.borderRadius;
    const origOverflow = cvPage.style.overflow;

    // Save sb-layout min-height if sidebar template
    const sbLayout = cvPage.querySelector('.sb-layout');
    const origSbMinHeight = sbLayout ? sbLayout.style.minHeight : '';

    // Save wrapper/panel styles so we can force cv-page flush to top-left during capture
    const wrapper = document.getElementById('cv-page-wrapper');
    const rightPanel = document.getElementById('right-panel');
    const origWrapperPadding = wrapper ? wrapper.style.padding : '';
    const origWrapperMaxWidth = wrapper ? wrapper.style.maxWidth : '';
    const origPanelJustify = rightPanel ? rightPanel.style.justifyContent : '';
    const origPanelAlignItems = rightPanel ? rightPanel.style.alignItems : '';
    const origPanelOverflow = rightPanel ? rightPanel.style.overflow : '';

    // Generate filename
    const safeName = (state.name || 'My').trim().replace(/\s+/g, '_');
    const filename = `${safeName}_CV.pdf`;

    // Show loading
    const btns = document.querySelectorAll('.nav-btn-download');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.dataset.origHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
    });

    // A4 dimensions in px at 96dpi
    const A4_WIDTH_PX = 794;  // 210mm
    const A4_HEIGHT_PX = 1123; // 297mm

    // Step 1: Reset all sizing constraints so we measure true content height
    cvPage.style.transform = 'none';
    cvPage.style.transformOrigin = 'top left';
    cvPage.style.minHeight = '0';
    cvPage.style.maxWidth = A4_WIDTH_PX + 'px';
    cvPage.style.width = A4_WIDTH_PX + 'px';
    cvPage.style.boxShadow = 'none';
    cvPage.style.borderRadius = '0';
    // CRITICAL: clip pseudo-elements (::before/::after accent bars, creative
    // header circle) so they don't inflate scrollWidth and cause a scale-down
    cvPage.style.overflow = 'hidden';
    if (sbLayout) sbLayout.style.minHeight = '0';

    // Force the wrapper/panel to position cv-page at top-left with no centering
    // offset so html2canvas captures exactly the CV content without extra left space.
    if (wrapper) { wrapper.style.padding = '0'; wrapper.style.maxWidth = 'none'; }
    if (rightPanel) {
        rightPanel.style.justifyContent = 'flex-start';
        rightPanel.style.alignItems = 'flex-start';
        rightPanel.style.overflow = 'hidden';
    }

    // Step 2: Wait for reflow, then measure and scale
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const contentHeight = cvPage.scrollHeight;

            // Calculate scale to fit content into A4 height
            let scale = 1;
            if (contentHeight > A4_HEIGHT_PX) {
                scale = A4_HEIGHT_PX / contentHeight;
            }

            // Width is already set to A4_WIDTH_PX, no need to check scrollWidth
            // (overflow:hidden clips any pseudo-element overshoot)

            const captureWidth = A4_WIDTH_PX;
            // Capture at actual content height (not forced to A4)
            const captureHeight = scale < 1 ? A4_HEIGHT_PX : contentHeight;

            // If content is taller than A4, scale the entire element
            if (scale < 1) {
                cvPage.style.transform = `scale(${scale})`;
                cvPage.style.transformOrigin = 'top left';
            }

            // PDF page size matches content (removes bottom whitespace)
            const pdfPageWidth = A4_WIDTH_PX * 2;
            const pdfPageHeight = captureHeight * 2;

            const opt = {
                margin: 0,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false,
                    width: captureWidth,
                    height: captureHeight,
                    windowWidth: captureWidth,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0,
                    x: 0,
                    y: 0
                },
                jsPDF: {
                    unit: 'px',
                    format: [pdfPageWidth, pdfPageHeight],
                    orientation: 'portrait',
                    hotfixes: ['px_scaling']
                },
                pagebreak: { mode: ['avoid-all'] }
            };

            html2pdf().set(opt).from(cvPage).save().then(() => {
                restoreStyles();
            }).catch(err => {
                console.error('PDF generation failed:', err);
                restoreStyles();
                alert('PDF generation failed. Please try again.');
            });
        });
    });

    function restoreStyles() {
        btns.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.origHtml;
        });
        cvPage.style.transform = origTransform;
        cvPage.style.transformOrigin = origOrigin;
        cvPage.style.minHeight = origMinHeight;
        cvPage.style.maxWidth = origMaxWidth;
        cvPage.style.width = origWidth;
        cvPage.style.boxShadow = origBoxShadow;
        cvPage.style.borderRadius = origBorderRadius;
        cvPage.style.overflow = origOverflow;
        if (sbLayout) sbLayout.style.minHeight = origSbMinHeight;
        // Restore wrapper/panel layout
        if (wrapper) { wrapper.style.padding = origWrapperPadding; wrapper.style.maxWidth = origWrapperMaxWidth; }
        if (rightPanel) {
            rightPanel.style.justifyContent = origPanelJustify;
            rightPanel.style.alignItems = origPanelAlignItems;
            rightPanel.style.overflow = origPanelOverflow;
        }
    }
}


