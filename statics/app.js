
/* ==========================================================================
   JOSEPH OCHELEBE — ENGINEERING PORTFOLIO
   File: statics/app.js

   Features:
   - Valid Person structured data for search engines
   - Accessible same-page smooth scrolling
   - Lightweight optional hero particle animation
   - Reduced-motion support
   - Visibility-aware animation lifecycle
   - Bootstrap accordion shimmer cleanup
   ========================================================================== */

(function () {
  "use strict";

  const CONFIG = {
    portfolioUrl: "https://neurobridge-portfolio-website.netlify.app/",
    particleCount: 36,
    particleColor: "67, 217, 232"
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const utils = {
    debounce(callback, delay = 150) {
      let timeout;

      return function (...args) {
        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
          callback.apply(this, args);
        }, delay);
      };
    },

    isElement(value) {
      return value instanceof Element;
    }
  };

  /* ==========================================================================
     1. SEARCH ENGINE STRUCTURED DATA
     ========================================================================== */

  function injectSchemaMarkup() {
    if (
      document.getElementById("portfolio-person-schema") ||
      document.querySelector('script[type="application/ld+json"]')
    ) {
      return;
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Joseph Ochelebe",
      "url": CONFIG.portfolioUrl,
      "jobTitle": "Software Engineer | AI and Autonomous Systems",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Abuja",
        "addressCountry": "NG"
      },
      "sameAs": [
        "https://www.linkedin.com/in/joseph-ochelebe-15a09588",
        "https://github.com/Joeches"
      ],
      "knowsAbout": [
        "Software Engineering",
        "Python Development",
        "Backend Engineering",
        "Artificial Intelligence",
        "Autonomous Systems",
        "Distributed Systems",
        "Financial Document Intelligence",
        "AI Agent Security",
        "Cloud Infrastructure",
        "Robotics",
        "Energy Systems"
      ]
    };

    const script = document.createElement("script");

    script.id = "portfolio-person-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  /* ==========================================================================
     2. ACCESSIBLE SAME-PAGE NAVIGATION
     ========================================================================== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        if (!href || href === "#") {
          return;
        }

        let target;

        try {
          target = document.querySelector(href);
        } catch {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start"
        });

        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }

        target.focus({
          preventScroll: true
        });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      });
    });
  }

  /* ==========================================================================
     3. OPTIONAL HERO PARTICLE ANIMATION
     ========================================================================== */

  function initQuantumParticles() {
    const hero = document.querySelector(".bg-gradient-hero");

    if (!hero || prefersReducedMotion.matches) {
      return;
    }

    if (typeof window.requestAnimationFrame !== "function") {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.setAttribute("aria-hidden", "true");

    canvas.style.cssText = [
      "position:absolute",
      "inset:0",
      "width:100%",
      "height:100%",
      "pointer-events:none",
      "z-index:0"
    ].join(";");

    const previousPosition = window.getComputedStyle(hero).position;

    if (previousPosition === "static") {
      hero.style.position = "relative";
    }

    hero.prepend(canvas);

    const particles = [];

    let width = 0;
    let height = 0;
    let animationFrame = null;
    let isVisible = true;
    let isRunning = false;

    const particleCount = window.innerWidth < 600
      ? Math.min(CONFIG.particleCount, 18)
      : CONFIG.particleCount;

    function resizeCanvas() {
      const bounds = hero.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.radius = Math.random() * 1.5 + 0.5;

        this.velocityX = (Math.random() - 0.5) * 0.28;
        this.velocityY = (Math.random() - 0.5) * 0.28;

        this.opacity = Math.random() * 0.35 + 0.12;

        if (!initial) {
          this.opacity *= 0.8;
        }
      }

      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0 || this.x > width) {
          this.velocityX *= -1;
        }

        if (this.y < 0 || this.y > height) {
          this.velocityY *= -1;
        }
      }

      draw() {
        context.beginPath();

        context.arc(
          this.x,
          this.y,
          this.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(${CONFIG.particleColor}, ${this.opacity})`;

        context.fill();
      }
    }

    function drawFrame() {
      if (!isRunning || !isVisible || document.hidden) {
        stopAnimation();
        return;
      }

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    function startAnimation() {
      if (
        isRunning ||
        !isVisible ||
        document.hidden ||
        prefersReducedMotion.matches
      ) {
        return;
      }

      isRunning = true;
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    function stopAnimation() {
      isRunning = false;

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    }

    function handleMotionPreferenceChange(event) {
      if (event.matches) {
        stopAnimation();
        canvas.remove();
      }
    }

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;

            if (isVisible) {
              startAnimation();
            } else {
              stopAnimation();
            }
          });
        }, {
          threshold: 0
        })
      : null;

    resizeCanvas();

    for (let index = 0; index < particleCount; index += 1) {
      particles.push(new Particle());
    }

    window.addEventListener(
      "resize",
      utils.debounce(resizeCanvas, 180),
      { passive: true }
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener(
        "change",
        handleMotionPreferenceChange
      );
    }

    if (observer) {
      observer.observe(hero);
    }

    startAnimation();
  }

  /* ==========================================================================
     4. GLITCH EFFECT VISIBILITY
     ========================================================================== */

  function initGlitchTriggers() {
    const elements = document.querySelectorAll(".glitch");

    if (!elements.length || !("IntersectionObserver" in window)) {
      return;
    }

    if (prefersReducedMotion.matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "glitch-active",
            entry.isIntersecting
          );
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ==========================================================================
     5. BOOTSTRAP ACCORDION ENHANCEMENTS
     ========================================================================== */

  function initAccordionEnhancements() {
    const accordions = document.querySelectorAll(".accordion");

    if (!accordions.length) {
      return;
    }

    accordions.forEach((accordion) => {
      accordion.addEventListener("shown.bs.collapse", (event) => {
        const item = event.target.closest(".accordion-item");

        if (!item) {
          return;
        }

        item.classList.remove("shimmer");
      });
    });
  }

  /* ==========================================================================
     6. EXTERNAL LINK SAFETY
     ========================================================================== */

  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const relValues = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute("rel", [...relValues].join(" "));
    });
  }

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */

  function init() {
    injectSchemaMarkup();
    initSmoothScroll();
    initQuantumParticles();
    initGlitchTriggers();
    initAccordionEnhancements();
    initExternalLinks();

    window.addEventListener("offline", () => {
      console.warn("Network connection unavailable.");
    });

    window.addEventListener("online", () => {
      console.info("Network connection restored.");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
