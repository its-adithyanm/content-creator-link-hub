/**
 * SnapBlitz Link Hub - Application Logic
 */

(function() {
    'use strict';

    let fuse = null;
    let currentLinks = [];
    let searchDebounceTimer = null;
    const DEBOUNCE_DELAY = 150;

    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const resultsHeader = document.getElementById('resultsHeader');
    const resultsCount = document.getElementById('resultsCount');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalCta = document.getElementById('modalCta');
    const modalVisitProfile = document.getElementById('modalVisitProfile');
    const modalFollowRedirect = document.getElementById('modalFollowRedirect');
    const footerModalOverlay = document.getElementById('footerModalOverlay');
    const footerModalClose = document.getElementById('footerModalClose');
    const footerModalTitle = document.getElementById('footerModalTitle');
    const footerModalContent = document.getElementById('footerModalContent');
    const copyrightBtn = document.getElementById('copyrightBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    const disclaimerBtn = document.getElementById('disclaimerBtn');
    const helpButton = document.getElementById('helpButton');
    const siteTitle = document.getElementById('siteTitle');
    const profilePhoto = document.getElementById('profilePhoto');
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
        hideResults();
    }

    function applySiteConfig() {
        const { siteTitle: title, helpFormUrl, theme, profilePhotoUrl, socialMedia } = window.SITE_DATA;

        if (title) {
            siteTitle.textContent = title;
            document.title = title;
        }

        if (profilePhotoUrl) {
            profilePhoto.src = profilePhotoUrl;
            profilePhoto.style.display = 'block';
        } else {
            profilePhoto.style.display = 'none';
        }

        if (socialMedia) {
            setupSocialLinks(socialMedia);
        }

        if (helpFormUrl) {
            helpButton.addEventListener('click', () => {
                window.open(helpFormUrl, '_blank', 'noopener,noreferrer');
            });
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
        searchInput.addEventListener('input', handleSearch);
        clearBtn.addEventListener('click', clearSearch);
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', handleOverlayClick);
        footerModalClose.addEventListener('click', closeFooterModal);
        footerModalOverlay.addEventListener('click', handleFooterOverlayClick);
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
            return;
        }

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
                return (
                    link.title.toLowerCase().includes(lowerQuery) ||
                    link.description.toLowerCase().includes(lowerQuery) ||
                    link.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
                );
            });
        }

        const maxResults = window.SITE_DATA.maxResults || 50;
        results = results.slice(0, maxResults);
        
        renderResults(results, query);
    }

    function renderResults(results, query = '') {
        resultsGrid.innerHTML = '';

        if (results.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();
        showResults();
        showResultsHeader(results.length);

        results.forEach((item, index) => {
            const card = createResultCard(item, query, index);
            resultsGrid.appendChild(card);
        });
    }

    function createResultCard(item, query, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const highlightedTitle = highlightMatches(item.title, item.matches, 'title');
        const highlightedDescription = highlightMatches(item.description, item.matches, 'description');
        const buttonText = item.buttonText || window.SITE_DATA.defaultButtonText || 'Get Link';

        // NO KEYWORDS DISPLAYED
        card.innerHTML = `
            <div class="card-header">
                ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" class="card-thumbnail" loading="lazy">` : ''}
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

        card.addEventListener('click', () => openModal(item));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(item);
            }
        });

        return card;
    }

    function highlightMatches(text, matches, key) {
        if (!matches || !text) return text;

        const relevantMatches = matches.filter(m => m.key === key);
        if (relevantMatches.length === 0) return text;

        const highlights = new Set();
        relevantMatches.forEach(match => {
            match.indices.forEach(([start, end]) => {
                for (let i = start; i <= end; i++) {
                    highlights.add(i);
                }
            });
        });

        let result = '';
        let inMark = false;
        for (let i = 0; i < text.length; i++) {
            const shouldHighlight = highlights.has(i);
            if (shouldHighlight && !inMark) {
                result += '<mark>';
                inMark = true;
            } else if (!shouldHighlight && inMark) {
                result += '</mark>';
                inMark = false;
            }
            result += text[i];
        }
        if (inMark) result += '</mark>';

        return result;
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

    function openModal(item) {
        modalTitle.textContent = item.modalTitle || 'Follow to Continue';
        modalCta.textContent = item.ctaText || 'Follow @snap_blitz to access this resource';

        const profileUrl = item.visitProfileUrl || window.SITE_DATA.profileUrl;
        modalVisitProfile.href = profileUrl;
        modalFollowRedirect.href = item.followRedirectUrl;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleOverlayClick(e) {
        if (e.target === modalOverlay) closeModal();
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) closeModal();
            if (footerModalOverlay.classList.contains('active')) closeFooterModal();
        }
    }

    function clearSearch() {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        hideResults();
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
            const response = await fetch(file);
            const content = await response.text();
            footerModalContent.innerHTML = content;
        } catch (error) {
            footerModalContent.innerHTML = '<p>Content not available.</p>';
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
