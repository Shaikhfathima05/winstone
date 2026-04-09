/* ============================================================
   Winstone Projects UAE - Javascript
   ============================================================ */

   document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Scroll Effect + Hero Video Parallax
    const navbar = document.getElementById('navbar');
    const heroVideo = document.querySelector('.hero-video');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hero video parallax: shift video up as user scrolls down
        if (heroVideo) {
            const parallaxOffset = scrollY * 0.3; // subtle 30% speed
            heroVideo.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
        }
    });

    // 2. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Scroll Reveal Animations & Number Counters
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const runCounter = (element) => {
        const target = +element.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16); 
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target;
            }
        };
        updateCounter();
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it contains stat-vals, run the counters
                const counters = entry.target.querySelectorAll('.stat-val');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        runCounter(counter);
                        counter.classList.add('counted');
                    }
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Remove hide class first to recalculate layout
                card.classList.remove('hide');

                if (filterValue === 'all') {
                    // Show top 3 by default or all if needed. Let's just show those that don't have .hide naturally
                    // To keep it simple, show all cards
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                }
            });
        });
    });

    // 5. Testimonial Slider
    const slider = document.getElementById('testimonialSlider');
    const prevBtn = document.getElementById('prevTesti');
    const nextBtn = document.getElementById('nextTesti');
    let currentIndex = 0;
    
    if (slider && prevBtn && nextBtn) {
        const cards = document.querySelectorAll('.testi-card');
        const numCards = cards.length;

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % numCards;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + numCards) % numCards;
            updateSlider();
        });
    }

});
