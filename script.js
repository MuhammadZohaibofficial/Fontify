// --- FONTIFY STUDIO PRO - SCRIPT.JS ---

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userInput = document.getElementById('userInput');
    const textareaWrapper = document.querySelector('.textarea-wrapper');
    const fontListContainer = document.getElementById('fontListContainer');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toast = document.getElementById('toast');

    // State Variables
    let originalText = ''; // User ka asli, non-styled text yahan save hoga
    let activeStyleName = null; // Jo font style select kiya gaya hai, uska naam

    // --- SMART TEXTBOX (AUTO-RESIZE) ---
    // Yeh function text ke hisab se text box ka size badalta hai
    const autoResizeTextarea = () => {
        // Yeh content ko replicate karke aek invisible div mein daalta hai taake height pata chale
        textareaWrapper.dataset.replicatedValue = userInput.value;
    };
    userInput.addEventListener('input', autoResizeTextarea);

    // --- CORE TEXT TRANSFORMATION ---
    const transformText = (text, styleName) => {
        if (!styleName) return text; // Agar koi style select nahi, to original text dikhao
        
        const style = fontLibrary.find(s => s.name === styleName);
        if (!style) return text; // Agar style na mile, to original text dikhao

        if (style.transform) return style.transform(text); // Special functions ke liye
        
        let result = '';
        for (const char of text) {
            result += style.map[char] || char; // Character map se badlo
        }
        return result;
    };

    // --- FONT PALETTE RENDERING ---
    // Yeh neeche sliding font list banata hai
    const renderPalette = () => {
        let html = '';
        for (const style of fontLibrary) {
            html += `
                <div class="font-item" data-style-name="${style.name}">
                    <div class="font-preview">${transformText('Style', style.name)}</div>
                </div>
            `;
        }
        fontListContainer.innerHTML = html;
    };

    // --- STAGE UPDATE LOGIC ---
    // Yeh function upar "Stage" wale text ko update karta hai
    const updateStage = () => {
        userInput.value = transformText(originalText, activeStyleName);
        autoResizeTextarea(); // Size bhi update karo
    };

    // --- EVENT LISTENERS ---

    // Jab user text box mein kuch likhe
    userInput.addEventListener('input', () => {
        // Har baar jab user likhe, hum original text ko update karenge
        if (activeStyleName) {
            // Agar koi style laga hua hai, to hum usay hata kar original text update karenge
            // Yeh thora complex ho sakta hai, isliye hum reset ka istemal karenge
            // Aasan tareeka:
            originalText = userInput.value;
            activeStyleName = null;
            document.querySelector('.font-item.active')?.classList.remove('active');
        } else {
            originalText = userInput.value;
        }
    });

    // Jab user neeche sliding palette se koi font select kare
    fontListContainer.addEventListener('click', (e) => {
        const fontItem = e.target.closest('.font-item');
        if (!fontItem) return;

        // Purane active item se 'active' class hatao
        document.querySelector('.font-item.active')?.classList.remove('active');
        
        // Naye item par 'active' class lagao
        fontItem.classList.add('active');
        
        // Naya style save karo aur stage update karo
        activeStyleName = fontItem.dataset.styleName;
        originalText = userInput.value; // Text ko save karlo
        updateStage();
    });
    
    // Reset Button ka Logic
    resetBtn.addEventListener('click', () => {
        activeStyleName = null;
        userInput.value = originalText;
        document.querySelector('.font-item.active')?.classList.remove('active');
        autoResizeTextarea();
    });

    // Copy Button ka Logic
    copyBtn.addEventListener('click', () => {
        if (!userInput.value) return; // Agar box khali hai to kuch na karo
        
        navigator.clipboard.writeText(userInput.value).then(() => {
            // Toast notification dikhao
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        });
    });

    // --- INITIALIZATION ---
    // Page load hone par palette banao
    renderPalette();
    // Shuru mein text box ka size set karo
    autoResizeTextarea();
});
