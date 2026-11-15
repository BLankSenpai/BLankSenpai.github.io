window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        const menuInput = document.querySelector('#menuToggle input[type="checkbox"]');
        if (menuInput) menuInput.checked = false;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Scroll entrance animation for project cards and captions
    const mainContents = document.querySelectorAll('.main-content');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        mainContents.forEach(content => observer.observe(content));
    } else {
        mainContents.forEach(content => content.classList.add('show'));
    }

    // Navigation menu cleanup
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        const menuInput = menuToggle.querySelector('input[type="checkbox"]');
        const menuLinks = menuToggle.querySelectorAll('#menu a');
        if (menuInput) {
            menuInput.checked = false;
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuInput.checked = false;
                });
            });
        }
    }

    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const updateToggleState = (isDark) => {
            document.documentElement.classList.toggle('dark-mode', isDark);
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
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

    // Enable CSS theme/menu transitions only after first paint to prevent load glitches
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.documentElement.classList.add('theme-ready');
        });
    });
});
