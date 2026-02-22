// --- Crazy Interaction Engine ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

// Create Glow Path Layer
const glowPath = document.createElement('div');
glowPath.className = 'glow-path';
document.body.appendChild(glowPath);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // Update Global Glow Path
    document.body.style.setProperty('--mx', mouseX + 'px');
    document.body.style.setProperty('--my', mouseY + 'px');
});

// Smooth follower logic
function animate() {
    followX += (mouseX - followX) * 0.15;
    followY += (mouseY - followY) * 0.15;

    follower.style.left = (followX - 20) + 'px';
    follower.style.top = (followY - 20) + 'px';

    requestAnimationFrame(animate);
}
animate();

// --- Click Ripple ---
document.addEventListener('click', (e) => {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX - 25 + 'px';
    r.style.top = e.clientY - 25 + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 500);
});

// --- Magnetic Snap & Liquid ---
const magnetics = document.querySelectorAll('.magnetic, .btn, .nav-item, .social-links a, .bento-item');
magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.02)`;
        document.body.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0) scale(1)';
        document.body.classList.remove('hovering');
    });
});

// --- Text Matrix Shuffle ---
const texts = document.querySelectorAll('.tagline, h3, .section-title');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@%&*";

texts.forEach(text => {
    const original = text.innerText;
    text.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            text.innerText = text.innerText.split("").map((char, index) => {
                if (index < iterations) return original[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");
            if (iterations >= original.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    });
});

// --- Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- Blob Logic for SVG ---
const path = document.querySelector('.placeholder-img svg path');
if (path) {
    let t = 0;
    function animateBlob() {
        t += 0.01;
        path.style.transform = `translate(100 100) rotate(${t * 20}deg) scale(${1 + Math.sin(t) * 0.1})`;
        requestAnimationFrame(animateBlob);
    }
    animateBlob();
}

// --- Universal Hover Enhancement ---
const interactiveItems = document.querySelectorAll('.bento-item, .about-card, .certifications, .contact-card');
interactiveItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        if (item.querySelector('.contact-glow')) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mx', `${x}px`);
            item.style.setProperty('--my', `${y}px`);
        }
    });
});

// --- Skill Cloud Velocity ---
const skillChips = document.querySelectorAll('.skill-chip');
document.addEventListener('mousemove', (e) => {
    skillChips.forEach(chip => {
        const rect = chip.getBoundingClientRect();
        const chipX = rect.left + rect.width / 2;
        const chipY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - chipX, e.clientY - chipY);

        if (dist < 200) {
            const angle = Math.atan2(e.clientY - chipY, e.clientX - chipX);
            const force = (200 - dist) / 15;
            chip.style.transform = `translate(${Math.cos(angle) * -force}px, ${Math.sin(angle) * -force}px) scale(${1 + force / 50})`;
        } else {
            chip.style.transform = `translate(0, 0) scale(1)`;
        }
    });
});
// --- BG Particles ---
const canvas = document.createElement('canvas');
canvas.id = 'bg-particles';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Neural Connections ---
const neuralCanvas = document.getElementById('neural-canvas');
const nctx = neuralCanvas.getContext('2d');

function resizeNeural() {
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeNeural);
resizeNeural();

function drawNeural() {
    nctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    const elements = document.querySelectorAll('.bento-item, .about-card, .profile-frame');

    nctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    nctx.lineWidth = 1;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        if (dist < 300) {
            nctx.beginPath();
            nctx.moveTo(centerX, centerY);
            nctx.lineTo(mouseX, mouseY);
            nctx.stroke();

            // Draw small point at section center
            nctx.fillStyle = `rgba(0, 242, 255, ${1 - dist / 300})`;
            nctx.beginPath();
            nctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
            nctx.fill();
        }
    });
    requestAnimationFrame(drawNeural);
}
drawNeural();

// --- Terminal Simulation ---
const termLines = document.querySelectorAll('.term-line');
const logs = [
    "> SCANNING_PORTFOLIO...",
    "> ASSETS_INITIALIZED",
    "> DEPTH_REACHED",
    "> CORE_SYSTEM_NOMINAL",
    "> INNOVATION_ACTIVE",
    "> REDDY_CORE_ONLINE"
];

setInterval(() => {
    termLines.forEach((line, i) => {
        setTimeout(() => {
            line.innerText = logs[Math.floor(Math.random() * logs.length)];
            line.style.opacity = Math.random() * 0.5 + 0.5;
        }, i * 200);
    });
}, 3000);

// --- Scroll Progress & Navbar Shift ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / height) * 100;

    document.getElementById('scroll-progress').style.width = progress + '%';

    const nav = document.querySelector('.navbar');
    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Noise Parallax
    const noise = document.getElementById('noise');
    if (noise) {
        noise.style.transform = `translate(-25%, calc(-25% + ${scrollY * 0.05}px))`;
    }

    // Hero Name Parallax
    const heroH1 = document.querySelector('.magnetic-glitch');
    if (heroH1) {
        heroH1.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroH1.style.opacity = 1 - (scrollY / 500);
    }
});
