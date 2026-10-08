/**
 * CardFanShowcase.js
 * Komponen interaktif Fanned Card Deck terinspirasi dari kartu bergaya visual
 * fanned arc (tilted overlapping deck) dengan ambient golden underglow.
 */

export class CardFanShowcase {
  constructor({
    artworks,
    uiManager,
    deckContainerId = 'card-fan-deck',
    spotlightContainerId = 'fan-spotlight-panel',
    chipsContainerId = 'games-chip-bar',
    prevBtnId = 'fan-prev-btn',
    nextBtnId = 'fan-next-btn'
  }) {
    this.allArtworks = artworks.filter(a => a.category === 'game');
    this.uiManager = uiManager;

    // 5 Game Unggulan Utama di Deck Fan (sesuai referensi media_1791367342746.png)
    this.featuredIds = [
      'art-warmth',
      'art-alchefmist',
      'art-dreaminc',
      'art-nightride',
      'art-magehourglass'
    ];

    // Tata letak rotasi & offset kurva kipas (Fan Arc)
    this.fanTransforms = [
      { rot: -14, x: -220, y: 14, z: 1 },
      { rot: -7,  x: -110, y: 5,  z: 2 },
      { rot: -1,  x: 0,    y: 0,  z: 3 },
      { rot: 6,   x: 110,  y: 5,  z: 4 },
      { rot: 13,  x: 220,  y: 14, z: 5 }
    ];

    this.deckContainer = document.getElementById(deckContainerId);
    this.spotlightContainer = document.getElementById(spotlightContainerId);
    this.chipsContainer = document.getElementById(chipsContainerId);
    this.prevBtn = document.getElementById(prevBtnId);
    this.nextBtn = document.getElementById(nextBtnId);

    // Kartu aktif awal (Mage Hourglass di bagian depan kanan, seperti di gambar referensi)
    this.activeIndex = 4;
    this.activeArt = this.getArtworkById(this.featuredIds[this.activeIndex]) || this.allArtworks[0];

    this.init();
  }

  getArtworkById(id) {
    return this.allArtworks.find(a => a.id === id);
  }

  init() {
    if (!this.deckContainer) return;

    this.renderDeck();
    this.renderChips();
    this.updateSpotlight(this.activeArt);
    this.bindControls();
  }

  renderDeck() {
    this.deckContainer.innerHTML = '';

    this.featuredIds.forEach((artId, idx) => {
      const art = this.getArtworkById(artId);
      if (!art) return;

      const tf = this.fanTransforms[idx] || { rot: 0, x: 0, y: 0, z: idx + 1 };
      const cardEl = document.createElement('div');
      cardEl.className = `fan-card ${idx === this.activeIndex ? 'active-card' : ''}`;
      cardEl.dataset.artId = art.id;
      cardEl.dataset.index = idx;
      cardEl.style.setProperty('--fan-rot', `${tf.rot}deg`);
      cardEl.style.setProperty('--fan-x', `${tf.x}px`);
      cardEl.style.setProperty('--fan-y', `${tf.y}px`);
      cardEl.style.setProperty('--fan-z', `${tf.z}`);

      cardEl.innerHTML = `
        <div class="fan-card-inner">
          <img src="${art.image || ''}" alt="${art.title}" class="fan-card-art" loading="lazy" />
          <div class="fan-card-overlay">
            <span class="fan-card-quick-title">${art.title}</span>
          </div>
          <div class="fan-card-border-glow"></div>
        </div>
      `;

      // Interaktivitas Hover
      cardEl.addEventListener('mouseenter', () => {
        this.updateSpotlight(art);
        if (this.uiManager?.playSfx) this.uiManager.playSfx(580, 0.04);
      });

      cardEl.addEventListener('mouseleave', () => {
        this.updateSpotlight(this.activeArt);
      });

      // Klik untuk memilih & membuka spotlight
      cardEl.addEventListener('click', (e) => {
        this.selectCard(idx, art);
      });

      this.deckContainer.appendChild(cardEl);
    });
  }

  selectCard(idx, art) {
    this.activeIndex = idx;
    this.activeArt = art;

    // Update active class pada kartu
    const allCards = this.deckContainer.querySelectorAll('.fan-card');
    allCards.forEach((c, i) => {
      if (i === idx) {
        c.classList.add('active-card');
      } else {
        c.classList.remove('active-card');
      }
    });

    // Update chips
    this.updateActiveChip(art.id);

    // Update spotlight
    this.updateSpotlight(art);

    if (this.uiManager?.playSfx) {
      this.uiManager.playSfx(520, 0.08);
    }
  }

  renderChips() {
    if (!this.chipsContainer) return;
    this.chipsContainer.innerHTML = '';

    this.allArtworks.forEach(art => {
      const chip = document.createElement('button');
      chip.className = `game-chip-btn ${art.id === this.activeArt.id ? 'active-chip' : ''}`;
      chip.dataset.artId = art.id;
      chip.innerHTML = `
        <span class="chip-dot"></span>
        <span class="chip-title">${art.title}</span>
      `;

      chip.addEventListener('click', () => {
        this.selectGameFromChip(art);
      });

      this.chipsContainer.appendChild(chip);
    });
  }

  updateActiveChip(artId) {
    if (!this.chipsContainer) return;
    const chips = this.chipsContainer.querySelectorAll('.game-chip-btn');
    chips.forEach(ch => {
      if (ch.dataset.artId === artId) {
        ch.classList.add('active-chip');
        ch.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      } else {
        ch.classList.remove('active-chip');
      }
    });
  }

  selectGameFromChip(art) {
    // Cek apakah game ini ada di featuredIds
    let featIndex = this.featuredIds.indexOf(art.id);

    if (featIndex !== -1) {
      // Ada di deck, sorot kartu tersebut
      this.selectCard(featIndex, art);
    } else {
      // Game di luar 5 utama (misal Doom Scrolling, Broke Billionaire, CCO)
      // Gantikan kartu tengah / kartu depan dengan game ini sementara
      this.featuredIds[2] = art.id;
      this.renderDeck();
      this.selectCard(2, art);
    }
  }

  updateSpotlight(art) {
    if (!this.spotlightContainer || !art) return;

    this.spotlightContainer.innerHTML = `
      <div class="spotlight-content">
        <div class="spotlight-header-meta">
          <span class="spotlight-badge">${art.label || 'GAME PROJECT'}</span>
          <span class="spotlight-year">${art.year || ''}</span>
          ${art.client ? `<span class="spotlight-client">• ${art.client}</span>` : ''}
        </div>
        <h3 class="spotlight-title">${art.title}</h3>
        <p class="spotlight-desc">${art.description || art.shortDesc}</p>
        <div class="spotlight-actions">
          <button class="spotlight-btn-inspect" id="spotlight-inspect-btn">
            Inspect Art &amp; Details →
          </button>
          ${art.itchUrl ? `
            <a href="${art.itchUrl}" target="_blank" rel="noopener" class="spotlight-btn-play">
              Play on itch.io ↗
            </a>
          ` : ''}
        </div>
      </div>
    `;

    const inspectBtn = this.spotlightContainer.querySelector('#spotlight-inspect-btn');
    inspectBtn?.addEventListener('click', () => {
      if (this.uiManager) {
        this.uiManager.playSfx(620, 0.08);
        this.uiManager.showArtworkDetail(art);
      }
    });
  }

  bindControls() {
    this.prevBtn?.addEventListener('click', () => {
      let nextIdx = (this.activeIndex - 1 + this.featuredIds.length) % this.featuredIds.length;
      const art = this.getArtworkById(this.featuredIds[nextIdx]);
      this.selectCard(nextIdx, art);
    });

    this.nextBtn?.addEventListener('click', () => {
      let nextIdx = (this.activeIndex + 1) % this.featuredIds.length;
      const art = this.getArtworkById(this.featuredIds[nextIdx]);
      this.selectCard(nextIdx, art);
    });
  }
}
