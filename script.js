// --- FONTIFY PRO V2 - SCRIPT.JS (FINAL & FIXED) ---

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const fontGrid = document.getElementById('fontGrid');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toast = document.getElementById('toast');
    
    const openNavBtn = document.getElementById('open-nav-btn');
    const closeNavBtn = document.getElementById('close-nav-btn');
    const navDrawer = document.getElementById('nav-drawer');
    const navOverlay = document.getElementById('nav-overlay');

    const btnUppercase = document.getElementById('btn-uppercase');
    const btnLowercase = document.getElementById('btn-lowercase');
    const btnTitlecase = document.getElementById('btn-titlecase');
    const btnReverse = document.getElementById('btn-reverse');
    const btnClear = document.getElementById('btn-clear');
    const btnDownload = document.getElementById('btn-download');

    let originalText = '';
    let activeStyleName = null;

    const openNav = () => { navDrawer.classList.add('open'); navOverlay.classList.add('visible'); };
    const closeNav = () => { navDrawer.classList.remove('open'); navOverlay.classList.remove('visible'); };
    openNavBtn.addEventListener('click', openNav);
    closeNavBtn.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);

    const autoResizeTextarea = () => { userInput.style.height = 'auto'; userInput.style.height = userInput.scrollHeight + 'px'; };
    userInput.addEventListener('input', autoResizeTextarea);

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
            html += `<div class="font-item" data-style-name="${style.name}"><div class="font-preview">${transformText('Style', style.name)}</div><div class="font-name">${style.name}</div></div>`;
        }
        fontGrid.innerHTML = html;
    };
    
    const handleInputChange = (event) => {
        if (event.isTrusted) { // Only update originalText if user is typing
            originalText = userInput.value;
            activeStyleName = null;
            document.querySelector('.font-item.active')?.classList.remove('active');
        }
    };

    userInput.addEventListener('input', handleInputChange);

    fontGrid.addEventListener('click', (e) => {
        const fontItem = e.target.closest('.font-item');
        if (!fontItem) return;
        document.querySelector('.font-item.active')?.classList.remove('active');
        fontItem.classList.add('active');
        activeStyleName = fontItem.dataset.styleName;
        userInput.value = transformText(originalText, activeStyleName);
        autoResizeTextarea();
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
    
    const applyTool = (transformation) => {
        originalText = transformation(originalText);
        userInput.value = transformText(originalText, activeStyleName);
        autoResizeTextarea();
    };

    btnUppercase.addEventListener('click', () => applyTool(text => text.toUpperCase()));
    btnLowercase.addEventListener('click', () => applyTool(text => text.toLowerCase()));
    btnReverse.addEventListener('click', () => applyTool(text => text.split('').reverse().join('')));
    btnTitlecase.addEventListener('click', () => applyTool(text => text.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase())));
    btnClear.addEventListener('click', () => { originalText = ''; activeStyleName = null; userInput.value = ''; document.querySelector('.font-item.active')?.classList.remove('active'); autoResizeTextarea(); });
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

    renderFontGrid();
    autoResizeTextarea();
});
