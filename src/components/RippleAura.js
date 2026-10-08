/**
 * RippleAura.js
 * Renders an animated concentric purple ripple aura expanding from inside to outside
 * behind the hero avatar, inspired by Christoffel's visual identity.
 * 
 * Karakteristik Cincin:
 * - Skala keseluruhan disesuaikan menjadi ~75% lebih kompak agar pas membingkai avatar & petir
 * - Sangat tebal di bagian tengah (~12.5px) sehingga memberikan kesan lingkaran solid di dekat avatar
 * - Berangsur-angsur menipis secara teratur saat bergerak keluar (~0.85px)
 * - Gelombang memancar terus-menerus dari dalam keluar secara mulus (60fps)
 */

export class RippleAura {
  constructor({ canvasId = 'ripple-aura-canvas', containerId = 'avatar-hero-stage', avatarId = 'avatar-hero-img' } = {}) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.avatar = document.getElementById(avatarId);

    if (!this.canvas) {
      console.warn(`RippleAura: Canvas #${canvasId} not found.`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.isVisible = true;

    // Ripple parameters (Ukuran ringkas ~75%)
    this.ringSpacing = 7.2;       // Jarak antar lingkaran (px)
    this.baseSpeed = 0.35;        // Kecepatan gerak keluar (px/frame)
    this.currentSpeed = 0.35;
    this.targetSpeed = 0.35;
    this.offset = 0;              // Fase gelombang radial

    // Ketebalan dinamis (tebal pekat di tengah, menipis ke luar)
    this.maxLineWidth = 12.5;     // Tebal pusat (~12.5px, saling merapat / hampir solid)
    this.minLineWidth = 0.85;     // Menipis saat keluar (~0.85px)

    // Dimensi & Titik Pusat
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.cx = 0;
    this.cy = 0;
    this.minRadius = 38;
    this.maxRadius = 290;

    // Parallax interaktif
    this.mouseTarget = { x: 0, y: 0 };
    this.mouseCurrent = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.handleResize();
    this.bindEvents();
    this.start();
  }

  handleResize() {
    if (!this.canvas) return;

    const rect = this.canvas.parentElement 
      ? this.canvas.parentElement.getBoundingClientRect()
      : this.canvas.getBoundingClientRect();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width || 850;
    this.height = rect.height || 650;

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.cx = this.width / 2;
    this.cy = this.height / 2;

    // Skala ripple 75%: radius maksimal ~290px agar pas membingkai kepala & petir
    const minDim = Math.min(this.width, this.height);
    this.maxRadius = Math.min(290, minDim * 0.44);
    this.minRadius = Math.max(36, this.maxRadius * 0.13);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize());

    // Mouse Parallax di dalam hero stage
    if (this.container) {
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        this.mouseTarget.x = nx * 10;
        this.mouseTarget.y = ny * 10;
      });

      this.container.addEventListener('mouseleave', () => {
        this.mouseTarget.x = 0;
        this.mouseTarget.y = 0;
        this.targetSpeed = this.baseSpeed;
      });

      // Hover avatar: sedikit akselerasi gelombang ripple
      if (this.avatar) {
        this.avatar.addEventListener('mouseenter', () => {
          this.targetSpeed = this.baseSpeed * 1.8;
        });
        this.avatar.addEventListener('mouseleave', () => {
          this.targetSpeed = this.baseSpeed;
        });
      }
    }

    // Hemat daya: jeda render saat elemen tidak terlihat di layar
    if ('IntersectionObserver' in window && this.canvas) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible && !this.animationId) {
            this.loop();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.canvas);
    }
  }

  start() {
    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    if (!this.isVisible) {
      this.animationId = null;
      return;
    }

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Lerp kecepatan ripple
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.08;

    // Gerak dari dalam keluar: offset bertambah maju
    this.offset = (this.offset + this.currentSpeed) % this.ringSpacing;

    // Smooth lerp mouse parallax
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.05;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.05;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Bersihkan canvas
    ctx.clearRect(0, 0, this.width, this.height);

    const centerX = this.cx + this.mouseCurrent.x;
    const centerY = this.cy + this.mouseCurrent.y;

    // Gambar lingkaran konsentris dari dalam keluar (skala 75%)
    for (let r = this.minRadius + this.offset; r <= this.maxRadius; r += this.ringSpacing) {
      const t = (r - this.minRadius) / (this.maxRadius - this.minRadius);
      const clampedT = Math.max(0, Math.min(1, t));

      // Ketebalan dinamis: tebal pekat di tengah (~12.5px), berangsur menipis ke luar (~0.85px)
      const currentLineWidth = (this.maxLineWidth - this.minLineWidth) * Math.pow(1 - clampedT, 1.35) + this.minLineWidth;

      // Hitung opacity: lembut saat muncul di pusat dan pudar di perimeter luar
      let alpha = 1.0;
      if (r < this.minRadius + 14) {
        alpha = (r - this.minRadius) / 14;
      } else if (r > this.maxRadius - 45) {
        alpha = (this.maxRadius - r) / 45;
      }

      // Pekat di tengah (0.97), berangsur lebih ringan ke luar
      alpha = Math.max(0, Math.min(1, alpha)) * (0.97 - clampedT * 0.25);

      // Warna ungu violet sesuai referensi mockup (#7c3aed / rgb(124, 58, 237))
      ctx.lineWidth = currentLineWidth;
      ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
