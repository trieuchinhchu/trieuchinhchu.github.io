// Multi-language support
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    const translations = { 'en': 'VI', 'vi': 'EN' };
    
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                // Preserve child elements (like counters, links)
                const children = el.querySelectorAll('.counter, a');
                if (children.length === 0) {
                    el.textContent = text;
                } else {
                    // Only update text nodes
                    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
                    let node;
                    const textNodes = [];
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }
                    // For simple cases, just set innerHTML based on data attribute
                    // But for complex cases with links, we skip
                    if (el.querySelectorAll('a').length === 0) {
                        el.innerHTML = text;
                    }
                }
            }
        }
    });
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = translations[lang];
    }
    localStorage.setItem('preferredLanguage', lang);
}

// Dark mode toggle
function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (newTheme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }
}

// Scroll progress indicator
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
}

// Navigation menu visibility and active section
function updateNavigation() {
    const nav = document.querySelector('.nav-menu');
    if (!nav || nav.classList.contains('always-visible')) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 200) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }

    // Update active nav link
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll to top button
function updateScrollToTop() {
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (!scrollToTop) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
        scrollToTop.classList.add('visible');
    } else {
        scrollToTop.classList.remove('visible');
    }
}

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        if (counter.classList.contains('counted')) return;
        
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            counter.classList.add('counted');
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        }
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        if (bar.classList.contains('animated')) return;
        
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            bar.classList.add('animated');
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 100);
        }
    });
}

// Skill filter functionality
function setupSkillFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            skillCategories.forEach(category => {
                if (filter === 'all') {
                    category.style.display = 'block';
                } else {
                    const categoryType = category.getAttribute('data-category');
                    category.style.display = categoryType === filter ? 'block' : 'none';
                }
            });
        });
    });
}

// Project item toggle
function setupProjectToggle() {
    const projectItems = document.querySelectorAll('.project-item h5');
    
    projectItems.forEach(title => {
        title.addEventListener('click', () => {
            const projectItem = title.closest('.project-item');
            projectItem.classList.toggle('collapsed');
        });
    });
}

// Download PDF functionality
function downloadPDF() {
    const collapsedItems = document.querySelectorAll('.project-item.collapsed');
    collapsedItems.forEach(item => item.classList.remove('collapsed'));
    window.print();
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    if (!mobileMenuBtn || !navMenu) return;
    
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
        if (menuIcon) menuIcon.classList.toggle('hidden');
        if (closeIcon) closeIcon.classList.toggle('hidden');
    });
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-open');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        }
    });
}

// Smooth scroll for navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    }
    
    if (savedLang === 'vi') {
        switchLanguage('vi');
    }

    // Setup event listeners
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            switchLanguage(currentLang === 'en' ? 'vi' : 'en');
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    const downloadPDFBtn = document.getElementById('downloadPDF');
    if (downloadPDFBtn) {
        downloadPDFBtn.addEventListener('click', downloadPDF);
    }
    
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupSmoothScroll();
    setupSkillFilters();
    setupProjectToggle();
    setupMobileMenu();

    // Scroll event listeners
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateNavigation();
        updateScrollToTop();
        animateCounters();
        animateProgressBars();
    });

    // Initial calls
    updateScrollProgress();
    updateNavigation();
    animateCounters();
    animateProgressBars();
});
