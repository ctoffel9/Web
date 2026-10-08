import { UIManager } from './ui/UIManager.js';
import { FlipbookViewer } from './components/FlipbookViewer.js';
import { RippleAura } from './components/RippleAura.js';
import { OrbitSystem } from './components/OrbitSystem.js';
import { BestWorkCarousel } from './components/BestWorkCarousel.js';
import { ParallaxController } from './components/ParallaxController.js';
import { personalInfo, heroCategories, artworks } from './data/portfolioData.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    // 1. Inisialisasi UI Manager
    this.uiManager = new UIManager({
      personalInfo,
      heroCategories,
      artworks,
      onCloseModal: () => {}
    });

    // 2. Inisialisasi Ripple Aura Effect (Animasi Ungu Gelombang dari Dalam Keluar)
    this.rippleAura = new RippleAura({
      canvasId: 'ripple-aura-canvas',
      containerId: 'avatar-hero-stage',
      avatarId: 'avatar-hero-img'
    });

    // 3. Inisialisasi Orbit System & 3D Revolving Planets (itch.io showcase)
    this.orbitSystem = new OrbitSystem({
      containerId: 'avatar-hero-stage',
      onPlanetClick: (planetData) => {
        const matchedArt = artworks.find(
          a => a.id === planetData.id || a.title.toLowerCase() === planetData.title.toLowerCase()
        );
        if (matchedArt) {
          this.uiManager.showArtworkDetail(matchedArt);
        } else if (planetData.itchUrl) {
          window.open(planetData.itchUrl, '_blank', 'noopener');
        }
      }
    });

    // 4. Inisialisasi Carousel Best Work (Inner Sight Games — Luxman, ADMNOR, Voodoo Craft)
    this.bestWorkCarousel = new BestWorkCarousel({
      containerId: 'best-work-carousel',
      onInspect: (artId) => {
        const matched = artworks.find(a => a.id === artId);
        if (matched) {
          this.uiManager.showArtworkDetail(matched);
        }
      }
    });

    // 5. Bind navigasi Games ke modal galeri games
    const navGamesBtn = document.getElementById('nav-games-btn');
    if (navGamesBtn) {
      navGamesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.showCategoryGallery({
          id: 'games',
          title: 'GAMES',
          subtitle: 'Selected Works & Indie Game Projects'
        });
      });
    }

    // 6. Inisialisasi Flipbook Viewport (Membuka Halaman 4 saat awal)
    this.flipbookViewer = new FlipbookViewer({
      containerId: 'flipbook-container',
      stageId: 'flipbook-stage',
      totalPages: 36,
      startPage: 3, // Halaman 4 (0-indexed: index 3)
      imagePathPrefix: './booklet/page-',
      imagePathSuffix: '.jpg',
      pdfUrl: './portfolio-booklet.pdf',
      gdriveUrl: 'https://drive.google.com/file/d/1_IcNi_hYaTUt0jeGm1EPHhMi_WOhiaVU/view?usp=sharing'
    });

    // 5. Bind Hero Action Burst Buttons (GAME & ILLUS)
    const heroBtnGame = document.getElementById('hero-btn-game');
    if (heroBtnGame) {
      heroBtnGame.addEventListener('click', (e) => {
        e.preventDefault();
        this.uiManager.showCategoryGallery({
          id: 'games',
          title: 'GAMES',
          subtitle: 'Selected Works & Indie Game Projects'
        });
      });
    }

    const heroBtnIllus = document.getElementById('hero-btn-illus');
    if (heroBtnIllus) {
      heroBtnIllus.addEventListener('click', (e) => {
        e.preventDefault();
        const bookletSection = document.getElementById('booklet-section');
        if (bookletSection) {
          bookletSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (this.flipbookViewer) {
          this.flipbookViewer.toggleFullscreen();
        }
      });
    }

    // 6. Inisialisasi Parallax Controller (Smooth Multiplane Scrolling)
    this.parallaxController = new ParallaxController();
  }
}

// Inisialisasi aplikasi saat dokumen siap
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
