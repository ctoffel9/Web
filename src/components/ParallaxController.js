/**
 * ParallaxController.js
 * High-performance smooth parallax scrolling engine for Christoffel's portfolio.
 * 
 * Features:
 * - Multiplane differential depth (Deep Space Stars, Halftone Staging, Ripple Aura, Orbit, Lightning, Burst Buttons, Flipbook Stage)
 * - Decoupled requestAnimationFrame with silky smooth momentum lerp
 * - 0% idle CPU usage (stops RAF loop automatically when scroll momentum settles)
 * - Uses CSS custom properties for transforms, preserving hover animations, transitions, and keyframes
 * - GPU-accelerated hardware compositing (translate3d)
 * - Responsive: adapts amplitude on mobile, respects prefers-reduced-motion
 */

export class ParallaxController {
  constructor() {
    // Check user preference for reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReducedMotion) {
      console.log('ParallaxController: Reduced motion preferred, parallax disabled.');
      return;
    }

    this.targetY = window.scrollY || window.pageYOffset || 0;
    this.currentY = this.targetY;
    this.rafId = null;
    this.isTicking = false;
    this.lerpFactor = 0.12;

    // Cache DOM Elements
    this.starsEl = document.querySelector('.space-stars-bg');
    this.halftoneEl = document.querySelector('.halftone-bleed-bg');
    this.heroStage = document.getElementById('avatar-hero-stage');
    this.rippleCanvas = document.getElementById('ripple-aura-canvas');
    this.orbitSystem = document.querySelector('.hero-orbit-system');
    this.lightningLeft = document.getElementById('lightning-left');
    this.lightningRight = document.getElementById('lightning-right');
    this.btnGame = document.getElementById('hero-btn-game');
    this.btnIllus = document.getElementById('hero-btn-illus');
    this.bookletSection = document.getElementById('booklet-section');
    this.flipbookStage = document.getElementById('flipbook-stage');

    this.isMobile = window.innerWidth <= 768;

    this.init();
  }

  init() {
    this.bindEvents();
    // Render initial position
    this.render();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.targetY = Math.max(0, window.scrollY || window.pageYOffset || 0);
      this.startLoop();
    }, { passive: true });

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.targetY = Math.max(0, window.scrollY || window.pageYOffset || 0);
      this.startLoop();
    }, { passive: true });
  }

  startLoop() {
    if (!this.isTicking) {
      this.isTicking = true;
      this.tick();
    }
  }

  tick() {
    const diff = this.targetY - this.currentY;

    if (Math.abs(diff) > 0.05) {
      this.currentY += diff * this.lerpFactor;
      this.render();
      this.rafId = requestAnimationFrame(() => this.tick());
    } else {
      this.currentY = this.targetY;
      this.render();
      this.isTicking = false;
    }
  }

  render() {
    const y = this.currentY;
    const factor = this.isMobile ? 0.45 : 1.0;

    // 1. Deep Space Stars Layer (slowest background drift: moves at 55% relative scroll speed)
    if (this.starsEl) {
      const starsY = (y * 0.45 * factor).toFixed(2);
      this.starsEl.style.setProperty('--parallax-stars-y', `${starsY}px`);
    }

    // 2. Purple Halftone Bleed Layer (midground staging + smooth fade out into deep space)
    if (this.halftoneEl) {
      const halftoneY = (y * 0.32 * factor).toFixed(2);
      const hFade = Math.max(0, 1 - y / 560);
      const opacity = (0.50 * hFade).toFixed(3);
      this.halftoneEl.style.setProperty('--parallax-halftone-y', `${halftoneY}px`);
      this.halftoneEl.style.setProperty('--parallax-halftone-opacity', opacity);
    }

    // 3. Hero Avatar Stage (gentle lift, scale and fade out into booklet section)
    if (this.heroStage) {
      const stageY = (y * 0.22 * factor).toFixed(2);
      const stageScale = Math.max(0.88, 1 - y * 0.0003 * factor).toFixed(4);
      const stageOpacity = Math.max(0, 1 - y / 500).toFixed(3);
      this.heroStage.style.setProperty('--parallax-stage-y', `${stageY}px`);
      this.heroStage.style.setProperty('--parallax-stage-scale', stageScale);
      this.heroStage.style.setProperty('--parallax-stage-opacity', stageOpacity);
    }

    // 4. Ripple Aura Canvas (differential vertical drift)
    if (this.rippleCanvas) {
      const auraY = (y * 0.16 * factor).toFixed(2);
      this.rippleCanvas.style.setProperty('--parallax-aura-y', `${auraY}px`);
    }

    // 5. Orbit System & Revolving 3D Planets (differential depth)
    const orbitLayers = document.querySelectorAll('.hero-orbit-system');
    if (orbitLayers.length > 0) {
      const orbitY = (y * 0.12 * factor).toFixed(2);
      orbitLayers.forEach(layer => layer.style.setProperty('--parallax-orbit-y', `${orbitY}px`));
    }

    // 6. Lightning Ornaments (outward flare into the cosmos as scroll increases)
    if (this.lightningLeft) {
      const lx = (-y * 0.14 * factor).toFixed(2);
      const ly = (y * 0.08 * factor).toFixed(2);
      const rot = (-y * 0.025 * factor).toFixed(2);
      this.lightningLeft.style.setProperty('--parallax-lightning-lx', `${lx}px`);
      this.lightningLeft.style.setProperty('--parallax-lightning-ly', `${ly}px`);
      this.lightningLeft.style.setProperty('--parallax-lightning-lrot', `${rot}deg`);
    }

    if (this.lightningRight) {
      const rx = (y * 0.14 * factor).toFixed(2);
      const ry = (y * 0.08 * factor).toFixed(2);
      const rot = (y * 0.025 * factor).toFixed(2);
      this.lightningRight.style.setProperty('--parallax-lightning-rx', `${rx}px`);
      this.lightningRight.style.setProperty('--parallax-lightning-ry', `${ry}px`);
      this.lightningRight.style.setProperty('--parallax-lightning-rrot', `${rot}deg`);
    }

    // 7. Pop-Art Burst Buttons (GAME & ILLUS 3D pop-out depth)
    if (this.btnGame) {
      const gx = (-y * 0.10 * factor).toFixed(2);
      const gy = (-y * 0.06 * factor).toFixed(2);
      this.btnGame.style.setProperty('--parallax-game-x', `${gx}px`);
      this.btnGame.style.setProperty('--parallax-game-y', `${gy}px`);
    }

    if (this.btnIllus) {
      const ix = (y * 0.10 * factor).toFixed(2);
      const iy = (y * 0.06 * factor).toFixed(2);
      this.btnIllus.style.setProperty('--parallax-illus-x', `${ix}px`);
      this.btnIllus.style.setProperty('--parallax-illus-y', `${iy}px`);
    }

    // 8. Flipbook Stage (smooth upward float as booklet enters viewport)
    if (this.flipbookStage && this.bookletSection) {
      const rect = this.bookletSection.getBoundingClientRect();
      const winH = window.innerHeight;

      if (rect.top < winH && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (winH - rect.top) / winH));
        const stageShift = ((1 - progress) * 48 * factor).toFixed(2);
        this.flipbookStage.style.setProperty('--parallax-flipbook-y', `${stageShift}px`);
      } else if (rect.top >= winH) {
        const stageShift = (48 * factor).toFixed(2);
        this.flipbookStage.style.setProperty('--parallax-flipbook-y', `${stageShift}px`);
      } else {
        this.flipbookStage.style.setProperty('--parallax-flipbook-y', '0px');
      }
    }
  }
}
