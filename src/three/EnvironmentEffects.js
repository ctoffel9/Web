import * as THREE from 'three';

export class EnvironmentEffects {
  constructor(scene) {
    this.scene = scene;
    this.initParticles();
    this.initFloorShadowReceiver();
  }

  initParticles() {
    // 1. Partikel debu atmosferik / embers mengambang di ruang pameran
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 30 - 2;

      scales[i] = Math.random() * 0.08 + 0.03;
      speeds[i] = Math.random() * 0.3 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material partikel dengan tekstur lingkaran lembut
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(224, 235, 255, 0.5)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.25,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#d8e2dc')
    });

    this.particles = new THREE.Points(geometry, material);
    this.speeds = speeds;
    this.scene.add(this.particles);
  }

  initFloorShadowReceiver() {
    // Lantai dasar untuk menerima bayangan kartu mengambang
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.35
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -6;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Garis grid arsitektural halus di kejauhan
    const gridHelper = new THREE.GridHelper(50, 40, '#263238', '#141c24');
    gridHelper.position.y = -6;
    this.scene.add(gridHelper);
  }

  update(time) {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gerakan melayang halus ke atas & ke samping (organic drift)
      positions[i3 + 1] += Math.sin(time + i) * 0.003 + 0.002;
      positions[i3] += Math.cos(time * 0.5 + i) * 0.002;

      // Reset jika melewati batas atas
      if (positions[i3 + 1] > 14) {
        positions[i3 + 1] = -12;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
