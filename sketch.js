// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Language switcher
function changeLanguage(lang) {
    // Hide all language elements
    document.querySelectorAll('.en, .he, .ar, .rn').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show elements for selected language
    document.querySelectorAll('.' + lang).forEach(el => {
        el.classList.remove('hidden');
    });
    
    // Update active button
    document.querySelectorAll('.language-selector button').forEach(btn => {
        if (btn.textContent === lang.toUpperCase()) {
            btn.classList.remove('bg-gray-200', 'text-gray-800');
            btn.classList.add('bg-primary', 'text-white');
        } else {
            btn.classList.add('bg-gray-200', 'text-gray-800');
            btn.classList.remove('bg-primary', 'text-white');
        }
    });
    
    // Change HTML direction for RTL languages
    if (lang === 'he' || lang === 'ar') 
    {
        document.documentElement.dir = 'rtl';
    } 
    else 
    {
        document.documentElement.dir = 'ltr';
    }
}

// Add language selector class to mobile menu buttons
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.classList.add('language-selector');
});

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Set Hebrew as default language
document.addEventListener('DOMContentLoaded', function() {
    changeLanguage('he');
    feather.replace();
});

// Feather icons replacement
feather.replace();