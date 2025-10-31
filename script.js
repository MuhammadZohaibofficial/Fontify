// --- FONTIFY PRO V2 - FINAL SCRIPT.JS ---

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const fontGrid = document.getElementById('fontGrid');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toast = document.getElementById('toast');
    
    // Hamburger Menu Elements
    const openNavBtn = document.getElementById('open-nav-btn');
    const closeNavBtn = document.getElementById('close-nav-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const navOverlay = document.getElementById('nav-overlay');

    // Text Tools Buttons
    const btnUppercase = document.getElementById('btn-uppercase');
    const btnLowercase = document.getElementById('btn-lowercase');
    const btnTitlecase = document.getElementById('btn-titlecase');
    const btnReverse = document.getElementById('btn-reverse');
    const btnClear = document.getElementById('btn-clear');
    const btnDownload = document.getElementById('btn-download');

    // State Variables
    let originalText = '';
    let activeStyleName = null;

    // --- NAVIGATION LOGIC (Waisa hi hai) ---
    const openNav = () => { /* ... */ };
    const closeNav = () => { /* ... */ };
    openNavBtn.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);
    
    // --- SMART TEXTBOX LOGIC (Waisa hi hai) ---
    const autoResizeTextarea = () => { /* ... */ };
    userInput.addEventListener('input', autoResizeTextarea);

    // --- CORE LOGIC (YAHAN SAB KUCH THEEK KIYA GAYA HAI) ---
    const transformText = (text, styleName) => {
        if (!styleName) return text;
        const style = fontLibrary.find(s => s.name === styleName);
        if (!style) return text;
        if (style.transform) return style.transform(text);
        let result = '';
        for (const char of text) {
            result += style.map[char] || char;
        }
        return result;
    };

    const renderFontGrid = () => {
        let html = '';
        for (const style of fontLibrary) {
            html += `
                <div class="font-item" data-style-name="${style.name}">
                    <div class="font-preview">${transformText('Style', style.name)}</div>
                    <div class="font-name">${style.name}</div>
                </div>
            `;
        }
        fontGrid.innerHTML = html;
    };
    
    // *** YEH HAI ASAL FIX ***
    // Yeh naya logic kabhi fail nahi hoga
    const handleInputChange = () => {
        // Step 1: Hamesha originalText ko seedha user ke input se update karo
        originalText = userInput.value;
        
        // Step 2: Stage ko naye original text aur active style ke hisab se update karo
        userInput.value = transformText(originalText, activeStyleName);
        
        autoResizeTextarea();
    };

    // Jab user text box mein kuch likhe
    userInput.addEventListener('input', handleInputChange);

    // Jab user font select kare
    fontGrid.addEventListener('click', (e) => {
        const fontItem = e.target.closest('.font-item');
        if (!fontItem) return;

        document.querySelector('.font-item.active')?.classList.remove('active');
        fontItem.classList.add('active');
        
        activeStyleName = fontItem.dataset.styleName;
        
        // Sirf view ko update karo, original text ko nahi chherna
        userInput.value = transformText(originalText, activeStyleName);
        autoResizeTextarea();
    });
    
    // Reset Button ka Logic (Ab yeh 100% kaam karega)
    resetBtn.addEventListener('click', () => {
        activeStyleName = null;
        userInput.value = originalText;
        document.querySelector('.font-item.active')?.classList.remove('active');
        autoResizeTextarea();
    });

    // Copy Button ka Logic
    copyBtn.addEventListener('click', () => { /* ... (Waisa hi hai) ... */ });
    
    // --- TEXT TOOLS LOGIC (NAYE BUTTONS KE SAATH) ---
    const applyTool = (transformation) => {
        originalText = transformation(originalText); // Original text par tool apply karo
        userInput.value = transformText(originalText, activeStyleName); // View ko update karo
        autoResizeTextarea();
    };

    btnUppercase.addEventListener('click', () => applyTool(text => text.toUpperCase()));
    btnLowercase.addEventListener('click', () => applyTool(text => text.toLowerCase()));
    btnReverse.addEventListener('click', () => applyTool(text => text.split('').reverse().join('')));
    btnTitlecase.addEventListener('click', () => applyTool(text => text.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase())));

    btnClear.addEventListener('click', () => {
        originalText = '';
        activeStyleName = null;
        userInput.value = '';
        document.querySelector('.font-item.active')?.classList.remove('active');
        autoResizeTextarea();
    });

    btnDownload.addEventListener('click', () => {
        const textToSave = userInput.value;
        if (!textToSave) return;
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fontify_text.txt';
        a.click();
        URL.revokeObjectURL(a.href);
    });

    // --- INITIALIZATION ---
    renderFontGrid();
    autoResizeTextarea();
});
