import * as THREE from 'three';
import gsap from 'gsap';
import { generateHeroCategoryCanvas } from '../utils/artworkCanvasGenerator.js';

export class CardManager {
  constructor(scene, heroCategories, artworks, onSelectCategory) {
    this.scene = scene;
    this.heroCategories = heroCategories;
    this.artworks = artworks;
    this.onSelectCategory = onSelectCategory;

    this.cardMeshes = [];
    this.hoveredCard = null;
    this.selectedCard = null;

    this.cardGroup = new THREE.Group();
    this.scene.add(this.cardGroup);

    this.initCards();
  }

  initCards() {
    this.heroCategories.forEach((cat, index) => {
      // 1. Generate Kanvas Kategori
      const canvas = generateHeroCategoryCanvas(cat);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;

      // 2. Dimensi 2 Kartu Besar Elegan (Aspect Ratio ~ 1 : 1.35)
      const baseWidth = 3.6;
      const height = 4.8;
      const depth = 0.1;

      const geometry = new THREE.BoxGeometry(baseWidth, height, depth);

      const frameMat = new THREE.MeshStandardMaterial({
        color: '#080808',
        metalness: 0.9,
        roughness: 0.3
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.1,
        transparent: false
      });

      const backMat = new THREE.MeshStandardMaterial({
        color: '#050505',
        metalness: 0.5,
        roughness: 0.8
      });

      const materials = [
        frameMat, frameMat, frameMat, frameMat,
        frontMat, backMat
      ];

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        category: cat,
        index: index,
        basePos: new THREE.Vector3(),
        baseRot: new THREE.Euler(),
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.6 + Math.random() * 0.3,
        isHovered: false
      };

      this.cardGroup.add(mesh);
      this.cardMeshes.push(mesh);
    });

    this.layoutCards();
  }

  layoutCards() {
    // Tata letak 2 kartu besar di kiri dan kanan pusat layar
    const spacingX = 4.4;

    this.cardMeshes.forEach((mesh, col) => {
      const x = (col === 0) ? -spacingX / 2 : spacingX / 2;
      const y = -0.3;
      const z = 0;

      mesh.userData.basePos.set(x, y, z);
      mesh.position.copy(mesh.userData.basePos);

      // Sedikit rotasi menghadap ke dalam (subtle inward tilt)
      const rotY = (col === 0) ? 0.04 : -0.04;
      mesh.userData.baseRot.set(0, rotY, 0);
      mesh.rotation.copy(mesh.userData.baseRot);
    });
  }

  update(time) {
    this.cardMeshes.forEach(mesh => {
      if (mesh === this.selectedCard) return;

      const phase = mesh.userData.floatPhase + time * mesh.userData.floatSpeed;
      const floatOffsetY = Math.sin(phase) * 0.05;
      const floatRotZ = Math.cos(phase * 0.6) * 0.008;

      if (!mesh.userData.isHovered) {
        mesh.position.y = mesh.userData.basePos.y + floatOffsetY;
        mesh.rotation.z = mesh.userData.baseRot.z + floatRotZ;
      }
    });
  }

  handleRaycast(raycaster) {
    if (this.selectedCard) return null;

    const intersects = raycaster.intersectObjects(this.cardMeshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;

      if (this.hoveredCard !== hitMesh) {
        if (this.hoveredCard) {
          this.unhoverCard(this.hoveredCard);
        }
        this.hoveredCard = hitMesh;
        this.hoverCard(hitMesh);
      }
      return hitMesh.userData.category;
    } else {
      if (this.hoveredCard) {
        this.unhoverCard(this.hoveredCard);
        this.hoveredCard = null;
      }
      return null;
    }
  }

  hoverCard(mesh) {
    mesh.userData.isHovered = true;
    document.body.style.cursor = 'pointer';

    gsap.to(mesh.position, {
      z: mesh.userData.basePos.z + 0.65,
      duration: 0.35,
      ease: 'power2.out'
    });

    gsap.to(mesh.scale, {
      x: 1.04,
      y: 1.04,
      z: 1.04,
      duration: 0.35,
      ease: 'power2.out'
    });

    mesh.material[0].color.set('#2a2a2a');
  }

  unhoverCard(mesh) {
    mesh.userData.isHovered = false;
    document.body.style.cursor = 'default';

    gsap.to(mesh.position, {
      z: mesh.userData.basePos.z,
      duration: 0.45,
      ease: 'power2.out'
    });

    gsap.to(mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.45,
      ease: 'power2.out'
    });

    mesh.material[0].color.set('#080808');
  }

  handleClick(raycaster) {
    if (this.selectedCard) return;

    const intersects = raycaster.intersectObjects(this.cardMeshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      this.selectCard(clickedMesh);
    }
  }

  selectCard(mesh) {
    this.selectedCard = mesh;
    const cat = mesh.userData.category;

    gsap.to(mesh.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    if (this.onSelectCategory) {
      this.onSelectCategory(cat, mesh.position);
    }
  }

  deselectCard() {
    if (!this.selectedCard) return;

    const mesh = this.selectedCard;
    this.selectedCard = null;

    gsap.to(mesh.rotation, {
      x: mesh.userData.baseRot.x,
      y: mesh.userData.baseRot.y,
      z: mesh.userData.baseRot.z,
      duration: 0.7,
      ease: 'power3.out'
    });

    gsap.to(mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.7,
      ease: 'power3.out'
    });
  }
}
