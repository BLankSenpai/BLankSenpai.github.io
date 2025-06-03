    <script>
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
            const menuInput = menuToggle.querySelector('input[type="checkbox"]');
            const menu = document.getElementById('menu');

            menuInput.addEventListener('change', function() {
                if (this.checked) {
                    menu.style.transform = 'none';
                } else {
                    menu.style.transform = 'translate(-100%, 0)';
                }
            });
        });
    </script>
</body>
</html>
