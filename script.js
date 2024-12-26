// Cursor follower
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });

    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animate);
    }
    
    animate();

    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Timeline animation
    const observerTimeline = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observerTimeline.observe(item);
    });

    // Counter animation function
    function animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = 2000; // 2 seconds
        const steps = 50;
        const stepValue = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.round(current);
            }
        }, duration / steps);
    }

    // Stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.counter').forEach(counter => {
                    animateCounter(counter);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Fix: Correct selector for stats section
    const statsSection = document.querySelector('.growth-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Update the navigation functionality
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    
    // Update active state on scroll
    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (id) {
                    breadcrumbItems.forEach(item => item.classList.remove('active'));
                    const activeItem = document.querySelector(`.breadcrumb-item[href="#${id}"]`);
                    if (activeItem) {
                        activeItem.classList.add('active');
                    }
                }
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '-20% 0px -20% 0px'
    });

    // Observe sections
    const sections = ['home', 'challenge', 'solution', 'comparison', 'why-us-section', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observerNav.observe(section);
        }
    });

    // Handle click events
    breadcrumbItems.forEach(item => {
        item.addEventListener('click', () => {
            breadcrumbItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
        });
    });
}); 