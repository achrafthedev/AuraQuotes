/* -------------------------------------------------------------
 * AuraQuotes Core Application Logic
 * State management, theme handling, history, canvas generation,
 * favorites syncing, speech synthesis, and animations.
 * ------------------------------------------------------------- */

// State Object
const state = {
    currentQuote: null,
    mode: 'local', // 'local' or 'online'
    category: 'all',
    theme: 'aurora',
    favorites: [],
    history: [],
    historyIndex: -1,
    isSpeaking: false
};

// Canvas Gradient Theme Colors (for PNG generator)
const canvasThemes = {
    aurora: { bgStart: '#0B0F19', bgEnd: '#111827', accent: '#10B981', textColor: '#F3F4F6' },
    sunset: { bgStart: '#1C0A15', bgEnd: '#1F0F19', accent: '#F43F5E', textColor: '#FFE4E6' },
    cosmic: { bgStart: '#0B081E', bgEnd: '#140F28', accent: '#8B5CF6', textColor: '#F3F0FF' },
    emerald: { bgStart: '#04140D', bgEnd: '#061C13', accent: '#059669', textColor: '#ECFDF5' },
    dark: { bgStart: '#0F172A', bgEnd: '#1E293B', accent: '#38BDF8', textColor: '#F8FAFC' },
    light: { bgStart: '#F8FAFC', bgEnd: '#E2E8F0', accent: '#0EA5E9', textColor: '#0F172A' }
};

// DOM Elements
const elements = {
    quoteCard: document.getElementById('quoteCard'),
    quoteText: document.getElementById('quoteText'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    quoteTag: document.getElementById('quoteTag'),
    cardLoader: document.getElementById('cardLoader'),
    btnGenerate: document.getElementById('generateQuote'),
    btnPrev: document.getElementById('prevQuote'),
    btnNext: document.getElementById('nextQuote'),
    btnVoice: document.getElementById('btnVoice'),
    btnCopy: document.getElementById('btnCopy'),
    btnShare: document.getElementById('btnShare'),
    btnDownload: document.getElementById('btnDownload'),
    btnLike: document.getElementById('btnLike'),
    modeLocal: document.getElementById('modeLocal'),
    modeOnline: document.getElementById('modeOnline'),
    categoriesNav: document.getElementById('categoriesNav'),
    themeTrigger: document.getElementById('themeDropdownTrigger'),
    themeMenu: document.getElementById('themeDropdownMenu'),
    openFavorites: document.getElementById('openFavorites'),
    closeFavorites: document.getElementById('closeFavorites'),
    favoritesDrawer: document.getElementById('favoritesDrawer'),
    drawerOverlay: document.getElementById('drawerOverlay'),
    favoritesList: document.getElementById('favoritesListContainer'),
    favCountBadge: document.getElementById('favCount'),
    favSearch: document.getElementById('favSearch'),
    toastContainer: document.getElementById('toastContainer'),
    quoteCanvas: document.getElementById('quoteCanvas')
};

// --- Toast System ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Custom Checkmark/Info SVGs
    const icon = type === 'success' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
        
    toast.innerHTML = `${icon}<span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    
    // Auto-remove toast after animation finishes
    toast.addEventListener('animationend', (e) => {
        if (e.animationName === 'toastOut') {
            toast.remove();
        }
    });
}

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('aura_theme') || 'aurora';
    setTheme(savedTheme);
    
    // Bind Theme Dropdown Clicks
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.getAttribute('data-val');
            setTheme(chosen);
            elements.themeMenu.classList.remove('show');
        });
    });
    
    // Toggle Menu on Trigger
    elements.themeTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.themeMenu.classList.toggle('show');
    });
    
    // Click outside closing menu
    document.addEventListener('click', () => {
        elements.themeMenu.classList.remove('show');
    });
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    state.theme = themeName;
    localStorage.setItem('aura_theme', themeName);
}

// --- Mode Toggle Management ---
function initModes() {
    elements.modeLocal.addEventListener('click', () => {
        if (state.mode !== 'local') {
            state.mode = 'local';
            elements.modeOnline.classList.remove('active');
            elements.modeLocal.classList.add('active');
            showToast('Switched to Premium Local Database (100% Offline)');
            // Clear history and fetch new
            state.history = [];
            state.historyIndex = -1;
            fetchQuote();
        }
    });
    
    elements.modeOnline.addEventListener('click', () => {
        if (state.mode !== 'online') {
            state.mode = 'online';
            elements.modeLocal.classList.remove('active');
            elements.modeOnline.classList.add('active');
            showToast('Switched to Live QuoteSlate API');
            // Clear history and fetch new
            state.history = [];
            state.historyIndex = -1;
            fetchQuote();
        }
    });
}

// --- Category Navigation ---
function initCategories() {
    elements.categoriesNav.addEventListener('click', (e) => {
        const pill = e.target.closest('.category-pill');
        if (!pill) return;
        
        // Update Active Class
        document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
        pill.classList.add('active');
        
        state.category = pill.getAttribute('data-category');
        showToast(`Category filtered: ${state.category}`);
        
        // Reset History and Load New Quote
        state.history = [];
        state.historyIndex = -1;
        fetchQuote();
    });
}

// --- Display Quote ---
function displayQuote(quoteObj) {
    state.currentQuote = quoteObj;
    
    // Animate Card Out & In
    elements.quoteCard.style.opacity = '0';
    elements.quoteCard.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        elements.quoteText.innerText = `“${quoteObj.text}”`;
        elements.quoteAuthor.innerText = quoteObj.author || 'Unknown';
        elements.quoteTag.innerText = quoteObj.tag || 'Inspiration';
        
        // Check Liked Status
        const isLiked = state.favorites.some(fav => fav.text === quoteObj.text);
        if (isLiked) {
            elements.btnLike.classList.add('liked');
            elements.btnLike.querySelector('span').innerText = 'Liked';
        } else {
            elements.btnLike.classList.remove('liked');
            elements.btnLike.querySelector('span').innerText = 'Like';
        }
        
        // Update Navigation Button States
        elements.btnPrev.disabled = state.historyIndex <= 0;
        elements.btnNext.disabled = false; // Next is always active, either browsing forward or fetching new
        
        // Speak Synth Reset
        stopSpeaking();
        
        // Fade Card In
        elements.quoteCard.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        elements.quoteCard.style.opacity = '1';
        elements.quoteCard.style.transform = 'translateY(0)';
    }, 200);
}

// --- Fetch Quote Logic ---
async function fetchQuote(browseForward = false) {
    // If browsing through history index
    if (browseForward && state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        displayQuote(state.history[state.historyIndex]);
        return;
    }

    setLoading(true);
    
    let newQuote = null;
    
    if (state.mode === 'online') {
        try {
            // Live Quote API: QuoteSlate API
            // Formulate Tag Filter if not 'all'
            let url = 'https://quoteslate.vercel.app/api/quotes/random';
            if (state.category !== 'all') {
                // Map local tag names to QuoteSlate tag categories if needed
                url += `?tags=${state.category.toLowerCase()}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('API fetch error');
            
            const data = await response.json();
            
            // Format QuoteSlate Schema
            newQuote = {
                text: data.quote,
                author: data.author,
                tag: state.category !== 'all' ? state.category : 'General'
            };
        } catch (error) {
            console.error('API Fetch Failed, falling back to local dataset.', error);
            showToast('Live API Down or Offline. Falling back to Local Collection.', 'error');
            newQuote = getRandomLocalQuote();
        }
    } else {
        // Local Mode
        newQuote = getRandomLocalQuote();
    }
    
    setLoading(false);
    
    if (newQuote) {
        // Add to history stack
        state.history.push(newQuote);
        state.historyIndex = state.history.length - 1;
        displayQuote(newQuote);
    }
}

// Helper to filter and grab random local quote
function getRandomLocalQuote() {
    let filtered = LOCAL_QUOTES;
    if (state.category !== 'all') {
        filtered = LOCAL_QUOTES.filter(q => q.tag.toLowerCase() === state.category.toLowerCase());
    }
    
    // Choose one that is not currently showing, if possible
    if (filtered.length > 1 && state.currentQuote) {
        filtered = filtered.filter(q => q.text !== state.currentQuote.text);
    }
    
    const idx = Math.floor(Math.random() * filtered.length);
    return filtered[idx];
}

function setLoading(isLoading) {
    if (isLoading) {
        elements.cardLoader.classList.add('active');
        elements.cardLoader.setAttribute('aria-hidden', 'false');
    } else {
        elements.cardLoader.classList.remove('active');
        elements.cardLoader.setAttribute('aria-hidden', 'true');
    }
}

// --- Text To Speech (TTS) ---
function toggleSpeech() {
    if (!('speechSynthesis' in window)) {
        showToast('Text-to-Speech is not supported by your browser.', 'error');
        return;
    }
    
    if (state.isSpeaking) {
        stopSpeaking();
    } else {
        startSpeaking();
    }
}

function startSpeaking() {
    if (!state.currentQuote) return;
    
    window.speechSynthesis.cancel(); // Reset active speaks
    
    const utter = new SpeechSynthesisUtterance(`${state.currentQuote.text} by ${state.currentQuote.author}`);
    
    // Optional: pick custom system voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utter.voice = enVoice;
    
    utter.rate = 0.95; // Slightly slower for dramatic effect
    utter.pitch = 1.0;
    
    utter.onstart = () => {
        state.isSpeaking = true;
        elements.btnVoice.classList.add('speaking');
        elements.btnVoice.querySelector('span').innerText = 'Pause';
    };
    
    utter.onend = () => {
        stopSpeaking();
    };
    
    utter.onerror = () => {
        stopSpeaking();
    };
    
    window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    elements.btnVoice.classList.remove('speaking');
    elements.btnVoice.querySelector('span').innerText = 'Listen';
}

// --- Copy & Share ---
function copyQuote() {
    if (!state.currentQuote) return;
    const shareText = `“${state.currentQuote.text}” - ${state.currentQuote.author}`;
    
    navigator.clipboard.writeText(shareText)
        .then(() => showToast('Quote copied to clipboard!'))
        .catch(err => {
            console.error('Failed to copy', err);
            showToast('Unable to copy quote.', 'error');
        });
}

function shareQuote() {
    if (!state.currentQuote) return;
    const text = `“${state.currentQuote.text}” - ${state.currentQuote.author} via AuraQuotes ✨`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// --- Canvas Quote Card PNG Generation ---
function generateQuoteCard() {
    if (!state.currentQuote) return;
    
    const canvas = elements.quoteCanvas;
    const ctx = canvas.getContext('2d');
    const activeTheme = canvasThemes[state.theme] || canvasThemes.aurora;
    
    // Draw Theme Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, activeTheme.bgStart);
    grad.addColorStop(1, activeTheme.bgEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);
    
    // Draw Elegant Border
    ctx.strokeStyle = activeTheme.accent;
    ctx.lineWidth = 15;
    ctx.strokeRect(40, 40, 1000, 1000);
    
    // Draw Quotation Mark Art
    ctx.font = 'italic 300px Georgia';
    ctx.fillStyle = activeTheme.accent;
    ctx.globalAlpha = 0.12;
    ctx.fillText('“', 100, 320);
    ctx.globalAlpha = 1.0;
    
    // Setup Font Specs
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = activeTheme.textColor;
    
    // Wrapped Quote Text
    const text = state.currentQuote.text;
    const maxTextWidth = 840;
    const fontSize = text.length > 120 ? 44 : 54;
    ctx.font = `italic ${fontSize}px Georgia`;
    
    const lines = wrapCanvasText(ctx, text, maxTextWidth);
    const lineHeight = fontSize * 1.4;
    const totalTextHeight = lines.length * lineHeight;
    let startY = (1080 / 2) - (totalTextHeight / 2) - 40;
    
    lines.forEach((line, idx) => {
        ctx.fillText(line, 540, startY + (idx * lineHeight));
    });
    
    // Draw Divider Line
    const dividerY = startY + (lines.length * lineHeight) + 40;
    ctx.beginPath();
    ctx.moveTo(490, dividerY);
    ctx.lineTo(590, dividerY);
    ctx.strokeStyle = activeTheme.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw Author Text
    const authorY = dividerY + 60;
    ctx.font = '600 32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = activeTheme.textColor;
    ctx.globalAlpha = 0.8;
    ctx.fillText(state.currentQuote.author.toUpperCase() || 'UNKNOWN', 540, authorY);
    
    // Draw Watermark
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = activeTheme.accent;
    ctx.globalAlpha = 0.5;
    ctx.fillText('AURAQUOTES • ACHRAFTHEDEV', 540, 980);
    ctx.globalAlpha = 1.0;
    
    // Export and trigger download
    try {
        const imgUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `auraquote-${state.currentQuote.author.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
        link.href = imgUrl;
        link.click();
        showToast('Quote card image downloaded successfully!');
    } catch (error) {
        console.error('Failed to export canvas', error);
        showToast('Unable to export image card.', 'error');
    }
}

// Helper: Wrap lines in canvas
function wrapCanvasText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
        let testLine = currentLine + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            lines.push(currentLine.trim());
            currentLine = words[i] + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());
    return lines;
}

// --- Favorites Drawer & Local Storage ---
function initFavorites() {
    // Load favorites from local storage
    const stored = localStorage.getItem('aura_favorites');
    if (stored) {
        state.favorites = JSON.parse(stored);
    }
    updateFavoritesUI();
    
    // Drawer open / close
    elements.openFavorites.addEventListener('click', () => {
        elements.favoritesDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent double scrollbars
        renderFavoritesList();
    });
    
    const closeDrawer = () => {
        elements.favoritesDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    
    elements.closeFavorites.addEventListener('click', closeDrawer);
    elements.drawerOverlay.addEventListener('click', closeDrawer);
    
    // Toggle Like button click
    elements.btnLike.addEventListener('click', () => {
        if (!state.currentQuote) return;
        
        const idx = state.favorites.findIndex(fav => fav.text === state.currentQuote.text);
        if (idx > -1) {
            // Unlike
            state.favorites.splice(idx, 1);
            elements.btnLike.classList.remove('liked');
            elements.btnLike.querySelector('span').innerText = 'Like';
            showToast('Removed from favorites.');
        } else {
            // Like
            state.favorites.push(state.currentQuote);
            elements.btnLike.classList.add('liked');
            elements.btnLike.querySelector('span').innerText = 'Liked';
            showToast('Saved to favorites!');
        }
        
        localStorage.setItem('aura_favorites', JSON.stringify(state.favorites));
        updateFavoritesUI();
    });
    
    // Search within Favorites drawer
    elements.favSearch.addEventListener('input', () => {
        renderFavoritesList();
    });
}

function updateFavoritesUI() {
    elements.favCountBadge.innerText = state.favorites.length;
}

function renderFavoritesList() {
    const q = elements.favSearch.value.trim().toLowerCase();
    
    // Filter favorites based on search query
    const filtered = state.favorites.filter(fav => 
        fav.text.toLowerCase().includes(q) || fav.author.toLowerCase().includes(q)
    );
    
    if (filtered.length === 0) {
        if (state.favorites.length === 0) {
            elements.favoritesList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    <p>No favorites saved yet. Click the "Like" button on a quote to save it here!</p>
                </div>`;
        } else {
            elements.favoritesList.innerHTML = `
                <div class="empty-state">
                    <p>No matching quotes found for your search.</p>
                </div>`;
        }
        return;
    }
    
    elements.favoritesList.innerHTML = '';
    
    filtered.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        
        // Favorite Item HTML
        item.innerHTML = `
            <div class="fav-text">“${fav.text}”</div>
            <div class="fav-footer">
                <div class="fav-author">— ${fav.author}</div>
                <div class="fav-actions">
                    <button class="fav-btn btn-copy-fav" title="Copy Text" aria-label="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                    <button class="fav-btn btn-del-fav" title="Delete Favorite" aria-label="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;
        
        // Load on Main Card click on body text
        item.addEventListener('click', (e) => {
            // Avoid clicks on copy/delete buttons
            if (e.target.closest('.fav-btn')) return;
            
            // Add quote to history
            state.history.push(fav);
            state.historyIndex = state.history.length - 1;
            displayQuote(fav);
            
            // Close drawer
            elements.favoritesDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
        
        // Bind Copy Favorite Click
        item.querySelector('.btn-copy-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(`“${fav.text}” - ${fav.author}`)
                .then(() => showToast('Copied to clipboard!'));
        });
        
        // Bind Delete Favorite Click
        item.querySelector('.btn-del-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove from array
            const idx = state.favorites.findIndex(f => f.text === fav.text);
            if (idx > -1) {
                state.favorites.splice(idx, 1);
                localStorage.setItem('aura_favorites', JSON.stringify(state.favorites));
                updateFavoritesUI();
                
                // Animate item slide out
                item.style.animation = 'toastOut 0.25s ease forwards';
                item.addEventListener('animationend', () => {
                    renderFavoritesList();
                    // Update main card like button if currently viewing deleted
                    if (state.currentQuote && state.currentQuote.text === fav.text) {
                        elements.btnLike.classList.remove('liked');
                        elements.btnLike.querySelector('span').innerText = 'Like';
                    }
                });
                showToast('Removed from favorites.');
            }
        });
        
        elements.favoritesList.appendChild(item);
    });
}

// --- History Navigation Handling ---
function initHistoryNav() {
    elements.btnPrev.addEventListener('click', () => {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            displayQuote(state.history[state.historyIndex]);
        }
    });
    
    elements.btnNext.addEventListener('click', () => {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            displayQuote(state.history[state.historyIndex]);
        } else {
            // End of history stack, fetch a fresh quote
            fetchQuote(false);
        }
    });
}

// --- Application Init ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme Engine
    initTheme();
    
    // 2. Initialize Mode Toggles
    initModes();
    
    // 3. Initialize Tag Categories
    initCategories();
    
    // 4. Initialize History Navigation
    initHistoryNav();
    
    // 5. Initialize Favorites Drawer
    initFavorites();
    
    // 6. Bind Main Utility Actions
    elements.btnGenerate.addEventListener('click', () => fetchQuote(false));
    elements.btnVoice.addEventListener('click', toggleSpeech);
    elements.btnCopy.addEventListener('click', copyQuote);
    elements.btnShare.addEventListener('click', shareQuote);
    elements.btnDownload.addEventListener('click', generateQuoteCard);
    
    // 7. Load Initial Random Quote
    fetchQuote(false);
});

// Cancel active voices if page is closed/reloaded
window.addEventListener('beforeunload', stopSpeaking);
window.addEventListener('pagehide', stopSpeaking);
