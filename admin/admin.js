// State
let siteData = { links: [] };
let currentEditingLinkId = null;
let draggedItemIndex = null;

// DOM Elements
const els = {
    generalForm: document.getElementById('general-form'),
    linksContainer: document.getElementById('links-container'),
    linkModal: document.getElementById('link-modal'),
    linkForm: document.getElementById('link-form'),
    searchLinks: document.getElementById('search-links'),
    filterVis: document.getElementById('filter-visibility'),
    filterType: document.getElementById('filter-type'),
    saveStatus: document.getElementById('save-status'),
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    setupEventListeners();
    setupGeneralSettingsListeners();
});

function loadData() {
    const autosave = localStorage.getItem('snapblitz_admin_autosave');
    if (autosave) {
        try {
            siteData = JSON.parse(autosave);
        } catch (e) {
            console.error("Autosave parse error", e);
            fallbackLoad();
        }
    } else {
        fallbackLoad();
    }

    if (!siteData.links) siteData.links = [];
    
    // Ensure priority exists
    siteData.links.forEach((link, idx) => {
        if (typeof link.priority !== 'number') link.priority = idx + 1;
    });
    sortLinks();
    
    populateGeneralSettings();
    renderLinks();
}

function fallbackLoad() {
    if (window.SITE_DATA) {
        siteData = JSON.parse(JSON.stringify(window.SITE_DATA));
        els.saveStatus.textContent = 'Loaded from original data.js';
        els.saveStatus.style.color = 'var(--text-muted)';
    } else {
        els.saveStatus.textContent = 'Error: data.js not found. Please import.';
        els.saveStatus.style.color = 'var(--warning)';
    }
}

function saveToLocal() {
    localStorage.setItem('snapblitz_admin_autosave', JSON.stringify(siteData));
}

function sortLinks() {
    siteData.links.sort((a, b) => a.priority - b.priority);
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update buttons
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Update views
            document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
            document.getElementById(e.currentTarget.dataset.target).classList.add('active');
        });
    });
}

// General Settings
function populateGeneralSettings() {
    const form = els.generalForm;
    if (!siteData.siteTitle) return; // Empty state
    
    form.elements['siteTitle'].value = siteData.siteTitle || '';
    form.elements['profileUrl'].value = siteData.profileUrl || '';
    form.elements['defaultButtonText'].value = siteData.defaultButtonText || '';
    form.elements['maxResults'].value = siteData.maxResults || 50;
    
    form.elements['profilePhotoUrl'].value = siteData.profilePhotoUrl || 'Assets/Profile photo/profile.jpg';
    document.getElementById('profile-preview').src = siteData.profilePhotoUrl ? siteData.profilePhotoUrl : 'placeholder.png';

    if (siteData.socialMedia) {
        form.elements['social.instagram'].value = siteData.socialMedia.instagram || '';
        form.elements['social.facebook'].value = siteData.socialMedia.facebook || '';
        form.elements['social.linkedin'].value = siteData.socialMedia.linkedin || '';
        form.elements['social.youtube'].value = siteData.socialMedia.youtube || '';
        form.elements['social.telegram'].value = siteData.socialMedia.telegram || '';
    }

    if (siteData.theme) {
        form.elements['theme.backgroundPrimary'].value = siteData.theme.backgroundPrimary ? siteData.theme.backgroundPrimary.substring(0, 7) : '#000000';
        form.elements['theme.accentPrimary'].value = siteData.theme.accentPrimary ? siteData.theme.accentPrimary.substring(0, 7) : '#8b5cf6';
        form.elements['theme.accentSecondary'].value = siteData.theme.accentSecondary ? siteData.theme.accentSecondary.substring(0, 7) : '#7c3aed';
        
        document.getElementById('theme_bg_text').value = siteData.theme.backgroundPrimary || '';
        document.getElementById('theme_acc1_text').value = siteData.theme.accentPrimary || '';
        document.getElementById('theme_acc2_text').value = siteData.theme.accentSecondary || '';
    }
}

function setupGeneralSettingsListeners() {
    els.generalForm.addEventListener('input', (e) => {
        // Sync general settings on input to state
        const name = e.target.name;
        if (!name) return;
        
        if (name.startsWith('social.')) {
            if(!siteData.socialMedia) siteData.socialMedia = {};
            siteData.socialMedia[name.split('.')[1]] = e.target.value;
        } else if (name.startsWith('theme.')) {
            if(!siteData.theme) siteData.theme = {};
            const key = name.split('.')[1];
            // Hex append ff for alpha if needed or just keep raw
            siteData.theme[key] = e.target.value;
            // update text input preview
            const textInput = document.getElementById(e.target.id + '_text');
            if(textInput) textInput.value = e.target.value;
        } else {
            siteData[name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        }
        saveToLocal();
    });

    // Profile photo upload
    document.getElementById('profilePhotoUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const relativePath = `Assets/Profile photo/${file.name}`;
            siteData.profilePhotoUrl = relativePath;
            els.generalForm.elements['profilePhotoUrl'].value = relativePath;
            
            const fnDisplay = document.getElementById('profile-filename-display');
            if (fnDisplay) {
                fnDisplay.style.display = 'block';
                fnDisplay.querySelector('span').textContent = file.name;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => { document.getElementById('profile-preview').src = e.target.result; };
            reader.readAsDataURL(file);
            
            saveToLocal();
        }
    });
}

// Links Rendering
function renderLinks() {
    const q = els.searchLinks.value.toLowerCase();
    const visFilter = els.filterVis.value;
    const typeFilter = els.filterType.value;
    
    els.linksContainer.innerHTML = '';
    
    // Performance: DocumentFragment
    const frag = document.createDocumentFragment();

    siteData.links.forEach((link, index) => {
        // Filters
        if (q && !link.title.toLowerCase().includes(q) && !(link.description||'').toLowerCase().includes(q) && link.id.toLowerCase() !== q) return;
        if (visFilter === 'visible' && !link.visible) return;
        if (visFilter === 'hidden' && link.visible) return;
        if (typeFilter === 'normal' && link.type === 'prompt') return;
        if (typeFilter === 'prompt' && link.type !== 'prompt') return;

        const li = document.createElement('li');
        li.className = `link-item ${link.visible ? '' : 'hidden-item'}`;
        li.dataset.id = link.id;
        li.dataset.index = index;
        li.draggable = true;
        
        // Drag events
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        const thumbSrc = link.thumbnail ? link.thumbnail : 'placeholder.png';
        const typeBadge = link.type === 'prompt' ? '<span class="badge prompt">Prompt</span>' : '<span class="badge normal">Normal</span>';

        li.innerHTML = `
            <div class="col-drag" title="Drag to reorder">☰</div>
            <div class="col-thumb">
                <img src="${thumbSrc}" onerror="this.src='placeholder.png';" alt="Thumb">
            </div>
            <div class="col-details">
                <strong>${link.title || 'Untitled'}</strong>
                <small>${link.description || ''}</small>
            </div>
            <div class="col-type">${typeBadge}</div>
            <div class="col-vis">${link.visible ? '✅' : '❌'}</div>
            <div class="col-actions">
                <button class="icon-btn edit-btn" title="Edit">✏️</button>
                <button class="icon-btn copy-btn" title="Duplicate">📋</button>
                <button class="icon-btn del-btn" title="Delete">🗑️</button>
            </div>
        `;

        li.querySelector('.edit-btn').addEventListener('click', () => openLinkEditor(link.id));
        li.querySelector('.copy-btn').addEventListener('click', () => duplicateLink(link.id));
        li.querySelector('.del-btn').addEventListener('click', () => confirmDeleteLink(link.id));

        frag.appendChild(li);
    });

    els.linksContainer.appendChild(frag);
}

// Search & Filter listeners
els.searchLinks.addEventListener('input', renderLinks);
els.filterVis.addEventListener('change', renderLinks);
els.filterType.addEventListener('change', renderLinks);

// Drag & Drop Reordering
function handleDragStart(e) {
    draggedItemIndex = parseInt(this.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    setTimeout(() => this.style.opacity = '0.5', 0);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    const dropIndex = parseInt(this.dataset.index);
    if (draggedItemIndex !== dropIndex) {
        // Reorder in array
        const draggedItem = siteData.links.splice(draggedItemIndex, 1)[0];
        siteData.links.splice(dropIndex, 0, draggedItem);
        // Update priorities
        siteData.links.forEach((l, idx) => l.priority = idx + 1);
        saveToLocal();
        renderLinks();
    }
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.link-item').forEach(item => item.style.opacity = '1');
}

// Link Editor
function setupEventListeners() {
    document.getElementById('add-link-btn').addEventListener('click', () => {
        openLinkEditor(null); // null = new link
    });

    // Close Modals
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.add('hidden');
        });
    });

    // Toggle Type fields
    document.getElementById('link_type').addEventListener('change', (e) => {
        if (e.target.value === 'prompt') {
            document.getElementById('prompt-link-fields').classList.remove('hidden');
            document.getElementById('normal-link-fields').classList.add('hidden');
        } else {
            document.getElementById('prompt-link-fields').classList.add('hidden');
            document.getElementById('normal-link-fields').classList.remove('hidden');
        }
    });

    // Auto-generate ID from Title
    document.getElementById('link_title').addEventListener('input', (e) => {
        // Only auto-gen if adding new (or if id is empty)
        if (!currentEditingLinkId) {
            const val = e.target.value;
            const safeId = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            document.getElementById('link_id').value = safeId;
        }
    });

    // Save Link
    document.getElementById('save-link-btn').addEventListener('click', saveLink);

    // Link Thumbnail Upload
    document.getElementById('link_thumbnail_upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const relativePath = `Assets/Links thumbnail/${file.name}`;
            document.getElementById('link_thumbnail_path').value = relativePath;
            
            const fnDisplay = document.getElementById('thumb-filename-display');
            if (fnDisplay) {
                fnDisplay.style.display = 'block';
                fnDisplay.querySelector('span').textContent = file.name;
            }

            const reader = new FileReader();
            reader.onload = (ev) => { document.getElementById('link-thumb-preview').src = ev.target.result; };
            reader.readAsDataURL(file);
        }
    });

    // Delete Confirm
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        const idToDelete = document.getElementById('delete-modal').dataset.id;
        siteData.links = siteData.links.filter(l => l.id !== idToDelete);
        siteData.links.forEach((l, idx) => l.priority = idx + 1); // update priorities
        saveToLocal();
        renderLinks();
        document.getElementById('delete-modal').classList.add('hidden');
    });

    // Import Backup data.js
    document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-input').click());
    document.getElementById('import-input').addEventListener('change', handleImport);

    // SAVE
    document.getElementById('export-btn').addEventListener('click', handleSave);
    document.getElementById('force-export-btn').addEventListener('click', () => doSave(true));
}

function openLinkEditor(linkId) {
    currentEditingLinkId = linkId;
    const modal = els.linkModal;
    const form = els.linkForm;
    
    form.reset();
    document.getElementById('link-thumb-preview').src = 'placeholder.png';
    document.getElementById('link_thumbnail_path').value = '';
    const fnDisplay = document.getElementById('thumb-filename-display');
    if (fnDisplay) fnDisplay.style.display = 'none';

    if (linkId) {
        // Edit mode
        document.getElementById('link-modal-title').textContent = 'Edit Link';
        const link = siteData.links.find(l => l.id === linkId);
        if(!link) return;

        document.getElementById('link-original-id').value = link.id;
        document.getElementById('link_id').value = link.id;
        document.getElementById('link_title').value = link.title || '';
        document.getElementById('link_description').value = link.description || '';
        document.getElementById('link_keywords').value = Array.isArray(link.keywords) ? link.keywords.join(', ') : '';
        
        document.getElementById('link_type').value = link.type === 'prompt' ? 'prompt' : 'normal';
        document.getElementById('link_visible').checked = link.visible !== false;

        document.getElementById('link_buttonText').value = link.buttonText || '';
        document.getElementById('link_ctaText').value = link.ctaText || '';
        
        if (link.type === 'prompt') {
            document.getElementById('link_promptText').value = link.promptText || '';
            document.getElementById('link_prompt_redirect').value = link.followRedirectUrl || '';
        } else {
            document.getElementById('link_followRedirectUrl').value = link.followRedirectUrl || '';
        }

        if (link.thumbnail) {
            document.getElementById('link_thumbnail_path').value = link.thumbnail;
            document.getElementById('link-thumb-preview').src = link.thumbnail;
        }
    } else {
        // Add mode
        document.getElementById('link-modal-title').textContent = 'Add New Link';
        document.getElementById('link-original-id').value = '';
        document.getElementById('link_type').value = 'normal';
        document.getElementById('link_visible').checked = true;
    }
    
    // Trigger change to set fields visibility
    document.getElementById('link_type').dispatchEvent(new Event('change'));
    
    modal.classList.remove('hidden');
}

function saveLink() {
    if (!els.linkForm.checkValidity()) {
        els.linkForm.reportValidity();
        return;
    }

    const id = document.getElementById('link_id').value.trim();
    const origId = document.getElementById('link-original-id').value;

    // Check duplicate ID
    if ((!origId || origId !== id) && siteData.links.some(l => l.id === id)) {
        alert("This ID already exists. Please choose a unique ID.");
        return;
    }

    const type = document.getElementById('link_type').value;
    
    // Parse keywords (comma separated)
    const keywordsRaw = document.getElementById('link_keywords').value;
    const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(k => k);

    const newLink = {
        id: id,
        title: document.getElementById('link_title').value.trim(),
        description: document.getElementById('link_description').value.trim(),
        keywords: keywords,
        thumbnail: document.getElementById('link_thumbnail_path').value.trim(),
        buttonText: document.getElementById('link_buttonText').value.trim(),
        ctaText: document.getElementById('link_ctaText').value.trim(),
        visible: document.getElementById('link_visible').checked,
    };

    if (type === 'prompt') {
        newLink.type = 'prompt';
        newLink.promptText = document.getElementById('link_promptText').value.trim();
        const redir = document.getElementById('link_prompt_redirect').value.trim();
        if (redir) newLink.followRedirectUrl = redir;
    } else {
        newLink.followRedirectUrl = document.getElementById('link_followRedirectUrl').value.trim();
    }

    if (origId) {
        // Update
        const idx = siteData.links.findIndex(l => l.id === origId);
        newLink.priority = siteData.links[idx].priority;
        siteData.links[idx] = newLink;
    } else {
        // Add new
        newLink.priority = siteData.links.length + 1;
        siteData.links.push(newLink);
    }

    saveToLocal();
    renderLinks();
    els.linkModal.classList.add('hidden');
}

function duplicateLink(linkId) {
    const link = siteData.links.find(l => l.id === linkId);
    if (!link) return;
    
    const dup = JSON.parse(JSON.stringify(link));
    dup.id = dup.id + '-copy';
    dup.title = dup.title + ' (Copy)';
    dup.priority = siteData.links.length + 1;
    
    siteData.links.push(dup);
    saveToLocal();
    renderLinks();
    openLinkEditor(dup.id); // Open it immediately to edit
}

function confirmDeleteLink(linkId) {
    const link = siteData.links.find(l => l.id === linkId);
    if (!link) return;
    
    document.getElementById('delete-link-title').textContent = link.title || link.id;
    document.getElementById('delete-modal').dataset.id = link.id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

// Import data.js manually
function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const content = ev.target.result;
            const match = content.match(/window\.SITE_DATA\s*=\s*(\{[\s\S]*?\});/);
            if (match && match[1]) {
                const importedData = (new Function("return " + match[1]))();
                siteData = importedData;
                saveToLocal(); // autosave draft
                loadData(); // re-render
                els.saveStatus.textContent = 'Successfully imported data.js';
                els.saveStatus.style.color = 'var(--success)';
            } else {
                alert("Could not parse data.js. Ensure it starts with window.SITE_DATA = {");
            }
        } catch (err) {
            console.error(err);
            alert("Error parsing file.");
        }
    };
    reader.readAsText(file);
}

// Export Validation
function validateExport() {
    const errors = [];
    const ids = new Set();
    
    siteData.links.forEach(l => {
        if (!l.id) errors.push(`A link is missing an ID.`);
        if (ids.has(l.id)) errors.push(`Duplicate ID found: ${l.id}`);
        ids.add(l.id);
        
        if (!l.title) errors.push(`Link ${l.id} is missing a title.`);
        if (!l.thumbnail) errors.push(`Link ${l.id} is missing a thumbnail.`);
        
        if (l.type === 'prompt') {
            if (!l.promptText) errors.push(`Prompt Link ${l.id} is missing Prompt Text.`);
        } else {
            if (!l.followRedirectUrl) errors.push(`Normal Link ${l.id} is missing Redirect URL.`);
        }
    });

    return errors;
}

function handleSave() {
    const errors = validateExport();
    if (errors.length > 0) {
        const ul = document.getElementById('validation-errors');
        ul.innerHTML = '';
        errors.forEach(e => {
            const li = document.createElement('li');
            li.textContent = e;
            ul.appendChild(li);
        });
        document.getElementById('validation-modal').classList.remove('hidden');
    } else {
        doSave(false);
    }
}

function doSave(ignoreErrors) {
    document.getElementById('validation-modal').classList.add('hidden');
    const btn = document.getElementById('export-btn');
    const originalText = btn.textContent;

    btn.textContent = 'Saving...';
    btn.disabled = true;
    els.saveStatus.textContent = 'Downloading...';
    els.saveStatus.style.color = 'var(--text-muted)';

    try {
        // 1. Generate clean data.js string
        // We use JSON.stringify with 4 spaces for readability
        const dataJsContent = `// data.js - Automatically generated by SnapBlitz Admin Panel\n\nwindow.SITE_DATA = ${JSON.stringify(siteData, null, 4)};\n`;
        
        // 2. Fast direct download
        const dataBlob = new Blob([dataJsContent], { type: 'text/javascript' });
        const dataUrl = URL.createObjectURL(dataBlob);
        const aData = document.createElement('a');
        aData.href = dataUrl;
        aData.download = 'data.js';
        document.body.appendChild(aData);
        aData.click();
        document.body.removeChild(aData);
        URL.revokeObjectURL(dataUrl);

        els.saveStatus.textContent = 'Download Complete';
        els.saveStatus.style.color = 'var(--success)';
        
        // Reset status message after a bit
        setTimeout(() => {
            els.saveStatus.textContent = 'Ready';
            els.saveStatus.style.color = 'var(--text-muted)';
        }, 3000);
        
    } catch (err) {
        console.error(err);
        els.saveStatus.textContent = 'Save Failed';
        els.saveStatus.style.color = 'var(--danger)';
        alert("Failed to save. Check console for details.");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
