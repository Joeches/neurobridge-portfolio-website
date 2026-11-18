
/* ==========================================================================
   JOSEPH OCHELEBE — ENGINEERING PORTFOLIO
   Vanilla JavaScript enhancements
   Features:
   - Accessible smooth scrolling
   - Performance-conscious hero particle animation
   - Reduced-motion support
   - Visibility-aware animation
   - Glitch visibility handling
   - Accordion shimmer cleanup
   - Online/offline awareness

   ========================================================================== */

(function () {
  "use strict";

  /* ==========================================================================
     1. CONFIGURATION AND UTILITIES
     ========================================================================== */

  const CONFIG = {
    particleCount: 38,
    particleSpeed: 0.35,
    particleMaxSize: 2,
    particleOpacity: 0.45,
    resizeDebounce: 180
  };

  const prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  const utils = {
    debounce(fn, wait = 100) {
      let timeout;

      return (...args) => {
        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
          fn(...args);
        }, wait);
      };
    },

    isVisible(element) {
      if (!element) return false;

      const rect = element.getBoundingClientRect();

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
      );
    }
  };

  /* ==========================================================================
     2. ACCESSIBLE SMOOTH SCROLLING
     ========================================================================== */

  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        if (!href || href === "#") return;

        let target;

        try {
          target = document.querySelector(href);
        } catch {
          return;
        }

        if (!target) return;

        // Preserve normal browser behavior for modified clicks.
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start"
        });

        // Update the URL without causing an additional page jump.
        if (history.replaceState) {
          history.replaceState(null, "", href);
        }

        // Move keyboard focus to the destination when possible.
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }

        target.focus({ preventScroll: true });
      });
    });
  }

  /* ==========================================================================
     3. HERO PARTICLE FIELD
     ========================================================================== */

  function initQuantumParticles() {
    const hero = document.querySelector(".bg-gradient-hero");

    if (!hero) return;

    // Avoid decorative animation for visitors who request reduced motion.
    if (prefersReducedMotion.matches) return;

    // Avoid unnecessary work when the browser does not support canvas.
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.setAttribute("aria-hidden", "true");

    canvas.style.cssText = [
      "position:absolute",
      "inset:0",
      "width:100%",
      "height:100%",
      "pointer-events:none",
      "z-index:0",
      "opacity:0.45"
    ].join(";");

    // Ensure hero content remains above the decorative canvas.
    const originalPosition = window.getComputedStyle(hero).position;

    if (originalPosition === "static") {
      hero.style.position = "relative";
    }

    hero.prepend(canvas);

    Array.from(hero.children).forEach((child) => {
      if (child === canvas) return;

      child.style.position =
        child.style.position || "relative";

      child.style.zIndex =
        child.style.zIndex || "1";
    });

    let width = 0;
    let height = 0;
    let animationFrame = null;
    let particles = [];

    let isPageVisible = !document.hidden;
    let isHeroVisible = false;
    let isRunning = false;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = hero.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      particles.forEach((particle) => {
        particle.x = Math.min(particle.x, width);
        particle.y = Math.min(particle.y, height);
      });
    }

    class QuantumParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.size =
          Math.random() * CONFIG.particleMaxSize + 0.5;

        this.vx =
          (Math.random() - 0.5) * CONFIG.particleSpeed;

        this.vy =
          (Math.random() - 0.5) * CONFIG.particleSpeed;

        this.opacity =
          Math.random() * CONFIG.particleOpacity + 0.1;

        this.hue =
          180 + Math.random() * 55;

        this.life = 0.5 + Math.random() * 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) {
          this.vx *= -1;
        }

        if (this.y < 0 || this.y > height) {
          this.vy *= -1;
        }

        this.life -= 0.0005;

        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();

        ctx.globalAlpha = this.opacity * this.life;

        ctx.fillStyle =
          `hsla(${this.hue}, 90%, 70%, 1)`;

        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.size,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
    }

    function animate() {
      if (!isRunning) return;

      drawParticles();

      animationFrame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (isRunning) return;

      if (!isPageVisible || !isHeroVisible) return;

      isRunning = true;
      animationFrame = window.requestAnimationFrame(animate);
    }

    function stopAnimation() {
      isRunning = false;

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function updateAnimationState() {
      if (isPageVisible && isHeroVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }

    resize();

    particles = Array.from(
      { length: CONFIG.particleCount },
      () => new QuantumParticle()
    );

    // Detect whether the hero is visible before animating.
    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isHeroVisible = entry.isIntersecting;
          });

          updateAnimationState();
        },
        { threshold: 0.05 }
      );

      heroObserver.observe(hero);
    } else {
      isHeroVisible = utils.isVisible(hero);
    }

    // Pause the animation when the browser tab is hidden.
    document.addEventListener("visibilitychange", () => {
      isPageVisible = !document.hidden;
      updateAnimationState();
    });

    // Respond to browser resizing.
    window.addEventListener(
      "resize",
      utils.debounce(resize, CONFIG.resizeDebounce),
      { passive: true }
    );

    // Monitor layout changes when supported.
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(
        utils.debounce(resize, CONFIG.resizeDebounce)
      );

      resizeObserver.observe(hero);
    }

    updateAnimationState();
  }

  /* ==========================================================================
     4. GLITCH VISIBILITY HANDLING
     ========================================================================== */

  function initGlitchTriggers() {
    const glitchElements = document.querySelectorAll(".glitch");

    if (!glitchElements.length) return;

    if (prefersReducedMotion.matches) {
      glitchElements.forEach((element) => {
        element.classList.remove("glitch-active");
      });

      return;
    }

    if (!("IntersectionObserver" in window)) return;

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
        threshold: 0.4,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    glitchElements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ==========================================================================
     5. ACCORDION SHIMMER CLEANUP
     ========================================================================== */

  function initShimmerControl() {
    const accordionButtons = document.querySelectorAll(
      ".accordion-button"
    );

    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".accordion-item");

        if (!item) return;

        // Stop the shimmer after the accordion interaction.
        window.setTimeout(() => {
          item.classList.remove("shimmer");
        }, 800);
      });
    });
  }

  /* ==========================================================================
     6. NETWORK STATUS AWARENESS
     ========================================================================== */

  function initNetworkAwareness() {
    window.addEventListener("offline", () => {
      console.warn(
        "Network connection unavailable. Some external resources may not load."
      );
    });

    window.addEventListener("online", () => {
      console.info("Network connection restored.");
    });
  }

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */

  function init() {
    initSmoothScroll();
    initQuantumParticles();
    initGlitchTriggers();
    initShimmerControl();
    initNetworkAwareness();

    console.info(
      "Engineering portfolio initialized successfully."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
