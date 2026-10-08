import { generateArtworkCanvas } from '../utils/artworkCanvasGenerator.js';

export class UIManager {
  constructor({ personalInfo, heroCategories, artworks, onCloseModal }) {
    this.personalInfo = personalInfo;
    this.heroCategories = heroCategories;
    this.artworks = artworks;
    this.onCloseModal = onCloseModal;

    this.audioContext = null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.categoryModal = document.getElementById('category-modal');
    this.artworkModal = document.getElementById('artwork-modal');
    this.aboutModal = document.getElementById('about-modal');
    this.hoverTooltip = document.getElementById('hover-tooltip');
    this.dropdownMenu = document.getElementById('portfolio-dropdown-menu');
    this.dropdownBtn = document.getElementById('portfolio-dropdown-btn');

    this.renderAboutContent();
  }

  showCategoryGallery(cat) {
    this.playSfx(520, 0.08);

    const titleEl = document.getElementById('cat-modal-title');
    const subEl = document.getElementById('cat-modal-sub');
    const container = document.getElementById('category-items-container');

    titleEl.textContent = cat.title;
    subEl.textContent = cat.subtitle || 'Selected Works & Game Projects';

    // Ambil artworks yang cocok dengan kategori ini (atau semua jika cat.id === 'all')
    const matchingArts = (cat.id === 'all')
      ? this.artworks
      : this.artworks.filter(a => a.category === cat.id);

    container.innerHTML = '';

    if (matchingArts.length === 0) {
      container.innerHTML = `<p style="color: #888; grid-column: 1/-1; text-align: center; padding: 2rem;">No items found in this category.</p>`;
    } else {
      matchingArts.forEach(art => {
        const card = document.createElement('div');
        card.className = 'cat-grid-card';
        card.innerHTML = `
          <div class="cat-card-thumb">
            <img src="${art.image || ''}" alt="${art.title}" class="cat-card-img" onerror="this.style.display='none'" />
            <div class="cat-card-year">${art.year}</div>
          </div>
          <div class="cat-card-info">
            <h3 class="cat-card-title">${art.title}</h3>
            <p class="cat-card-client">${art.client}</p>
            <p class="cat-card-desc">${art.description}</p>
            <div class="cat-card-footer">
              <button class="inspect-btn" data-art-id="${art.id}">Inspect Details ↗</button>
              ${art.itchUrl ? `<a href="${art.itchUrl}" target="_blank" rel="noopener" class="mini-play-link">${art.itchUrl.includes('instagram') ? 'Instagram ↗' : 'Play on itch.io ↗'}</a>` : ''}
            </div>
          </div>
        `;

        card.querySelector('.inspect-btn')?.addEventListener('click', () => {
          this.showArtworkDetail(art);
        });

        container.appendChild(card);
      });
    }

    this.categoryModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  closeCategoryGallery() {
    this.playSfx(350, 0.05);
    this.categoryModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (this.onCloseModal) {
      this.onCloseModal();
    }
  }

  showArtworkDetail(art) {
    this.playSfx(600, 0.08);

    const titleEl = document.getElementById('modal-art-title');
    const catEl = document.getElementById('modal-art-category');
    const yearEl = document.getElementById('modal-art-year');
    const clientEl = document.getElementById('modal-art-client');
    const roleEl = document.getElementById('modal-art-role');
    const descEl = document.getElementById('modal-art-desc');
    const toolsContainer = document.getElementById('modal-art-tools');
    const imageContainer = document.getElementById('modal-art-preview');
    const actionsContainer = document.getElementById('modal-art-actions');

    titleEl.textContent = art.title;
    catEl.textContent = art.category.toUpperCase();
    catEl.style.borderColor = art.accentColor;
    yearEl.textContent = art.year;
    clientEl.textContent = art.client;
    roleEl.textContent = art.role;
    descEl.textContent = art.description;

    toolsContainer.innerHTML = art.tools.map(t => `<span class="pill-tag">${t}</span>`).join('');

    if (art.image) {
      imageContainer.innerHTML = `<img src="${art.image}" alt="${art.title}" class="modal-artwork-img" />`;
    } else {
      const canvas = generateArtworkCanvas(art);
      imageContainer.innerHTML = '';
      canvas.className = 'modal-artwork-img';
      imageContainer.appendChild(canvas);
    }

    if (actionsContainer) {
      actionsContainer.innerHTML = '';
      if (art.itchUrl) {
        const isInsta = art.itchUrl.includes('instagram.com');
        const isSteam = art.itchUrl.includes('steampowered.com');
        let btnText = 'PLAY / VIEW ON ITCH.IO ↗';
        if (isInsta) btnText = 'VIEW ON INSTAGRAM (@chrst.fl) ↗';
        else if (isSteam) btnText = 'VIEW ON STEAM STORE ↗';

        actionsContainer.innerHTML = `
          <a href="${art.itchUrl}" target="_blank" rel="noopener" class="action-play-btn">
            ${btnText}
          </a>
          ${art.websiteUrl ? `
            <a href="${art.websiteUrl}" target="_blank" rel="noopener" class="action-play-btn" style="background:rgba(124, 58, 237, 0.25); border: 1.5px solid #7c3aed; color:#ffffff;">
              OFFICIAL WEBSITE ↗
            </a>
          ` : ''}
          ${art.playMode ? `<span class="play-badge">${art.playMode}</span>` : ''}
        `;
      }
    }

    this.artworkModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  closeArtworkDetail() {
    this.playSfx(350, 0.05);
    this.artworkModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (this.onCloseModal) {
      this.onCloseModal();
    }
  }

  renderAboutContent() {
    const info = this.personalInfo;
    const aboutBody = document.getElementById('about-modal-body');
    if (!aboutBody) return;

    aboutBody.innerHTML = `
      <div class="about-grid">
        <div class="about-bio-col">
          <div class="about-header-flex">
            <div>
              <h2 class="about-name">${info.name}</h2>
              <p class="about-nickname">AKA "${info.nickname}"</p>
              <p class="about-role">${info.role}</p>
            </div>
          </div>
          
          <div class="bio-text">
            <p><strong>PROFILE SUMMARY:</strong></p>
            <p>${info.profileSummary}</p>
          </div>

          <div class="section-block">
            <h3>EDUCATION</h3>
            <div class="education-list">
              ${info.education.map(edu => `
                <div class="education-item">
                  <div class="edu-degree">${edu.degree}</div>
                  <div class="edu-inst">${edu.institution}</div>
                  <div class="edu-period">${edu.period}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="contact-box">
            <h4>DIRECT CONTACT &amp; PROFILES</h4>
            <a href="mailto:${info.email}" class="email-link">✉️ ${info.email}</a>
            <div class="contact-meta">
              <span>📱 ${info.phone}</span>
              <span>📍 ${info.location}</span>
            </div>
            <div class="social-links">
              <a href="${info.social.itchio}" target="_blank" rel="noopener">itch.io ↗</a>
              <a href="${info.social.instagram}" target="_blank" rel="noopener">Instagram (@chrst.fl) ↗</a>
              <a href="${info.social.linktree}" target="_blank" rel="noopener">Linktree ↗</a>
              <a href="${info.social.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
              <a href="${info.social.whatsapp}" target="_blank" rel="noopener">WhatsApp ↗</a>
            </div>
            <div class="cv-buttons-row">
              <a href="${info.cvPdf}" download="CV_Christoffel.pdf" class="action-play-btn" style="font-size: 0.72rem; padding: 0.5rem 1rem;">
                📥 DOWNLOAD CV (PDF)
              </a>
              <a href="${info.social.resumeDrive}" target="_blank" rel="noopener" class="action-play-btn outline" style="font-size: 0.72rem; padding: 0.5rem 1rem;">
                🔗 GOOGLE DRIVE CV ↗
              </a>
            </div>
          </div>
        </div>

        <div class="about-exp-col">
          <h3>EXPERIENCE</h3>
          <div class="timeline">
            ${info.experience.map(exp => `
              <div class="timeline-item">
                <div class="timeline-header">
                  <span class="timeline-role">${exp.role}</span>
                  <span class="timeline-period">${exp.period}</span>
                </div>
                <div class="timeline-company">${exp.company}</div>
                <p class="timeline-desc">${exp.description}</p>
              </div>
            `).join('')}
          </div>

          <div class="section-block">
            <h3>ACHIEVEMENTS &amp; AWARDS</h3>
            <div class="achievements-list">
              ${info.achievements.map(ach => `
                <div class="achievement-item">
                  <div class="ach-title">🏆 ${ach.title} <span class="ach-year">(${ach.year})</span></div>
                  <div class="ach-issuer">${ach.issuer}</div>
                  <p class="ach-desc">${ach.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="skills-section">
            <h3>SKILLS &amp; COMPETENCIES</h3>
            <div class="skill-cards-grid">
              ${info.detailedSkills.map(s => `
                <div class="skill-card">
                  <div class="skill-card-badge">${s.icon}</div>
                  <div class="skill-card-content">
                    <div class="skill-card-title">${s.name}</div>
                    <div class="skill-card-desc">${s.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openAboutModal() {
    this.playSfx(500, 0.06);
    this.aboutModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  closeAboutModal() {
    this.playSfx(350, 0.05);
    this.aboutModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  updateHoverTooltip(item, screenPos) {
    if (!item) {
      this.hoverTooltip.style.opacity = '0';
      return;
    }

    this.hoverTooltip.innerHTML = `
      <span class="tooltip-title">${item.title}</span>
      <span class="tooltip-sub">${item.subtitle || 'Click to explore category'}</span>
    `;
    this.hoverTooltip.style.transform = `translate(${screenPos.x + 16}px, ${screenPos.y - 30}px)`;
    this.hoverTooltip.style.opacity = '1';
  }

  bindEvents() {
    // Dropdown toggle
    this.dropdownBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dropdownMenu?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      this.dropdownMenu?.classList.remove('show');
    });

    // Dropdown items
    this.dropdownMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = link.dataset.cat;
        this.dropdownMenu.classList.remove('show');
        if (catId === 'all') {
          this.showCategoryGallery({ id: 'all', title: 'ALL WORKS', subtitle: 'Complete Project Archive' });
        } else {
          const found = this.heroCategories.find(c => c.id === catId);
          if (found) {
            this.showCategoryGallery(found);
          }
        }
      });
    });

    // Close Category Modal
    document.getElementById('modal-category-close')?.addEventListener('click', () => {
      this.closeCategoryGallery();
    });

    this.categoryModal?.addEventListener('click', (e) => {
      if (e.target === this.categoryModal) {
        this.closeCategoryGallery();
      }
    });

    // Close Artwork Modal
    document.getElementById('modal-art-close')?.addEventListener('click', () => {
      this.closeArtworkDetail();
    });

    this.artworkModal?.addEventListener('click', (e) => {
      if (e.target === this.artworkModal) {
        this.closeArtworkDetail();
      }
    });

    // About Modal
    document.getElementById('nav-about-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAboutModal();
    });

    document.getElementById('modal-about-close')?.addEventListener('click', () => {
      this.closeAboutModal();
    });

    this.aboutModal?.addEventListener('click', (e) => {
      if (e.target === this.aboutModal) {
        this.closeAboutModal();
      }
    });

    // ESC Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.categoryModal?.classList.contains('active')) this.closeCategoryGallery();
        if (this.artworkModal?.classList.contains('active')) this.closeArtworkDetail();
        if (this.aboutModal?.classList.contains('active')) this.closeAboutModal();
      }
    });
  }

  playSfx(freq = 440, duration = 0.05) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch (_) {}
  }
}
