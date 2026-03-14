document.addEventListener('DOMContentLoaded', () => {

    /* --- Advanced Animations --- */

    // 1. Custom Cursor & Parallax Blobs
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    const blobs = document.querySelectorAll('.blob');
    
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let followerX = mouseX, followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Animate follower loop
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15; // easing
        followerY += (mouseY - followerY) * 0.15;
        if(follower) follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        
        // Subtle Parallax Blobs
        const offsetX = (mouseX / window.innerWidth - 0.5) * -100;
        const offsetY = (mouseY / window.innerHeight - 0.5) * -100;
        
        blobs.forEach((blob, i) => {
            const depth = (i + 1) * 0.5;
            blob.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
        });
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // 2. Magnetic Buttons & Cursor Hover State
    const magneticElements = document.querySelectorAll('.btn, .nav-links a, .service-card');
    
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
            el.style.transform = ''; // reset magnetic pull
        });
        
        // Magnetism
        el.addEventListener('mousemove', (e) => {
            if(!el.classList.contains('btn')) return; // Strong magnetism only on buttons
            
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
    });

    // 3. Split Text Stagger Reveal
    const splitTextEls = document.querySelectorAll('[data-split-text]');
    splitTextEls.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split(' ').forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'pre';
            
            // Re-add the break for title manually
            if (word.includes('Boundaries')) {
                el.appendChild(document.createElement('br'));
            }
            
            word.split('').forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                charSpan.className = 'char';
                charSpan.style.animationDelay = `${(wordIndex * 0.1) + (charIndex * 0.03)}s`;
                wordSpan.appendChild(charSpan);
            });
            
            wordSpan.appendChild(document.createTextNode(' '));
            el.appendChild(wordSpan);
        });
        
        // Fix gradient specifically for the newly generated spans
        const spans = el.querySelectorAll('.char');
        spans.forEach(span => {
            if(span.innerText.trim() && span.parentNode.innerText.includes('Boundaries')) {
                span.classList.add('gradient-text');
                span.style.backgroundClip = 'text';
                span.style.webkitBackgroundClip = 'text';
            }
        });
    });

    // 4. Sticky Header (Legacy)
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Active Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Reveal on Scroll (Enhanced)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => {
        observer.observe(el);
    });

    // 4. Hero Parallax / Mouse Move effect
    const hero = document.querySelector('.hero');
    const heroCards = document.querySelectorAll('.hero-card');
    
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            heroCards.forEach((card, index) => {
                const depth = (index + 1) * 0.5;
                card.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${index % 2 === 0 ? 2 : -3}deg)`;
            });
        });
    }

    // 4. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 6. Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 7. Form Submission (Simulated)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // 8. Theme Toggle logic
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
        }
    } else {
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.setAttribute('data-theme', 'light');
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }    
    }

    toggleSwitch.addEventListener('change', switchTheme, false);
});
