// --- FONTIFY PRO V2 - SCRIPT.JS ---

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

    // State Variables
    let originalText = '';
    let activeStyleName = null;

    // --- NAVIGATION DRAWER (HAMBURGER MENU) LOGIC ---
    const openNav = () => {
        navDrawer.classList.add('open');
        navOverlay.classList.add('visible');
    };
    const closeNav = () => {
        navDrawer.classList.remove('open');
        navOverlay.classList.remove('visible');
    };
    openNavBtn.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);

    // --- SMART TEXTBOX (AUTO-RESIZE) ---
    const autoResizeTextarea = () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    };
    userInput.addEventListener('input', autoResizeTextarea);

    // --- CORE TEXT TRANSFORMATION ---
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

    // --- 3-ROW FONT GRID RENDERING ---
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

    // --- STAGE UPDATE LOGIC ---
    const updateStage = () => {
        userInput.value = transformText(originalText, activeStyleName);
        autoResizeTextarea();
    };

    // --- EVENT LISTENERS ---
    userInput.addEventListener('input', () => {
        originalText = userInput.value;
        if (activeStyleName) {
            updateStage();
        }
    });

    fontGrid.addEventListener('click', (e) => {
        const fontItem = e.target.closest('.font-item');
        if (!fontItem) return;

        document.querySelector('.font-item.active')?.classList.remove('active');
        fontItem.classList.add('active');
        
        activeStyleName = fontItem.dataset.styleName;
        originalText = userInput.value;
        updateStage();
    });
    
    resetBtn.addEventListener('click', () => {
        activeStyleName = null;
        userInput.value = originalText;
        document.querySelector('.font-item.active')?.classList.remove('active');
        autoResizeTextarea();
    });

    copyBtn.addEventListener('click', () => {
        if (!userInput.value) return;
        navigator.clipboard.writeText(userInput.value).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });
    
    // --- TEXT TOOLS LOGIC ---
    const applyTool = (transformation) => {
        userInput.value = transformation(userInput.value);
        originalText = userInput.value;
        if (activeStyleName) {
            updateStage();
        }
        autoResizeTextarea();
    };

    btnUppercase.addEventListener('click', () => applyTool(text => text.toUpperCase()));
    btnLowercase.addEventListener('click', () => applyTool(text => text.toLowerCase()));
    btnReverse.addEventListener('click', () => applyTool(text => text.split('').reverse().join('')));
    btnTitlecase.addEventListener('click', () => applyTool(text => text.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase())));


    // --- INITIALIZATION ---
    renderFontGrid();
    autoResizeTextarea();
});
