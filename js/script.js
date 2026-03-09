'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');

    // Initialize all components
    initScrollReveal();
    initSkillCardsTilt();
    initAutoScroll();
    initTimeWidget();
});

/**
 * 1. Scroll Reveal for Timeline
 */
function initScrollReveal() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => observer.observe(item));
}

/**
 * 2. Tilt Logic for Skill Cards
 */
function initSkillCardsTilt() {
    const cards = document.querySelectorAll('.skill-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 15; 
            const rotateX = ((centerY - y) / centerY) * 15; 
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
}

/**
 * 3. Auto-scroll logic for first interaction (Index Page)
 */
function initAutoScroll() {
    const experienceSection = document.getElementById('experience');
    if (!experienceSection) return;

    let hasScrolled = false;
    window.addEventListener('wheel', (e) => {
        if (!hasScrolled && window.scrollY < 100 && e.deltaY > 0) {
            hasScrolled = true;
            experienceSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, { passive: true });
}

/**
 * 4. Dynamic Time Widget (Contact Page)
 */
function initTimeWidget() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;

    const greetingElement = document.getElementById('time-greeting');
    const skyCard = document.getElementById('sky-card');
    const iconElement = document.getElementById('celestial-icon');
    const stars = document.getElementById('stars');
    
    function updateTime() {
        const options = {
            timeZone: 'Europe/Rome',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        
        const now = new Date();
        const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
        timeElement.textContent = timeString;

        const hour = parseInt(timeString.split(':')[0]);
        
        // Reset classes
        skyCard.className = "relative w-full rounded-3xl p-8 overflow-hidden flex flex-col justify-between text-white transition-all duration-1000 shadow-lg border border-white/10";
        if (stars) stars.style.opacity = "0";

        if (hour >= 5 && hour < 8) {
            // Dawn
            skyCard.classList.add('sky-dawn');
            iconElement.innerHTML = '<i class="fas fa-cloud-sun"></i>';
            greetingElement.textContent = "Good Morning, early bird! 🌅";
        } else if (hour >= 8 && hour < 17) {
            // Day
            skyCard.classList.add('sky-day');
            iconElement.innerHTML = '<i class="fas fa-sun"></i>';
            greetingElement.textContent = "Have a productive day! ☀️";
        } else if (hour >= 17 && hour < 20) {
            // Sunset
            skyCard.classList.add('sky-sunset');
            iconElement.innerHTML = '<i class="fas fa-cloud-moon"></i>';
            greetingElement.textContent = "Enjoy the sunset! 🌇";
        } else {
            // Night
            skyCard.classList.add('sky-night');
            iconElement.innerHTML = '<i class="fas fa-moon"></i>';
            greetingElement.textContent = "Probably dreaming... 💤";
            if (stars) stars.style.opacity = "1";
        }
    }

    // Initial call
    updateTime();
    // Update every second
    setInterval(updateTime, 1000);
}
