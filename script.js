document.addEventListener('DOMContentLoaded', () => {
    // --- SETTINGS (Yahan se aap fonts ki taadad badal sakte hain) ---
    const FONTS_PER_PAGE = 20; // Ek baar mein 20 fonts load honge

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const userInput = document.getElementById('userInput');
    const outputContainer = document.getElementById('outputContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const toast = document.getElementById('toast');

    // Toolbar Buttons
    const btnUppercase = document.getElementById('btn-uppercase');
    const btnLowercase = document.getElementById('btn-lowercase');
    const btnTitlecase = document.getElementById('btn-titlecase');
    const btnReverse = document.getElementById('btn-reverse');
    const btnClear = document.getElementById('btn-clear');

    // State
    let currentPage = 1;
    let currentInputText = '';

    // --- THEME SWITCHER ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('light-mode');
            themeToggle.checked = false;
        }
    };
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- CORE TEXT TRANSFORMATION ---
    const transformText = (text, style) => {
        if (style.transform) return style.transform(text);
        let result = '';
        for (const char of text) {
            result += style.map[char] || char; 
        }
        return result;
    };

    // --- PAGINATION & RENDERING (MASLA YAHAN THEEK KIYA GAYA HAI) ---
    const renderFonts = () => {
        const startIndex = (currentPage - 1) * FONTS_PER_PAGE;
        const endIndex = startIndex + FONTS_PER_PAGE;
        const fontsToRender = fontLibrary.slice(startIndex, endIndex);

        let html = '';
        for (const style of fontsToRender) {
            const transformedText = transformText(currentInputText || "Preview Text", style);
            html += `
                <div class="result-card">
                    <div class="result-card-header">
                        <span class="font-name">${style.name}</span>
                        <span class="font-category">${style.category}</span>
                    </div>
                    <div class="result-preview" title="Click to copy">${transformedText}</div>
                </div>
            `;
        }
        outputContainer.innerHTML += html;

        // *** YEH HAI ASAL FIX ***
        // Ab yeh check karega ke kia aur fonts baaqi hain.
        // Agar hain, to button nazar aayega. Agar nahi, to chhup jayega.
        if (endIndex >= fontLibrary.length) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
    };

    const resetAndRender = () => {
        currentPage = 1;
        currentInputText = userInput.value;
        outputContainer.innerHTML = ''; // Sirf yahan par container ko saaf karein
        renderFonts();
        updateCounters();
    };
    
    // --- EVENT LISTENERS ---
    userInput.addEventListener('input', resetAndRender);
    
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderFonts();
    });

    outputContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-preview')) {
            navigator.clipboard.writeText(e.target.innerText);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    });

    // --- TOOLBAR FUNCTIONALITY ---
    const updateCounters = () => {
        const text = userInput.value;
        charCountEl.textContent = text.length;
        wordCountEl.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    };

    btnUppercase.addEventListener('click', () => { userInput.value = userInput.value.toUpperCase(); resetAndRender(); });
    btnLowercase.addEventListener('click', () => { userInput.value = userInput.value.toLowerCase(); resetAndRender(); });
    btnReverse.addEventListener('click', () => { userInput.value = userInput.value.split('').reverse().join(''); resetAndRender(); });
    btnClear.addEventListener('click', () => { userInput.value = ''; resetAndRender(); });
    btnTitlecase.addEventListener('click', () => {
        userInput.value = userInput.value.toLowerCase().replace(/(^|\s)\S/g, L => L.toUpperCase());
        resetAndRender();
    });

    // --- INITIAL LOAD ---
    resetAndRender();
});
