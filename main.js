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
const magnetics = document.querySelectorAll('.magnetic, .btn, .nav-item');
magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.05)`;
        follower.style.transform = 'scale(1.5)';
        follower.style.borderColor = '#00f2ff';
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0) scale(1)';
        follower.style.transform = 'scale(1)';
        follower.style.borderColor = 'rgba(255,255,255,0.2)';
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

// --- Universal Holographic Tilt ---
const holographicItems = document.querySelectorAll('.holographic');
holographicItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Intensity check (stronger for smaller items)
        const intensity = item.classList.contains('bento-item') ? 15 : 25;

        const rotateX = (y - rect.height / 2) / intensity;
        const rotateY = -(x - rect.width / 2) / intensity;
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

        // Internal Flashlight if needed
        if (item.querySelector('.contact-glow')) {
            item.style.setProperty('--mx', `${x}px`);
            item.style.setProperty('--my', `${y}px`);
        }
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
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
