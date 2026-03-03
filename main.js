// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active nav link on scroll + neon effects (throttled with rAF)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const neonProgress = document.querySelector('.neon-progress');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            // Nav link highlight
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            // Progress bar
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            neonProgress.style.width = scrollPercent + '%';

            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Scroll Reveal with Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Form validation
const contactForm = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            formMessage.innerHTML = '<p class="form-error">Please fill in all required fields.</p>';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.innerHTML = '<p class="form-error">Please enter a valid email address.</p>';
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                formMessage.innerHTML = '<p class="form-success">Thank you! Your message has been sent successfully.</p>';
                contactForm.reset();
            } else {
                formMessage.innerHTML = '<p class="form-error">There was a problem sending your message. Please try again.</p>';
            }
        } catch (error) {
            formMessage.innerHTML = '<p class="form-error">There was a problem sending your message. Please try again.</p>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
