import { PageFlip } from 'page-flip';

export class FlipbookViewer {
  constructor(options = {}) {
    this.containerId = options.containerId || 'flipbook-container';
    this.stageId = options.stageId || 'flipbook-stage';
    this.totalPages = options.totalPages || 36;
    this.imagePathPrefix = options.imagePathPrefix || './booklet/page-';
    this.imagePathSuffix = options.imagePathSuffix || '.jpg';
    this.pdfUrl = options.pdfUrl || './portfolio-booklet.pdf';
    this.gdriveUrl = options.gdriveUrl || 'https://drive.google.com/file/d/1_IcNi_hYaTUt0jeGm1EPHhMi_WOhiaVU/view?usp=sharing';

    this.pageFlip = null;
    this.startPage = options.startPage !== undefined ? options.startPage : 3; // Default to Page 4 (0-indexed: 3)
    this.currentPage = this.startPage;
    this.isThumbnailsOpen = false;

    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    this.stage = document.getElementById(this.stageId);
    if (!this.container) return;

    this.initPageFlip();
    this.bindControls();
    this.buildThumbnailStrip();
    this.bindKeyboard();
  }

  initPageFlip() {
    this.container.innerHTML = '';

    // Generate HTML page elements for DOM-based rendering
    for (let i = 1; i <= this.totalPages; i++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'book-page';
      // First and last pages are hard covers
      if (i === 1 || i === this.totalPages) {
        pageDiv.dataset.density = 'hard';
      } else {
        pageDiv.dataset.density = 'soft';
      }

      const img = document.createElement('img');
      img.src = `${this.imagePathPrefix}${i}${this.imagePathSuffix}`;
      img.alt = `Page ${i}`;
      img.className = 'book-page-img';
      img.draggable = false;
      // Preload active spread (pages 3-6) eagerly, lazy load others
      img.loading = (i >= 3 && i <= 6) ? 'eager' : 'lazy';

      pageDiv.appendChild(img);
      this.container.appendChild(pageDiv);
    }

    try {
      this.pageFlip = new PageFlip(this.container, {
        width: 750,
        height: 530, // Landscape ratio 1.414 (750 / 1.414 ~ 530)
        size: 'stretch',
        minWidth: 320,
        maxWidth: 1600,
        minHeight: 226,
        maxHeight: 1130,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: true,
        flippingTime: 700,
        drawShadow: true,
        startPage: this.startPage,
        showPageCorners: true,
        useMouseEvents: true,
        clickEventForward: true
      });

      this.pageFlip.loadFromHTML(this.container.querySelectorAll('.book-page'));

      // Event listener saat halaman selesai dibalik
      this.pageFlip.on('flip', (e) => {
        this.currentPage = e.data;
        this.updateUI();
        this.playFlipSound();
      });

      this.pageFlip.on('init', () => {
        this.currentPage = this.pageFlip.getCurrentPageIndex();
        if (this.currentPage !== this.startPage) {
          try {
            this.pageFlip.turnToPage(this.startPage);
            this.currentPage = this.startPage;
          } catch (_) {}
        }
        this.updateUI();
      });

      // Handle window resize smoothly
      window.addEventListener('resize', () => {
        if (this.pageFlip) {
          try {
            this.pageFlip.update();
          } catch (_) {}
        }
      });
    } catch (err) {
      console.error('Error initializing PageFlip:', err);
    }
  }

  bindControls() {
    const prevBtn = document.getElementById('book-prev-btn');
    const nextBtn = document.getElementById('book-next-btn');
    const firstBtn = document.getElementById('book-first-btn');
    const lastBtn = document.getElementById('book-last-btn');
    const slider = document.getElementById('book-slider');
    const fullscreenBtn = document.getElementById('book-fullscreen-btn');
    const thumbsToggleBtn = document.getElementById('book-thumbs-toggle');

    prevBtn?.addEventListener('click', () => {
      if (this.pageFlip) this.pageFlip.flipPrev();
    });

    nextBtn?.addEventListener('click', () => {
      if (this.pageFlip) this.pageFlip.flipNext();
    });

    firstBtn?.addEventListener('click', () => {
      if (this.pageFlip) this.pageFlip.turnToPage(0);
    });

    lastBtn?.addEventListener('click', () => {
      if (this.pageFlip) this.pageFlip.turnToPage(this.totalPages - 1);
    });

    slider?.addEventListener('input', (e) => {
      const pageTarget = parseInt(e.target.value, 10) - 1;
      if (this.pageFlip && pageTarget >= 0 && pageTarget < this.totalPages) {
        this.pageFlip.turnToPage(pageTarget);
      }
    });

    fullscreenBtn?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    thumbsToggleBtn?.addEventListener('click', () => {
      this.toggleThumbnails();
    });

    // Fullscreen change listener
    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      this.stage?.classList.toggle('is-fullscreen', isFs);
      if (fullscreenBtn) {
        fullscreenBtn.innerHTML = isFs 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg> Keluar Layar Penuh`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> Layar Penuh`;
      }
      setTimeout(() => {
        if (this.pageFlip) this.pageFlip.update();
      }, 150);
    });
  }

  toggleFullscreen() {
    if (!this.stage) return;
    if (!document.fullscreenElement) {
      if (this.stage.requestFullscreen) {
        this.stage.requestFullscreen();
      } else if (this.stage.webkitRequestFullscreen) {
        this.stage.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  toggleThumbnails() {
    const thumbsDrawer = document.getElementById('book-thumbs-drawer');
    const toggleBtn = document.getElementById('book-thumbs-toggle');
    this.isThumbnailsOpen = !this.isThumbnailsOpen;

    if (thumbsDrawer) {
      thumbsDrawer.classList.toggle('active', this.isThumbnailsOpen);
    }
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isThumbnailsOpen);
    }

    if (this.isThumbnailsOpen) {
      this.scrollToActiveThumbnail();
    }
  }

  buildThumbnailStrip() {
    const stripContainer = document.getElementById('book-thumbs-strip');
    if (!stripContainer) return;

    stripContainer.innerHTML = '';

    for (let i = 1; i <= this.totalPages; i++) {
      const pageIndex = i - 1;
      const thumbItem = document.createElement('div');
      thumbItem.className = `thumb-item ${pageIndex === this.currentPage ? 'active' : ''}`;
      thumbItem.dataset.page = pageIndex;
      thumbItem.innerHTML = `
        <div class="thumb-img-wrapper">
          <img src="${this.imagePathPrefix}${i}${this.imagePathSuffix}" alt="Page ${i}" loading="lazy" />
          <span class="thumb-num">${i}</span>
        </div>
      `;

      thumbItem.addEventListener('click', () => {
        if (this.pageFlip) {
          this.pageFlip.turnToPage(pageIndex);
        }
      });

      stripContainer.appendChild(thumbItem);
    }
  }

  updateUI() {
    const currentNumEl = document.getElementById('book-current-page');
    const slider = document.getElementById('book-slider');
    const prevBtn = document.getElementById('book-prev-btn');
    const nextBtn = document.getElementById('book-next-btn');

    const displayPage = this.currentPage + 1;

    if (currentNumEl) {
      currentNumEl.textContent = `${displayPage} / ${this.totalPages}`;
    }

    if (slider) {
      slider.value = displayPage;
    }

    if (prevBtn) {
      prevBtn.disabled = (this.currentPage <= 0);
    }

    if (nextBtn) {
      nextBtn.disabled = (this.currentPage >= this.totalPages - 1);
    }

    // Update active thumbnail
    const thumbItems = document.querySelectorAll('.thumb-item');
    thumbItems.forEach(item => {
      const p = parseInt(item.dataset.page, 10);
      item.classList.toggle('active', p === this.currentPage);
    });

    if (this.isThumbnailsOpen) {
      this.scrollToActiveThumbnail();
    }
  }

  scrollToActiveThumbnail() {
    const activeThumb = document.querySelector('.thumb-item.active');
    const stripContainer = document.getElementById('book-thumbs-strip');
    if (activeThumb && stripContainer) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Hanya aktifkan jika stage atau elemen dalam stage sedang terlihat / fokus
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (this.pageFlip) this.pageFlip.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (this.pageFlip) this.pageFlip.flipPrev();
      } else if (e.key === 'Home') {
        if (this.pageFlip) this.pageFlip.turnToPage(0);
      } else if (e.key === 'End') {
        if (this.pageFlip) this.pageFlip.turnToPage(this.totalPages - 1);
      }
    });
  }

  playFlipSound() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.audioContext.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.12);
    } catch (_) {}
  }
}
