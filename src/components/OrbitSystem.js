/**
 * OrbitSystem.js
 * Renders an animated tilted purple elliptical orbit and revolving 3D planets.
 * Planets are spherical-masked itch.io game thumbnails with realistic inner shadows.
 * As planets move behind the central avatar (Christoffel), they smoothly fade to transparent.
 */

export class OrbitSystem {
  constructor({
    containerId = 'avatar-hero-stage',
    planetsData = [],
    onPlanetClick = null
  } = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`OrbitSystem: Container #${containerId} not found.`);
      return;
    }

    this.onPlanetClick = onPlanetClick;
    this.animationId = null;
    this.isHovered = false;
    this.hoverSpeedMultiplier = 1.0;

    // Orbit mathematical parameters
    this.tiltDeg = -11.0;
    this.tiltRad = (this.tiltDeg * Math.PI) / 180;
    this.cosT = Math.cos(this.tiltRad);
    this.sinT = Math.sin(this.tiltRad);

    this.baseSpeed = 0.0055; // Hypnotic ~18s per complete revolution
    this.currentAngle = Math.PI * 0.88; // Start Warmth & Whistles in lower-left matching reference mockup

    // Responsive dimensions
    this.width = 960;
    this.height = 640;
    this.cx = 480;
    this.cy = 340;
    this.Ra = 465;
    this.Rb = 70;
    this.planetBaseSize = 82;

    // Games to orbit (from itch.io)
    this.planetsList = planetsData.length > 0 ? planetsData : [
      {
        id: 'art-warmth',
        title: 'Warmth & Whistles',
        image: './images/warmth.png',
        tag: 'Cozy Tea Sim',
        itchUrl: 'https://summerland-games.itch.io/warmth-and-whistles'
      },
      {
        id: 'art-alchefmist',
        title: 'Alchefmist',
        image: './images/alchefmist.png',
        tag: 'Alchemy Deckbuilder',
        itchUrl: 'https://christoffel.itch.io/alchefmist'
      },
      {
        id: 'art-doomscroll',
        title: 'Doom Scrolling',
        image: './images/doom-scroll.png',
        tag: 'Satirical Roguelike',
        itchUrl: 'https://summerland-games.itch.io/doom-scroll'
      },
      {
        id: 'art-nightride',
        title: 'Night Ride',
        image: './images/night-ride.png',
        tag: 'Visual Journey',
        itchUrl: 'https://christoffel.itch.io/night-ride'
      }
    ];

    this.planetElements = [];
    this.init();
  }

  init() {
    this.createDOM();
    this.handleResize();
    this.bindEvents();
    this.start();
  }

  createDOM() {
    // 1. Back Layer (rendered behind avatar-frame: z-index: 2)
    this.orbitBackLayer = document.createElement('div');
    this.orbitBackLayer.className = 'hero-orbit-system hero-orbit-back';
    this.orbitBackLayer.id = 'hero-orbit-back';

    // 2. Front Layer (rendered in front of avatar-frame: z-index: 20)
    this.orbitFrontLayer = document.createElement('div');
    this.orbitFrontLayer.className = 'hero-orbit-system hero-orbit-front';
    this.orbitFrontLayer.id = 'hero-orbit-front';

    // 3. SVG Ellipse Orbit Track (placed in back layer so track line stays behind avatar)
    this.svgTrack = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgTrack.setAttribute('class', 'orbit-track-svg');
    this.svgTrack.setAttribute('aria-hidden', 'true');

    this.ellipsePath = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    this.ellipsePath.setAttribute('class', 'orbit-track-ellipse');
    this.svgTrack.appendChild(this.ellipsePath);

    this.orbitBackLayer.appendChild(this.svgTrack);

    // 4. Planet DOM nodes
    const planetCount = this.planetsList.length;
    this.planetElements = this.planetsList.map((p, index) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'orbit-planet-btn';
      el.setAttribute('aria-label', `Play ${p.title} on itch.io`);
      el.setAttribute('title', `${p.title} (${p.tag}) — Klik untuk melihat karya`);

      // Planet thumbnail image (masked to circle)
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.title;
      img.className = 'orbit-planet-thumb';
      img.draggable = false;

      // 3D Spherical inner shadow & specular highlight overlay
      const shade = document.createElement('div');
      shade.className = 'orbit-planet-shade';
      shade.setAttribute('aria-hidden', 'true');

      // Comic badge tooltip on hover
      const tooltip = document.createElement('div');
      tooltip.className = 'orbit-planet-tooltip';
      tooltip.innerHTML = `<span class="tooltip-title">${p.title}</span><span class="tooltip-tag">${p.tag}</span>`;

      el.appendChild(img);
      el.appendChild(shade);
      el.appendChild(tooltip);

      // Event listener for planet click
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof this.onPlanetClick === 'function') {
          this.onPlanetClick(p);
        } else if (p.itchUrl) {
          window.open(p.itchUrl, '_blank', 'noopener');
        }
      });

      // Hover slowdown
      el.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });
      el.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });

      // Initially append to back layer
      this.orbitBackLayer.appendChild(el);

      return {
        element: el,
        data: p,
        phaseOffset: index * ((Math.PI * 2) / planetCount)
      };
    });

    // Insert back layer before avatar-frame
    this.container.insertBefore(this.orbitBackLayer, this.container.firstChild);
    // Append front layer after avatar-frame
    this.container.appendChild(this.orbitFrontLayer);
  }

  handleResize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 960;
    this.height = rect.height || 640;

    this.cx = this.width / 2;
    // Centered with the avatar frame
    this.cy = this.height * 0.50;

    // Responsive radii
    this.Ra = Math.min(465, this.width * 0.485);
    this.Rb = Math.max(38, this.Ra * 0.15);

    // Planet size responsive scaling
    if (this.width < 480) {
      this.planetBaseSize = 52;
    } else if (this.width < 768) {
      this.planetBaseSize = 64;
    } else {
      this.planetBaseSize = 82;
    }

    // Update SVG viewBox and ellipse
    this.svgTrack.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.ellipsePath.setAttribute('cx', this.cx);
    this.ellipsePath.setAttribute('cy', this.cy);
    this.ellipsePath.setAttribute('rx', this.Ra);
    this.ellipsePath.setAttribute('ry', this.Rb);
    this.ellipsePath.setAttribute('transform', `rotate(${this.tiltDeg}, ${this.cx}, ${this.cy})`);

    // Force an update frame
    this.updatePlanets();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize());
  }

  start() {
    const loop = () => {
      // Smoothly interpolate speed on hover (slow down to 20% on hover for easier clicking)
      const targetMultiplier = this.isHovered ? 0.2 : 1.0;
      this.hoverSpeedMultiplier += (targetMultiplier - this.hoverSpeedMultiplier) * 0.08;

      this.currentAngle += this.baseSpeed * this.hoverSpeedMultiplier;
      if (this.currentAngle > Math.PI * 2) {
        this.currentAngle -= Math.PI * 2;
      }

      this.updatePlanets();
      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  updatePlanets() {
    for (let i = 0; i < this.planetElements.length; i++) {
      const p = this.planetElements[i];
      const angle = this.currentAngle + p.phaseOffset;

      // Parametric coordinates on tilted ellipse
      const u = this.Ra * Math.cos(angle);
      const v = this.Rb * Math.sin(angle);

      // Rotate by tilt angle
      const x = this.cx + u * this.cosT - v * this.sinT;
      const y = this.cy + u * this.sinT + v * this.cosT;

      // depth: Math.sin(angle)
      // > 0 is front (in front of avatar), < 0 is back (behind avatar)
      const depth = Math.sin(angle);

      let scale = 1.0;
      let opacity = 1.0;

      if (depth > 0) {
        // Front half of orbit: IN FRONT OF AVATAR (orbitFrontLayer, z-index: 20)
        scale = 0.95 + depth * 0.16; // 0.95 -> 1.11
        opacity = 1.0;
        if (p.element.parentNode !== this.orbitFrontLayer) {
          this.orbitFrontLayer.appendChild(p.element);
        }
      } else {
        // Back half of orbit: BEHIND AVATAR (orbitBackLayer, z-index: 2)
        scale = 0.95 + depth * 0.16; // 0.79 -> 0.95
        // Smoothly fade to transparent when in the back
        opacity = Math.max(0, 1 + depth * 1.25);
        if (p.element.parentNode !== this.orbitBackLayer) {
          this.orbitBackLayer.appendChild(p.element);
        }
      }

      const size = this.planetBaseSize;
      const halfSize = size / 2;

      // Apply transform and styling
      p.element.style.width = `${size}px`;
      p.element.style.height = `${size}px`;
      p.element.style.transform = `translate3d(${x - halfSize}px, ${y - halfSize}px, 0) scale(${scale.toFixed(3)})`;
      p.element.style.opacity = opacity.toFixed(3);

      // Disable pointer events if completely transparent in back
      if (opacity <= 0.08) {
        p.element.style.pointerEvents = 'none';
      } else {
        p.element.style.pointerEvents = 'auto';
      }
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    if (this.orbitBackLayer && this.orbitBackLayer.parentNode) {
      this.orbitBackLayer.parentNode.removeChild(this.orbitBackLayer);
    }
    if (this.orbitFrontLayer && this.orbitFrontLayer.parentNode) {
      this.orbitFrontLayer.parentNode.removeChild(this.orbitFrontLayer);
    }
  }
}
