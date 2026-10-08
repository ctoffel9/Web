import * as THREE from 'three';
import gsap from 'gsap';

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse coordinates (target dan lerped)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.init();
    this.setupLights();
    this.setupEvents();
  }

  init() {
    // 1. Scene dengan atmosferik fog hitam murni seperti referensi
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#000000');
    this.scene.fog = new THREE.FogExp2('#000000', 0.018);

    // 2. Camera untuk 4 kartu hero horisontal
    this.camera = new THREE.PerspectiveCamera(48, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, -0.2, 14.5);
    this.cameraTargetPosition = this.camera.position.clone();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Cahaya Ambient Lembut
    this.ambientLight = new THREE.AmbientLight('#e0e7ff', 0.85);
    this.scene.add(this.ambientLight);

    // Key Light Utama (Directional)
    this.dirLight = new THREE.DirectionalLight('#ffffff', 1.8);
    this.dirLight.position.set(8, 12, 10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 40;
    this.scene.add(this.dirLight);

    // Fill Light Berwarna Hangat
    this.fillLight = new THREE.DirectionalLight('#e07a5f', 0.7);
    this.fillLight.position.set(-10, -5, 6);
    this.scene.add(this.fillLight);

    // Sheen Point Light yang mengikuti kursor untuk highlight refleksi interaktif
    this.cursorLight = new THREE.PointLight('#a8dadc', 2.5, 18, 1.8);
    this.cursorLight.position.set(0, 0, 8);
    this.scene.add(this.cursorLight);
  }

  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(e) {
    this.pointer.x = (e.clientX / this.width) * 2 - 1;
    this.pointer.y = -(e.clientY / this.height) * 2 + 1;

    this.mouse.targetX = this.pointer.x;
    this.mouse.targetY = this.pointer.y;
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.pointer.x = (touch.clientX / this.width) * 2 - 1;
      this.pointer.y = -(touch.clientY / this.height) * 2 + 1;

      this.mouse.targetX = this.pointer.x;
      this.mouse.targetY = this.pointer.y;
    }
  }

  update(deltaTime) {
    // Lerp gerakan mouse untuk efek parallax mulus
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Gerakkan kursor point light secara halus
    this.cursorLight.position.x = this.mouse.x * 10;
    this.cursorLight.position.y = this.mouse.y * 6;
    this.cursorLight.position.z = 6;

    // Kamera parallax lembut saat bukan dalam mode fokus kartu
    if (!this.isFocusMode) {
      this.camera.position.x = this.mouse.x * 1.5;
      this.camera.position.y = this.mouse.y * 1.0;
      this.camera.lookAt(0, 0, 0);
    }
  }

  setFocusMode(isFocus, targetPosition = null) {
    this.isFocusMode = isFocus;

    if (isFocus && targetPosition) {
      // Zoom kamera mendekat ke kartu yang dipilih
      gsap.to(this.camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 5.5,
        duration: 1.2,
        ease: 'power3.out'
      });
    } else {
      // Kembalikan kamera ke posisi semula
      gsap.to(this.camera.position, {
        x: 0,
        y: -0.2,
        z: 14.5,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
