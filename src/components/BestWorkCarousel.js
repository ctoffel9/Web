/**
 * BestWorkCarousel.js
 * Interactive, 3D Pop-Art Game Showcase Carousel for Christoffel's Best Work
 * Featuring flagship commercial titles from Inner Sight Games:
 * - Luxman Moonlit Market
 * - ADMNOR
 * - Voodoo Craft
 */

import { bestWorkGames } from '../data/portfolioData.js';

export class BestWorkCarousel {
  constructor(options = {}) {
    this.containerId = options.containerId || 'best-work-carousel';
    this.games = options.games || bestWorkGames;
    this.onInspect = options.onInspect || (() => {});
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 6000; // 6 seconds
    this.isPaused = false;
    
    // Touch / Drag variables
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) return;

    this.render();
    this.bindEvents();
    this.startAutoPlay();
    this.updateSlides();
  }

  render() {
    this.container.innerHTML = `
      <div class="bw-carousel-wrapper">
        <!-- Carousel Track with 3D Card Stack -->
        <div class="bw-track-container" id="bw-track-container">
          <div class="bw-cards-track" id="bw-cards-track">
            ${this.games.map((game, index) => this.renderCard(game, index)).join('')}
          </div>
        </div>

        <!-- Carousel Navigation Controls -->
        <div class="bw-controls-bar">
          <button type="button" class="bw-nav-btn bw-prev-btn" id="bw-prev-btn" aria-label="Previous Game">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Prev</span>
          </button>

          <div class="bw-dots-indicator" id="bw-dots-indicator">
            ${this.games.map((g, index) => `
              <button type="button" class="bw-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to ${g.title}">
                <span class="bw-dot-pill"></span>
              </button>
            `).join('')}
          </div>

          <button type="button" class="bw-nav-btn bw-next-btn" id="bw-next-btn" aria-label="Next Game">
            <span>Next</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.track = document.getElementById('bw-cards-track');
    this.cards = Array.from(this.track.querySelectorAll('.bw-card-item'));
    this.dots = Array.from(this.container.querySelectorAll('.bw-dot'));
    this.prevBtn = document.getElementById('bw-prev-btn');
    this.nextBtn = document.getElementById('bw-next-btn');
  }

  renderCard(game, index) {
    return `
      <article class="bw-card-item" data-index="${index}" id="bw-card-${index}">
        <div class="bw-card-inner">
          <!-- Key Art Banner Media -->
          <div class="bw-card-media-box">
            <img 
              src="${game.image}" 
              alt="${game.title} Key Art" 
              class="bw-card-img" 
              loading="lazy" 
              draggable="false"
            />
            <div class="bw-card-badge-tag">${game.badge}</div>
            <div class="bw-card-media-overlay"></div>
          </div>

          <!-- Content Details & Specs -->
          <div class="bw-card-body">
            <div class="bw-card-meta-top">
              <span class="bw-meta-studio">INNER SIGHT GAMES</span>
              <span class="bw-meta-year">${game.year}</span>
            </div>

            <h3 class="bw-card-title">${game.title}</h3>
            <p class="bw-card-tagline">${game.tagline}</p>

            <div class="bw-specs-block">
              <div class="bw-spec-row">
                <strong>ROLE:</strong> <span>${game.role}</span>
              </div>
              <div class="bw-spec-row">
                <strong>TOOLS:</strong> <span>${game.tools.join(' • ')}</span>
              </div>
            </div>

            <p class="bw-card-desc">${game.shortDesc}</p>

            <!-- Actions Row -->
            <div class="bw-card-actions">
              <a 
                href="${game.steamUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="bw-btn-steam" 
                title="Buka Halaman Steam"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.63 12.005C23.63 18.4269 18.4175 23.63 11.9863 23.63C6.65188 23.63 2.16125 20.0534 0.78313 15.1738L5.24563 17.0159C5.54563 18.5206 6.88157 19.6597 8.47532 19.6597C10.3128 19.6597 11.8456 18.1409 11.7659 16.2144L15.7269 13.3925C18.1691 13.4534 20.2175 11.4753 20.2175 9.00969C20.2175 6.59094 18.2488 4.62688 15.8253 4.62688C13.4019 4.62688 11.4331 6.59563 11.4331 9.00969V9.06594L8.65813 13.0831C7.93157 13.0409 7.21907 13.2425 6.61907 13.6503L0.380005 11.0722C0.85813 5.08626 5.86907 0.380005 11.9863 0.380005C18.4175 0.380005 23.63 5.58313 23.63 12.005ZM7.67844 18.0191L6.24875 17.4284C6.51148 17.974 6.9651 18.4043 7.52375 18.6378C8.78469 19.1628 10.2331 18.5628 10.7581 17.3066C11.0113 16.6972 11.0159 16.0269 10.7628 15.4175C10.5097 14.8081 10.0363 14.33 9.42688 14.0769C8.82219 13.8238 8.17532 13.8331 7.60344 14.0488L9.08001 14.6581C10.0081 15.0425 10.4488 16.1066 10.0597 17.0347C9.67063 17.9675 8.60657 18.4034 7.67844 18.0191ZM15.8253 11.93C14.2128 11.93 12.9003 10.6175 12.9003 9.00969C12.9003 7.40188 14.2128 6.08938 15.8253 6.08938C17.4378 6.08938 18.7503 7.40188 18.7503 9.00969C18.7503 10.6175 17.4425 11.93 15.8253 11.93ZM15.83 11.1988C17.0441 11.1988 18.0284 10.2144 18.0284 9.005C18.0284 7.79094 17.0441 6.81125 15.83 6.81125C14.6159 6.81125 13.6316 7.79563 13.6316 9.005C13.6363 10.2144 14.6206 11.1988 15.83 11.1988Z"/>
                </svg>
                <span>Steam Store</span>
              </a>

              <button 
                type="button" 
                class="bw-btn-inspect" 
                data-art-id="${game.id}"
                title="Buka Detail Karya & Catatan Produksi"
              >
                <span>Inspect Art</span>
              </button>

              <a 
                href="${game.websiteUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="bw-btn-web" 
                title="Buka Situs Resmi Inner Sight Games"
              >
                <span>Website ↗</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoPlay();
      });
    }

    this.dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        this.goTo(targetIndex);
        this.resetAutoPlay();
      });
    });

    // Clicking side cards brings them to center
    this.cards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        if (this.currentIndex !== index) {
          this.goTo(index);
          this.resetAutoPlay();
        }
      });
    });

    // Inspect buttons
    this.container.querySelectorAll('.bw-btn-inspect').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const artId = btn.getAttribute('data-art-id');
        this.onInspect(artId);
      });
    });

    // Pause autoPlay on hover
    this.container.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.isPaused = false;
    });

    // Touch & Swipe gestures
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    // Keyboard navigation when visible
    window.addEventListener('keydown', (e) => {
      if (this.isSectionInView()) {
        if (e.key === 'ArrowLeft') {
          this.prev();
          this.resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
          this.next();
          this.resetAutoPlay();
        }
      }
    });
  }

  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        this.next();
      } else {
        this.prev();
      }
      this.resetAutoPlay();
    }
  }

  isSectionInView() {
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.games.length;
    this.updateSlides();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.games.length) % this.games.length;
    this.updateSlides();
  }

  goTo(index) {
    if (index >= 0 && index < this.games.length) {
      this.currentIndex = index;
      this.updateSlides();
    }
  }

  updateSlides() {
    const total = this.games.length;

    this.cards.forEach((card, index) => {
      // Calculate relative position (-1: prev, 0: active, 1: next)
      let offset = index - this.currentIndex;
      
      // Handle wrapping for 3 items
      if (offset > 1) offset -= total;
      if (offset < -1) offset += total;

      card.classList.remove('bw-active', 'bw-prev', 'bw-next', 'bw-hidden');

      if (offset === 0) {
        card.classList.add('bw-active');
        card.style.transform = `translateX(0%) scale(1) translateZ(0)`;
        card.style.opacity = '1';
        card.style.zIndex = '5';
        card.style.pointerEvents = 'auto';
      } else if (offset === -1) {
        card.classList.add('bw-prev');
        card.style.transform = `translateX(-72%) scale(0.86) rotateY(12deg) translateZ(-80px)`;
        card.style.opacity = '0.55';
        card.style.zIndex = '2';
        card.style.pointerEvents = 'auto';
      } else if (offset === 1) {
        card.classList.add('bw-next');
        card.style.transform = `translateX(72%) scale(0.86) rotateY(-12deg) translateZ(-80px)`;
        card.style.opacity = '0.55';
        card.style.zIndex = '2';
        card.style.pointerEvents = 'auto';
      } else {
        card.classList.add('bw-hidden');
        card.style.transform = `translateX(${offset * 100}%) scale(0.7) translateZ(-150px)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    // Update dots indicator
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused && this.isSectionInView()) {
        this.next();
      }
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.startAutoPlay();
  }

  destroy() {
    this.stopAutoPlay();
  }
}
