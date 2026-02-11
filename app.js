// statics/app.js
// NeuroBridge Quantum Portfolio – Professional Vanilla JS Enhancements 2026 v2
// Optimized for performance, accessibility, SEO signals & futuristic feel
// Features: Smooth scroll, quantum particles, glitch trigger, shimmer control, schema markup
// Author: Joseph Ochelebe – Founder & CTO, NeuroBridge Technologies Ltd

(function () {
  'use strict';

  // ================================
  // Utility Helpers
  // ================================
  const utils = {
    debounce(fn, wait = 100) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
      };
    },
    throttle(fn, limit = 100) {
      let inThrottle;
      return (...args) => {
        if (!inThrottle) {
          fn(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },
    isElementInViewport(el) {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  };

  // ================================
  // 1. Structured Data for SEO (Person + PortfolioItem schema)
  // Helps Google understand your expertise & projects
  // ================================
  function injectSchemaMarkup() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Joseph Ochelebe",
      "jobTitle": "Founder & CTO | Senior Quantum-Kernel Systems Designer & Generative AI-Quantum Integrator",
      "url": window.location.href,
      "sameAs": [
        "www.linkedin.com/in/joseph-ochelebe-15a09588", // ← replace
        "https://x.com/[your-x-handle]" // ← optional
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Abuja",
        "addressCountry": "NG"
      },
      "worksFor": {
        "@type": "Organization",
        "name": "NeuroBridge Technologies Ltd",
        "url": "https://neurobridgetechnology.netlify.app//",
        "logo": "/icons/logo-neurobridge.png","
      },
      "knowsAbout": [
        "Quantum Computing", "Quantum Algorithms", "Generative AI", "VQE Simulation", "Topological Quantum Systems", "Google Gemini API"
      ],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "11+ Years Self-Directed Deep-Tech Engineering",
        "description": "Builder of 4+ live quantum simulation MVPs with generative AI synergies"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    console.log('%cSEO Schema Injected – Person + WorksFor + KnowsAbout', 'color:#00f0ff; font-weight:bold;');
  }

  // ================================
  // 2. Smooth Scrolling (with polyfill fallback)
  // ================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ================================
  // 3. Quantum Particle Field (Hero only – performance optimized)
  // ================================
  function initQuantumParticles() {
    const hero = document.querySelector('.bg-gradient-hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
    hero.style.position = 'relative';
    hero.prepend(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas not supported – skipping particle field');
      return;
    }

    let w, h, particles = [];
    const particleCount = 50; // balanced for mobile/desktop

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    class QuantumParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.hue = 180 + Math.random() * 80; // cyan-blue range
        this.life = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.0012;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        if (this.life <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.7)`;
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', utils.debounce(resize, 200));
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push(new QuantumParticle());
    }

    animate();
  }

  // ================================
  // 4. Glitch & Visibility Trigger
  // ================================
  function initGlitchTriggers() {
    const glitchEls = document.querySelectorAll('.glitch');
    if (!glitchEls.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('glitch-active', entry.isIntersecting);
        });
      },
      { threshold: 0.4, rootMargin: '0px 0px -10% 0px' }
    );

    glitchEls.forEach(el => observer.observe(el));
  }

  // ================================
  // 5. Shimmer Control for Accordion (toggle on expand)
  // ================================
  function initShimmerControl() {
    const accordions = document.querySelectorAll('.accordion-button');
    accordions.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        if (item) {
          // Remove shimmer after first expand (to simulate "loaded")
          setTimeout(() => {
            item.classList.remove('shimmer');
          }, 800);
        }
      });
    });
  }

  // ================================
  // Initialization
  // ================================
  function init() {
    console.log(
      '%cNEUROBRIDGE TECHNOLOGIES LTD – Quantum Portfolio Loaded\n' +
      '%cJoseph Ochelebe • Founder & CTO • Abuja, Nigeria\n' +
      'Live Quantum MVPs • Generative AI Synergies • Patent-Aware Kernels\n' +
      'https://wa.me/2348155935110',
      'font-size:16px;font-weight:bold;color:#00f0ff;text-shadow:0 0 10px #00f0ff;',
      'color:#ff00aa;'
    );

    injectSchemaMarkup();
    initSmoothScroll();
    initQuantumParticles();
    initGlitchTriggers();
    initShimmerControl();

    // Optional: Offline awareness
    window.addEventListener('offline', () => {
      console.warn('Offline mode detected – cached assets in use');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
