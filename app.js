/**
 * SnapBlitz Link Hub - Application Logic
 */

(function() {
    'use strict';

    let fuse = null;
    let currentLinks = [];
    let currentRenderedResults = [];
    let currentLatestResults = [];
    let searchDebounceTimer = null;
    const DEBOUNCE_DELAY = 150;

    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const resultsHeader = document.getElementById('resultsHeader');
    const resultsCount = document.getElementById('resultsCount');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const latestContainer = document.getElementById('latestContainer');
    const latestGrid = document.getElementById('latestGrid');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalCta = document.getElementById('modalCta');
    const modalVisitProfile = document.getElementById('modalVisitProfile');
    const modalFollowRedirect = document.getElementById('modalFollowRedirect');
    const followActionState = document.getElementById('followActionState');
    const followLoadingState = document.getElementById('followLoadingState');
    const followSuccessState = document.getElementById('followSuccessState');
    const followErrorState = document.getElementById('followErrorState');
    const followRetryBtn = document.getElementById('followRetryBtn');
    const footerModalOverlay = document.getElementById('footerModalOverlay');
    const footerModalClose = document.getElementById('footerModalClose');
    const footerModalTitle = document.getElementById('footerModalTitle');
    const footerModalContent = document.getElementById('footerModalContent');
    const copyrightBtn = document.getElementById('copyrightBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    const disclaimerBtn = document.getElementById('disclaimerBtn');
    const helpButton = document.getElementById('helpButton');
    const promptModalOverlay = document.getElementById('promptModalOverlay');
    const promptModalClose = document.getElementById('promptModalClose');
    const promptModalTitle = document.getElementById('promptModalTitle');
    const promptModalText = document.getElementById('promptModalText');
    const promptModalCopy = document.getElementById('promptModalCopy');
    const promptModalCopyText = document.getElementById('promptModalCopyText');
    const embedModalOverlay = document.getElementById('embedModalOverlay');
    const embedModalClose = document.getElementById('embedModalClose');
    const embedModalTitle = document.getElementById('embedModalTitle');
    const embedModalIframe = document.getElementById('embedModalIframe');
    const embedModalActions = document.getElementById('embedModalActions');
    const supportModalOverlay = document.getElementById('supportModalOverlay');
    const supportModalClose = document.getElementById('supportModalClose');
    const supportForm = document.getElementById('supportForm');
    const supportFormState = document.getElementById('supportFormState');
    const supportLoadingState = document.getElementById('supportLoadingState');
    const supportSuccessState = document.getElementById('supportSuccessState');
    const supportErrorState = document.getElementById('supportErrorState');
    const supportSuccessCloseBtn = document.getElementById('supportSuccessCloseBtn');
    const supportErrorCloseBtn = document.getElementById('supportErrorCloseBtn');
    const supportRetryBtn = document.getElementById('supportRetryBtn');
    const siteTitle = document.getElementById('siteTitle');
    const socialIcons = document.getElementById('socialIcons');

    function init() {
        if (!window.SITE_DATA) {
            console.error('SITE_DATA not found');
            return;
        }

        applySiteConfig();
        currentLinks = window.SITE_DATA.links
            .filter(link => link.visible !== false)
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        initializeFuse();
        setupEventListeners();
        renderLatestLinks();
        hideResults();
    }

    function applySiteConfig() {
        const { siteTitle: title, theme, socialMedia } = window.SITE_DATA;

        if (title) {
            siteTitle.textContent = title;
            document.title = title;
        }

        if (socialMedia) {
            setupSocialLinks(socialMedia);
        }

        // Help button opens custom modal instead of redirecting
        if (helpButton) {
            helpButton.addEventListener('click', openSupportModal);
        }

        if (theme) {
            applyTheme(theme);
        }
    }

    function setupSocialLinks(socialMedia) {
        const links = {
            instagram: document.getElementById('instagramLink'),
            facebook: document.getElementById('facebookLink'),
            linkedin: document.getElementById('linkedinLink'),
            youtube: document.getElementById('youtubeLink'),
            telegram: document.getElementById('telegramLink')
        };

        for (const [platform, link] of Object.entries(links)) {
            if (socialMedia[platform]) {
                link.href = socialMedia[platform];
                link.style.display = 'inline-flex';
            } else {
                link.style.display = 'none';
            }
        }
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme.backgroundPrimary) root.style.setProperty('--bg-primary', theme.backgroundPrimary);
        if (theme.accentPrimary) root.style.setProperty('--accent-primary', theme.accentPrimary);
        if (theme.accentSecondary) root.style.setProperty('--accent-secondary', theme.accentSecondary);
    }

    function initializeFuse() {
        const fuseOptions = {
            keys: [
                { name: 'title', weight: 0.4 },
                { name: 'keywords', weight: 0.35 },
                { name: 'description', weight: 0.25 }
            ],
            threshold: 0.4,
            includeMatches: true,
            minMatchCharLength: 1,
            ignoreLocation: true
        };

        if (window.Fuse) {
            fuse = new Fuse(currentLinks, fuseOptions);
        }
    }

    function setupEventListeners() {
        resultsGrid.addEventListener('click', handleGridClick);
        resultsGrid.addEventListener('keydown', handleGridKeydown);
        if (latestGrid) {
            latestGrid.addEventListener('click', handleLatestGridClick);
            latestGrid.addEventListener('keydown', handleLatestGridKeydown);
        }
        searchInput.addEventListener('input', handleSearch);
        clearBtn.addEventListener('click', clearSearch);
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', handleOverlayClick);
        footerModalClose.addEventListener('click', closeFooterModal);
        footerModalOverlay.addEventListener('click', handleFooterOverlayClick);
        if (promptModalClose) promptModalClose.addEventListener('click', closePromptModal);
        if (promptModalOverlay) promptModalOverlay.addEventListener('click', handlePromptOverlayClick);
        if (embedModalClose) embedModalClose.addEventListener('click', closeEmbedModal);
        if (embedModalOverlay) embedModalOverlay.addEventListener('click', handleEmbedOverlayClick);
        if (supportModalClose) supportModalClose.addEventListener('click', closeSupportModal);
        if (supportModalOverlay) supportModalOverlay.addEventListener('click', handleSupportOverlayClick);
        if (supportForm) supportForm.addEventListener('submit', handleSupportFormSubmit);
        if (supportSuccessCloseBtn) supportSuccessCloseBtn.addEventListener('click', closeSupportModal);
        if (supportErrorCloseBtn) supportErrorCloseBtn.addEventListener('click', closeSupportModal);
        if (supportRetryBtn) supportRetryBtn.addEventListener('click', () => showSupportState('form'));
        if (followRetryBtn) followRetryBtn.addEventListener('click', () => showFollowState('action'));
        document.addEventListener('keydown', handleEscapeKey);

        copyrightBtn.addEventListener('click', () => openFooterModal('copyright'));
        privacyBtn.addEventListener('click', () => openFooterModal('privacy'));
        disclaimerBtn.addEventListener('click', () => openFooterModal('disclaimer'));
    }

    function handleSearch(e) {
        const query = e.target.value.trim();
        clearBtn.classList.toggle('visible', query.length > 0);

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => performSearch(query), DEBOUNCE_DELAY);
    }

    function performSearch(query) {
        if (!query) {
            hideResults();
            if (latestContainer) latestContainer.style.display = 'block';
            return;
        }

        if (latestContainer) latestContainer.style.display = 'none';

        let results = [];

        if (fuse) {
            const fuseResults = fuse.search(query);
            results = fuseResults.map(result => ({
                ...result.item,
                matches: result.matches
            }));
        } else {
            const lowerQuery = query.toLowerCase();
            results = currentLinks.filter(link => {
                const titleMatch = link.title ? link.title.toLowerCase().includes(lowerQuery) : false;
                const descMatch = link.description ? link.description.toLowerCase().includes(lowerQuery) : false;
                const kwMatch = link.keywords && Array.isArray(link.keywords) ? link.keywords.some(kw => kw.toLowerCase().includes(lowerQuery)) : false;
                return titleMatch || descMatch || kwMatch;
            });
        }

        const maxResults = window.SITE_DATA.maxResults || 50;
        results = results.slice(0, maxResults);
        
        renderResults(results, query);
    }

    function renderResults(results, query = '') {
        resultsGrid.innerHTML = '';
        currentRenderedResults = results;

        if (results.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();
        showResults();
        showResultsHeader(results.length);

        const fragment = document.createDocumentFragment();
        results.forEach((item, index) => {
            try {
                const card = createResultCard(item, query, index);
                if (card) fragment.appendChild(card);
            } catch (err) {
                console.error("Error rendering card:", item, err);
            }
        });
        resultsGrid.appendChild(fragment);
    }

    function createResultCard(item, query, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        // Cap animation delay to prevent CPU spike on large lists
        card.style.animationDelay = `${Math.min(index, 20) * 0.05}s`;
        card.dataset.index = index;

        const highlightedTitle = highlightMatches(item.title || 'Untitled', item.matches, 'title');
        const highlightedDescription = highlightMatches(item.description || '', item.matches, 'description');
        const buttonText = item.buttonText || window.SITE_DATA.defaultButtonText || 'Get Link';

        // NO KEYWORDS DISPLAYED
        card.innerHTML = `
            <div class="card-header">
                <img src="${item.thumbnail || ''}" alt="" class="card-thumbnail" loading="lazy">
                <h3 class="card-title">${highlightedTitle}</h3>
            </div>
            <p class="card-description">${highlightedDescription}</p>
            <div class="card-action">
                <button class="action-btn">
                    ${buttonText}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        `;

        return card;
    }

    function handleGridClick(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const card = btn.closest('.result-card');
        if (!card) return;
        const index = parseInt(card.dataset.index, 10);
        const item = currentRenderedResults[index];
        if (item) openModal(item);
    }

    function handleGridKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;
            const card = btn.closest('.result-card');
            if (!card) return;
            e.preventDefault();
            const index = parseInt(card.dataset.index, 10);
            const item = currentRenderedResults[index];
            if (item) openModal(item);
        }
    }

    function renderLatestLinks() {
        if (!latestGrid || !latestContainer) return;
        latestGrid.innerHTML = '';
        
        currentLatestResults = window.SITE_DATA.links
            .filter(link => link.visible !== false)
            .reverse()
            .slice(0, 6);

        if (currentLatestResults.length === 0) {
            latestContainer.style.display = 'none';
            return;
        }

        latestContainer.style.display = 'block';

        const fragment = document.createDocumentFragment();
        currentLatestResults.forEach((item, index) => {
            try {
                const card = createResultCard(item, '', index);
                if (card) fragment.appendChild(card);
            } catch (err) {
                console.error("Error rendering latest card:", item, err);
            }
        });
        latestGrid.appendChild(fragment);
    }

    function handleLatestGridClick(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const card = btn.closest('.result-card');
        if (!card) return;
        const index = parseInt(card.dataset.index, 10);
        const item = currentLatestResults[index];
        if (item) openModal(item);
    }

    function handleLatestGridKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;
            const card = btn.closest('.result-card');
            if (!card) return;
            e.preventDefault();
            const index = parseInt(card.dataset.index, 10);
            const item = currentLatestResults[index];
            if (item) openModal(item);
        }
    }

    function highlightMatches(text, matches, key) {
        return text || '';
    }

    function showNoResults() {
        resultsHeader.style.display = 'none';
        resultsGrid.style.display = 'none';
        noResults.style.display = 'block';
        resultsContainer.style.display = 'block';
    }

    function hideNoResults() {
        noResults.style.display = 'none';
        resultsGrid.style.display = 'grid';
    }

    function showResults() {
        resultsContainer.style.display = 'block';
    }

    function hideResults() {
        resultsContainer.style.display = 'none';
        resultsHeader.style.display = 'none';
    }

    function showResultsHeader(count) {
        resultsHeader.style.display = 'block';
        resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''}`;
    }

    function showFollowState(state) {
        if (!followActionState) return;

        followActionState.style.display = 'none';
        followLoadingState.style.display = 'none';
        followSuccessState.style.display = 'none';
        followErrorState.style.display = 'none';

        followActionState.classList.remove('active');
        followLoadingState.classList.remove('active');
        followSuccessState.classList.remove('active');
        followErrorState.classList.remove('active');

        if (state === 'action') {
            followActionState.style.display = 'block';
            setTimeout(() => followActionState.classList.add('active'), 10);
        } else if (state === 'loading') {
            followLoadingState.style.display = 'block';
            setTimeout(() => followLoadingState.classList.add('active'), 10);
        } else if (state === 'success') {
            followSuccessState.style.display = 'block';
            setTimeout(() => followSuccessState.classList.add('active'), 10);
        } else if (state === 'error') {
            followErrorState.style.display = 'block';
            setTimeout(() => followErrorState.classList.add('active'), 10);
        }
    }

    function openModal(item) {
        if (isVerifyingFollow) return;
        
        modalTitle.textContent = item.modalTitle || 'Follow to Continue';
        modalCta.textContent = item.ctaText || 'Follow @snap_blitz to access this resource';

        const profileUrl = item.visitProfileUrl || window.SITE_DATA.profileUrl;
        modalVisitProfile.href = profileUrl;

        showFollowState('action');

        modalFollowRedirect.onclick = function(e) {
            e.preventDefault();
            startFollowVerification(item);
        };

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function startFollowVerification(item) {
        if (isVerifyingFollow) return;
        
        isVerifyingFollow = true;
        modalClose.style.pointerEvents = 'none';
        modalClose.style.opacity = '0.5';

        showFollowState('loading');

        setTimeout(() => {
            const redirectUrl = (item.type === 'prompt' || item.type === 'embed') ? '#' : (item.followRedirectUrl || null);

            if (!redirectUrl && item.type !== 'prompt' && item.type !== 'embed') {
                showFollowState('error');
                isVerifyingFollow = false;
                modalClose.style.pointerEvents = 'all';
                modalClose.style.opacity = '1';
                return;
            }

            showFollowState('success');

            setTimeout(() => {
                isVerifyingFollow = false;
                modalClose.style.pointerEvents = 'all';
                modalClose.style.opacity = '1';

                if (item.type === 'prompt') {
                    closeModal();
                    openPromptModal(item);
                } else if (item.type === 'embed') {
                    closeModal();
                    openEmbedModal(item);
                } else {
                    window.location.href = redirectUrl;
                }
            }, 1000); 
        }, 3000); 
    }

    function closeModal() {
        if (isVerifyingFollow) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!modalOverlay.classList.contains('active')) {
                showFollowState('action');
            }
        }, 300);
    }

    function handleOverlayClick(e) {
        if (e.target === modalOverlay && !isVerifyingFollow) closeModal();
    }

    let isSubmittingSupport = false;
    let isVerifyingFollow = false;

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active') && !isVerifyingFollow) closeModal();
            if (footerModalOverlay.classList.contains('active')) closeFooterModal();
            if (promptModalOverlay && promptModalOverlay.classList.contains('active')) closePromptModal();
            if (embedModalOverlay && embedModalOverlay.classList.contains('active')) closeEmbedModal();
            if (supportModalOverlay && supportModalOverlay.classList.contains('active') && !isSubmittingSupport) closeSupportModal();
        }
    }

    function showSupportState(state) {
        if (!supportFormState) return;
        
        supportFormState.style.display = 'none';
        supportLoadingState.style.display = 'none';
        supportSuccessState.style.display = 'none';
        supportErrorState.style.display = 'none';

        supportFormState.classList.remove('active');
        supportLoadingState.classList.remove('active');
        supportSuccessState.classList.remove('active');
        supportErrorState.classList.remove('active');

        if (state === 'form') {
            supportFormState.style.display = 'block';
            setTimeout(() => supportFormState.classList.add('active'), 10);
        } else if (state === 'loading') {
            supportLoadingState.style.display = 'block';
            setTimeout(() => supportLoadingState.classList.add('active'), 10);
        } else if (state === 'success') {
            supportSuccessState.style.display = 'block';
            setTimeout(() => supportSuccessState.classList.add('active'), 10);
        } else if (state === 'error') {
            supportErrorState.style.display = 'block';
            setTimeout(() => supportErrorState.classList.add('active'), 10);
        }
    }

    function openSupportModal() {
        if (!supportModalOverlay || isSubmittingSupport) return;
        supportForm.reset();
        showSupportState('form');
        supportModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSupportModal() {
        if (!supportModalOverlay || isSubmittingSupport) return;
        supportModalOverlay.classList.remove('active');
        if (!modalOverlay.classList.contains('active') && !footerModalOverlay.classList.contains('active') && (!promptModalOverlay || !promptModalOverlay.classList.contains('active'))) {
            document.body.style.overflow = '';
        }
        // Reset after animation
        setTimeout(() => {
            if (!supportModalOverlay.classList.contains('active')) {
                showSupportState('form');
                supportForm.reset();
            }
        }, 300);
    }

    function handleSupportOverlayClick(e) {
        if (e.target === supportModalOverlay && !isSubmittingSupport) closeSupportModal();
    }

    async function handleSupportFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        
        if (!form.checkValidity() || isSubmittingSupport) {
            form.reportValidity();
            return;
        }

        isSubmittingSupport = true;
        supportModalClose.style.pointerEvents = 'none';
        supportModalClose.style.opacity = '0.5';
        
        showSupportState('loading');

        const formData = new FormData(form);
        const actionUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdQububJJjHQb0NKP2LKUfElITS9DmoUzdzwkGXJ-c1NEffmQ/formResponse';
        
        try {
            // Minimum 1 second loading time for UX + actual fetch
            await Promise.all([
                fetch(actionUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);

            showSupportState('success');
        } catch (error) {
            console.error('Error submitting form:', error);
            showSupportState('error');
        } finally {
            isSubmittingSupport = false;
            supportModalClose.style.pointerEvents = 'all';
            supportModalClose.style.opacity = '1';
        }
    }

    function openPromptModal(item) {
        if (!promptModalOverlay) return;
        
        promptModalTitle.textContent = item.title || 'AI Prompt';
        promptModalText.textContent = item.promptText;

        promptModalCopy.onclick = () => {
            navigator.clipboard.writeText(item.promptText).then(() => {
                promptModalCopyText.textContent = 'Copied!';
                promptModalCopy.style.background = '#10b981';
                promptModalCopy.style.borderColor = '#10b981';
                setTimeout(() => {
                    promptModalCopyText.textContent = 'Copy Prompt';
                    promptModalCopy.style.background = '';
                    promptModalCopy.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        };

        promptModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePromptModal() {
        if (!promptModalOverlay) return;
        promptModalOverlay.classList.remove('active');
        if (!modalOverlay.classList.contains('active') && !footerModalOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    function handlePromptOverlayClick(e) {
        if (e.target === promptModalOverlay) closePromptModal();
    }

    function openEmbedModal(item) {
        if (!embedModalOverlay) return;
        
        embedModalTitle.textContent = item.embedTitle || item.title || 'Tutorial';
        embedModalIframe.src = formatYoutubeUrl(item.youtubeEmbedUrl);
        
        embedModalActions.innerHTML = '';
        if (item.actionButtons && Array.isArray(item.actionButtons)) {
            item.actionButtons.forEach(btnData => {
                if (!btnData.text || !btnData.url) return;
                const a = document.createElement('a');
                a.className = 'btn btn-primary';
                a.style.width = '100%';
                a.href = btnData.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = btnData.text;
                embedModalActions.appendChild(a);
            });
        }

        embedModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function formatYoutubeUrl(url) {
        if (!url) return '';
        
        let processedUrl = url.trim();
        if (processedUrl.toLowerCase().startsWith('<iframe')) {
            const srcMatch = processedUrl.match(/src=["'](.*?)["']/);
            if (srcMatch && srcMatch[1]) {
                processedUrl = srcMatch[1];
            } else {
                return '';
            }
        }

        let videoId = '';
        if (processedUrl.includes('youtu.be/')) {
            videoId = processedUrl.split('youtu.be/')[1].split('?')[0];
        } else if (processedUrl.includes('youtube.com/watch?v=')) {
            videoId = processedUrl.split('v=')[1].split('&')[0];
        } else if (processedUrl.includes('youtube.com/embed/')) {
            return processedUrl;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : processedUrl;
    }

    function closeEmbedModal() {
        if (!embedModalOverlay) return;
        embedModalOverlay.classList.remove('active');
        embedModalIframe.src = '';
        if (!modalOverlay.classList.contains('active') && !footerModalOverlay.classList.contains('active') && !promptModalOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    function handleEmbedOverlayClick(e) {
        if (e.target === embedModalOverlay) closeEmbedModal();
    }

    function clearSearch() {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        hideResults();
        if (latestContainer) latestContainer.style.display = 'block';
        searchInput.focus();
    }

    async function openFooterModal(type) {
        let title = '';
        let file = '';

        switch(type) {
            case 'copyright':
                title = 'Copyright';
                file = 'copyright.html';
                break;
            case 'privacy':
                title = 'Privacy Policy';
                file = 'privacy.html';
                break;
            case 'disclaimer':
                title = 'Disclaimer';
                file = 'disclaimer.html';
                break;
        }

        footerModalTitle.textContent = title;
        
        try {
            const response = await fetch(`./${file}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlText = await response.text();
            
            // Extract ONLY the body content to prevent injecting <html> and <head> tags
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const bodyContent = doc.body.innerHTML || htmlText;
            
            footerModalContent.innerHTML = bodyContent;
        } catch (error) {
            console.error(`Error loading footer content (${file}):`, error);
            
            // Check if it's likely a local file protocol issue
            const isLocal = window.location.protocol === 'file:';
            
            footerModalContent.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); margin-bottom: 1rem;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">Unable to load content.</p>
                    ${isLocal ? `<p style="font-size: 0.85rem; color: var(--text-muted);">Local file fetching is blocked by your browser. Please run the site via a local server (e.g. VS Code Live Server).</p>` : ''}
                </div>
            `;
        }

        footerModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFooterModal() {
        footerModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleFooterOverlayClick(e) {
        if (e.target === footerModalOverlay) closeFooterModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
