/* ========================================
   NGO Template - Main JavaScript
   ======================================== */

(function() {
    'use strict';

    // Load partials (only if placeholder exists and is empty)
    function loadPartial(placeholderId, partialPath, basePath) {
        const placeholder = document.getElementById(placeholderId);
        // Only load if placeholder exists AND is empty (not already populated)
        if (placeholder && placeholder.innerHTML.trim() === '') {
            fetch(partialPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    placeholder.innerHTML = html;
                    // Fix image paths based on current location
                    const images = placeholder.querySelectorAll('img[data-src]');
                    images.forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = basePath + dataSrc;
                        }
                    });
                    // Fix link paths
                    const links = placeholder.querySelectorAll('a[href]');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
                            if (basePath !== './') {
                                // If we're in pages/, fix paths
                                if (href === 'index.html') {
                                    link.setAttribute('href', basePath + href);
                                } else if (!href.startsWith('pages/')) {
                                    link.setAttribute('href', basePath + href);
                                }
                            }
                        }
                    });
                    // Execute any scripts in the loaded HTML
                    const scripts = placeholder.querySelectorAll('script');
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        Array.from(oldScript.attributes).forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                })
                .catch(error => {
                    // Silently fail if placeholder doesn't exist or is already populated
                    // Only log to console for debugging, don't show error message
                    console.log(`Partial ${partialPath} not loaded (this is OK if header/footer are inlined):`, error.message);
                });
        }
    }

    // Determine base path based on current location
    function getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/')) {
            return '../';
        } else if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
            return './';
        }
        return '../';
    }

    // Load partials when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const basePath = getBasePath();

        // Only load header if placeholder exists AND header is not already inlined
        const existingHeader = document.querySelector('header');
        if (!existingHeader) {
            loadPartial('header-placeholder', basePath + 'partials/header.html', basePath);
        }
        
        // Only load footer if placeholder exists AND footer is not already inlined
        const existingFooter = document.querySelector('footer');
        if (!existingFooter) {
            loadPartial('footer-placeholder', basePath + 'partials/footer.html', basePath);
        }
        
        // Load modals (always try, it's optional)
        loadPartial('modals-placeholder', basePath + 'partials/modals.html', basePath);
    });

    // Smooth scroll for anchor links
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    });

    // Counter animation for stats
    function animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }

    // Observe stats for animation
    document.addEventListener('DOMContentLoaded', function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        const count = parseInt(statNumber.getAttribute('data-count') || statNumber.textContent);
                        const suffix = statNumber.getAttribute('data-suffix') || '';
                        animateCounter(statNumber, count, suffix);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(stat => {
            observer.observe(stat);
        });
    });

    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuToggle && navMenu) {
            const toggleMenu = () => {
                navMenu.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            };

            mobileMenuToggle.addEventListener('click', function() {
                toggleMenu();
            });

            navMenu.querySelectorAll('.dropdown > a').forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    const viewportWidth = window.innerWidth;
                    if (viewportWidth <= 992) {
                        e.preventDefault();
                        const parent = this.parentElement;
                        parent.classList.toggle('open');
                    }
                });
            });

            // Ensure dropdown closes when focus leaves (accessibility)
            navMenu.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('open');
                });
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navMenu && mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                const clickedInsideMenu = navMenu.contains(event.target);
                const clickedToggle = mobileMenuToggle.contains(event.target);

                if (!clickedInsideMenu && !clickedToggle) {
                    navMenu.classList.remove('active');
                    navMenu.querySelectorAll('.dropdown').forEach(dropdown => dropdown.classList.remove('open'));
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Progress bar animation
    document.addEventListener('DOMContentLoaded', function() {
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width') || entry.target.style.width;
                    entry.target.style.width = width;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            const width = bar.parentElement.previousElementSibling?.querySelector('.progress-info')?.textContent?.match(/\d+%/) || ['0%'];
            bar.setAttribute('data-width', width[0]);
            bar.style.width = '0%';
            observer.observe(bar);
        });
    });

})();

