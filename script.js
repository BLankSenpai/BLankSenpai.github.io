// JavaScript for main-content animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const mainContents = document.querySelectorAll('.main-content');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once shown if you only want it to animate once
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove 'show' class if you want it to re-animate on scroll back
                // entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    mainContents.forEach(content => {
        observer.observe(content);
    });

    // Basic JavaScript for the menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        const menuInput = menuToggle.querySelector('input[type="checkbox"]');
        const menu = document.getElementById('menu');

        if (menuInput && menu) {
            menuInput.addEventListener('change', function() {
                if (this.checked) {
                    menu.style.transform = 'none';
                } else {
                    menu.style.transform = 'translate(-100%, 0)';
                }
            });
        }
    }

    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const previewImages = document.querySelectorAll('img[data-light-src][data-dark-src]');
    if (themeToggle) {
        const updateToggleState = (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');

            const ts = location.protocol.startsWith('http') ? '?v=' + Date.now() : '';
            previewImages.forEach(img => {
                const targetSrc = isDark ? img.dataset.darkSrc : img.dataset.lightSrc;
                if (targetSrc) {
                    img.setAttribute('src', targetSrc + ts);
                }
            });
        };

        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme');
        } catch (e) {}
        updateToggleState(savedTheme === 'dark');

        themeToggle.addEventListener('click', () => {
            const isDark = !document.documentElement.classList.contains('dark-mode');
            updateToggleState(isDark);
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) {}
        });
    }
});
