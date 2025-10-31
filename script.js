document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const fontListContainer = document.getElementById('fontListContainer');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const charCountEl = document.getElementById('charCount');
    const wordCountEl = document.getElementById('wordCount');

    let originalText = '';
    let activeStyle = null;

    // --- Font Palette ko Banana ---
    const renderPalette = () => {
        let html = '';
        for (const style of fontLibrary) {
            html += `
                <div class="font-item" data-style-name="${style.name}">
                    <div class="font-preview">${transformText('Aa', style)}</div>
                    <div class="font-name">${style.name}</div>
                </div>
            `;
        }
        fontListContainer.innerHTML = html;
    };

    // --- Core Logic ---
    const transformText = (text, style) => {
        if (!style) return text; // Agar koi style select nahi hai, to original text dikhao
        if (style.transform) return style.transform(text);
        let result = '';
        for (const char of text) {
            result += style.map[char] || char;
        }
        return result;
    };

    const updateStage = () => {
        const currentStyle = fontLibrary.find(s => s.name === activeStyle);
        userInput.value = transformText(originalText, currentStyle);
        updateCounters();
    };

    const updateCounters = () => {
        const text = userInput.value;
        charCountEl.textContent = `${text.length} Chars`;
        wordCountEl.textContent = `${text.trim() === '' ? 0 : text.trim().split(/\s+/).length} Words`;
    };

    // --- Event Listeners ---
    userInput.addEventListener('input', () => {
        // Jab user type kare, to original text save karo aur stage update karo
        if (activeStyle === null) {
            originalText = userInput.value;
            updateCounters();
        } else {
            // Agar koi style laga hua hai, to usay pehle reset karo
            const currentStyle = fontLibrary.find(s => s.name === activeStyle);
            // Yeh thora tricky hai, humein aesa system banana hoga ke original text yaad rahe
            // Asaan tareeka yeh hai ke hum original text ko hamesha yaad rakhein
            // Is logic ko behtar banate hain:
            resetToOriginal();
            originalText = userInput.value;
            updateCounters();
        }
    });

    fontListContainer.addEventListener('click', (e) => {
        const fontItem = e.target.closest('.font-item');
        if (!fontItem) return;

        // Purane active item se active class hatao
        document.querySelector('.font-item.active')?.classList.remove('active');
        // Naye item par active class lagao
        fontItem.classList.add('active');

        activeStyle = fontItem.dataset.styleName;
        originalText = userInput.value; // Text ko save karo
        updateStage(); // Foran stage update karo
    });
    
    const resetToOriginal = () => {
        activeStyle = null;
        userInput.value = originalText;
        document.querySelector('.font-item.active')?.classList.remove('active');
    }

    resetBtn.addEventListener('click', () => {
        resetToOriginal();
        updateCounters();
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(userInput.value);
        // Toast notification ka logic yahan aayega
    });

    // --- Initial Load ---
    renderPalette();
    updateCounters();
});
