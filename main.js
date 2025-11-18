// ====================================
// FABLE - Interactive JavaScript
// ====================================

// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 240, // Purple to blue range
            });
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Pulsing opacity
            particle.opacity = Math.sin(Date.now() * 0.001 + particle.x) * 0.3 + 0.4;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.update());
    }
}

// Navigation & Page Management
class PageManager {
    constructor() {
        this.currentPage = 'hero';
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Set initial active page
        this.setActivePage('hero');

        // Navigation click handlers
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.setActivePage(pageId);

                // Smooth scroll to page
                document.getElementById(pageId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Intersection Observer for automatic nav highlighting
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const pageId = entry.target.id;
                    this.setActivePage(pageId);
                }
            });
        }, observerOptions);

        this.pages.forEach(page => observer.observe(page));
    }

    setActivePage(pageId) {
        this.currentPage = pageId;

        // Update nav links
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update page visibility
        this.pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }
}

// Parallax Effect
class ParallaxManager {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            this.pages.forEach((page, index) => {
                const pageTop = page.offsetTop;
                const pageHeight = page.offsetHeight;
                const offset = scrolled - pageTop;

                if (offset > -pageHeight && offset < pageHeight) {
                    const parallaxSpeed = 0.5;
                    const yPos = -(offset * parallaxSpeed);
                    page.style.backgroundPositionY = `${yPos}px`;
                }
            });
        });
    }
}

// Custom Cursor Manager
class CursorManager {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.id = 'cursor';
        document.body.appendChild(this.cursor);

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';

            this.createTrail(e.clientX, e.clientY);
        });

        // Hover effects
        const interactables = document.querySelectorAll('a, button, .feature-card, .morality-path');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovered'));
        });
    }

    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 500);
    }
}

// Scroll Reveal Manager
class ScrollRevealManager {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// Audio Manager
class AudioManager {
    constructor() {
        this.audioEnabled = false;
        this.ambientMusic = document.getElementById('ambient-music');
        this.audioToggle = document.getElementById('audio-toggle');

        // Create audio context for sound effects
        this.audioContext = null;
        this.sounds = {};

        this.init();
    }

    init() {
        // Audio toggle button
        this.audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });

        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });

        // Add hover sound effects to interactive elements
        this.addHoverSounds();
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;

        const iconOn = this.audioToggle.querySelector('.icon-sound-on');
        const iconOff = this.audioToggle.querySelector('.icon-sound-off');

        if (this.audioEnabled) {
            iconOn.style.display = 'inline';
            iconOff.style.display = 'none';
            this.playAmbientMusic();
            this.playSound('ui-on', 0.3);
        } else {
            iconOn.style.display = 'none';
            iconOff.style.display = 'inline';
            this.stopAmbientMusic();
        }
    }

    playAmbientMusic() {
        if (this.ambientMusic && this.audioEnabled) {
            // Since we don't have actual audio file, we'll simulate it
            // In production, the audio element would have a source
            this.ambientMusic.volume = 0.3;
            this.ambientMusic.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
            });
        }
    }

    stopAmbientMusic() {
        if (this.ambientMusic) {
            this.ambientMusic.pause();
            this.ambientMusic.currentTime = 0;
        }
    }

    // Web Audio API for UI sounds
    playSound(type, volume = 0.2) {
        if (!this.audioEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Different sounds for different interactions
        switch (type) {
            case 'hover':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'click':
                oscillator.frequency.value = 1200;
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
                break;
            case 'ui-on':
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
        }
    }

    addHoverSounds() {
        const interactables = document.querySelectorAll('a, button, .feature-card, .stat-item, .morality-path');

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.playSound('hover', 0.1);
            });

            el.addEventListener('click', () => {
                this.playSound('click', 0.15);
            });
        });
    }
}

// Interactive Hover Effects
class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        // Feature cards tilt effect
        const cards = document.querySelectorAll('.feature-card, .morality-path');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Stat items glow effect
        const statItems = document.querySelectorAll('.stat-item');

        statItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.boxShadow = '0 10px 40px rgba(139, 92, 246, 0.6)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.boxShadow = '';
            });
        });
    }
}

// Smooth Scroll Helper Function
window.scrollToPage = function (pageId) {
    const element = document.getElementById(pageId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleCanvas = document.getElementById('particles');
    const particleSystem = new ParticleSystem(particleCanvas);
    particleSystem.update();

    // Initialize page management
    const pageManager = new PageManager();

    // Initialize parallax
    const parallaxManager = new ParallaxManager();

    // Initialize interactions
    const interactionManager = new InteractionManager();

    // Initialize Custom Cursor
    const cursorManager = new CursorManager();

    // Initialize Scroll Reveal
    const scrollRevealManager = new ScrollRevealManager();

    // Initialize Audio Manager
    const audioManager = new AudioManager();

    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);

    console.log('🎮 Welcome to Fable - Your journey begins...');
});
