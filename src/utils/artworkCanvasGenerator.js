/**
 * Generator Tekstur Kanvas Konsep Seni Prosedural
 * Menghasilkan karya seni visual development beresolusi tinggi dengan nuansa lukisan digital,
 * pencahayaan atmosferik, siluet lingkungan/karakter, dan palet warna bergaya Claire Hummel.
 */

export function generateHeroCategoryCanvas(cat) {
  const canvas = document.createElement('canvas');
  const width = 1000;
  const height = 1350; // Aspect ratio ~ 1 : 1.35
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Latar belakang gelap polos minimalis & elegan (murni tanpa gambar)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#161619');
  grad.addColorStop(0.5, '#0e0e11');
  grad.addColorStop(1, '#070709');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Border garis halus ganda bergaya galeri modern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Nama Kategori Besar Huruf Kapital Putih Tebal di Tengah
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 78px "Raleway", "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0.12em';
  ctx.fillText(cat.title, width / 2, height / 2);
  ctx.restore();

  return canvas;
}

function drawHeroBackgroundArt(ctx, cat, w, h) {
  ctx.save();
  if (cat.id === 'game') {
    // Siluet visual development game, pegunungan dan kubah
    ctx.fillStyle = '#1c0a06';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w * 0.45, h * 0.58);
    ctx.lineTo(w, h * 0.62);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Dermaga / jembatan siluet
    ctx.fillStyle = '#120503';
    ctx.fillRect(0, h * 0.78, w * 0.7, 24);
    ctx.fillRect(w * 0.35, h * 0.78, 18, h * 0.22);
  } else {
    // Halftone dots & graffiti style ala ilustrasi Instagram
    ctx.fillStyle = 'rgba(216, 255, 63, 0.12)';
    for (let x = 40; x < w - 40; x += 40) {
      for (let y = 60; y < h - 60; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

export function generateArtworkCanvas(art) {
  const canvas = document.createElement('canvas');
  // Resolusi tinggi untuk tekstur tajam di WebGL
  const width = 1280;
  const height = Math.round(width * (art.aspect.height / art.aspect.width));
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Latar belakang gradien atmosferik sesuai tema
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);

  switch (art.theme) {
    case 'monolith':
      bgGradient.addColorStop(0, '#0a1128');
      bgGradient.addColorStop(0.4, '#1c2541');
      bgGradient.addColorStop(0.7, '#3a506b');
      bgGradient.addColorStop(1, '#5bc0be');
      break;
    case 'nomad':
      bgGradient.addColorStop(0, '#3d1308');
      bgGradient.addColorStop(0.35, '#8c3a1e');
      bgGradient.addColorStop(0.7, '#e07a5f');
      bgGradient.addColorStop(1, '#f4f1de');
      break;
    case 'sanctuary':
      bgGradient.addColorStop(0, '#132a13');
      bgGradient.addColorStop(0.4, '#31572c');
      bgGradient.addColorStop(0.75, '#4f772d');
      bgGradient.addColorStop(1, '#ecf39e');
      break;
    case 'watchtower':
      bgGradient.addColorStop(0, '#1a1c23');
      bgGradient.addColorStop(0.5, '#343a40');
      bgGradient.addColorStop(0.8, '#495057');
      bgGradient.addColorStop(1, '#ced4da');
      break;
    case 'court':
      bgGradient.addColorStop(0, '#2b0918');
      bgGradient.addColorStop(0.45, '#5e1b34');
      bgGradient.addColorStop(0.8, '#9c3d54');
      bgGradient.addColorStop(1, '#e3b5a4');
      break;
    case 'deeprift':
      bgGradient.addColorStop(0, '#03071e');
      bgGradient.addColorStop(0.4, '#0f4c5c');
      bgGradient.addColorStop(0.75, '#2a9d8f');
      bgGradient.addColorStop(1, '#e9c46a');
      break;
    case 'canyon':
      bgGradient.addColorStop(0, '#3a1e12');
      bgGradient.addColorStop(0.35, '#7f4f24');
      bgGradient.addColorStop(0.7, '#ba6829');
      bgGradient.addColorStop(1, '#fed9b7');
      break;
    case 'foundry':
      bgGradient.addColorStop(0, '#1a0c06');
      bgGradient.addColorStop(0.4, '#481e14');
      bgGradient.addColorStop(0.75, '#993921');
      bgGradient.addColorStop(1, '#f4a261');
      break;
    case 'lichen':
      bgGradient.addColorStop(0, '#1b2a26');
      bgGradient.addColorStop(0.4, '#344e41');
      bgGradient.addColorStop(0.75, '#588157');
      bgGradient.addColorStop(1, '#dad7cd');
      break;
    default:
      bgGradient.addColorStop(0, '#111827');
      bgGradient.addColorStop(0.5, '#374151');
      bgGradient.addColorStop(1, '#9ca3af');
  }

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Sumber cahaya / Matahari / Bulan / Ambient Gloom
  const glowGrad = ctx.createRadialGradient(
    width * 0.55, height * 0.35, 10,
    width * 0.55, height * 0.35, width * 0.45
  );
  glowGrad.addColorStop(0, 'rgba(255, 250, 240, 0.45)');
  glowGrad.addColorStop(0.3, 'rgba(255, 230, 200, 0.2)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Lukis lanskap / elemen siluet sesuai tema
  drawThematicComposition(ctx, art, width, height);

  // Tekstur sapuan kuas halus (Canvas painterly texture overlay)
  addPainterlyGrain(ctx, width, height);

  // Frame dan Metadata Artbook Minimalis
  drawArtbookMetadata(ctx, art, width, height);

  return canvas;
}

function drawThematicComposition(ctx, art, w, h) {
  ctx.save();

  if (art.category === 'characters') {
    // Gambar siluet karakter berbusana detail dengan backdrop arsitektur
    drawCharacterSilhouette(ctx, art, w, h);
  } else if (art.category === 'studies') {
    // Gambar studi bebatuan / geologi / tebing ekspresif
    drawGeologicalStudies(ctx, art, w, h);
  } else {
    // Gambar lingkungan / landscape epic skala besar
    drawEpicEnvironment(ctx, art, w, h);
  }

  ctx.restore();
}

function drawEpicEnvironment(ctx, art, w, h) {
  // Lapis Pegunungan Jauh
  ctx.fillStyle = 'rgba(20, 25, 35, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.55);
  ctx.lineTo(w * 0.2, h * 0.42);
  ctx.lineTo(w * 0.45, h * 0.52);
  ctx.lineTo(w * 0.75, h * 0.38);
  ctx.lineTo(w, h * 0.5);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Kabut tengah (Middleground Fog)
  const fog = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.65);
  fog.addColorStop(0, 'rgba(255, 255, 255, 0)');
  fog.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  fog.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, h * 0.45, w, h * 0.2);

  // Lapis Tebing Tengah
  ctx.fillStyle = 'rgba(15, 18, 25, 0.65)';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.68);
  ctx.lineTo(w * 0.3, h * 0.58);
  ctx.lineTo(w * 0.5, h * 0.64);
  ctx.lineTo(w * 0.85, h * 0.52);
  ctx.lineTo(w, h * 0.6);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Struktur Utama (Monolit / Menara / Kuil / Reruntuhan)
  ctx.fillStyle = 'rgba(8, 10, 15, 0.92)';
  if (art.theme === 'monolith') {
    // Monolit obsidian miring raksasa
    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.2);
    ctx.lineTo(w * 0.54, h * 0.16);
    ctx.lineTo(w * 0.58, h * 0.8);
    ctx.lineTo(w * 0.38, h * 0.82);
    ctx.closePath();
    ctx.fill();

    // Kilau tepi batu obsidian
    ctx.strokeStyle = 'rgba(120, 220, 240, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.2);
    ctx.lineTo(w * 0.38, h * 0.82);
    ctx.stroke();
  } else if (art.theme === 'watchtower') {
    // Benteng tebing batu
    ctx.fillRect(w * 0.62, h * 0.32, w * 0.14, h * 0.45);
    ctx.fillRect(w * 0.59, h * 0.28, w * 0.2, h * 0.06);
    // Cahaya perapian di menara
    ctx.fillStyle = '#ff9f1c';
    ctx.fillRect(w * 0.68, h * 0.36, 14, 18);
  } else {
    // Formasi bebatuan raksasa / arsitektur kuno
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.28);
    ctx.lineTo(w * 0.48, h * 0.32);
    ctx.lineTo(w * 0.52, h * 0.85);
    ctx.lineTo(w * 0.28, h * 0.85);
    ctx.closePath();
    ctx.fill();
  }

  // Lapis Depan (Foreground Silhouette & Siluet Penjelajah)
  ctx.fillStyle = '#06080c';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.lineTo(w * 0.35, h * 0.82);
  ctx.lineTo(w * 0.65, h * 0.86);
  ctx.lineTo(w, h * 0.8);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Tokoh Pengembara Kecil untuk Skala (Sense of Scale ala Art Direction)
  drawTinyWanderer(ctx, w * 0.22, h * 0.76, 32);
}

function drawCharacterSilhouette(ctx, art, w, h) {
  // Garis grid sketsa dan studi proporsi kostum
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = h * 0.15; y < h * 0.85; y += h * 0.08) {
    ctx.beginPath();
    ctx.moveTo(w * 0.15, y);
    ctx.lineTo(w * 0.85, y);
    ctx.stroke();
  }

  // Siluet Tubuh & Kostum Bersejarah
  const cx = w * 0.5;
  const baseY = h * 0.78;

  ctx.fillStyle = 'rgba(15, 12, 18, 0.94)';

  // Jubah / Mantel / Rok besar mengembang (Grounded historical silhouette)
  ctx.beginPath();
  ctx.moveTo(cx - 30, h * 0.35); // bahu kiri
  ctx.lineTo(cx + 30, h * 0.35); // bahu kanan
  ctx.lineTo(cx + 120, baseY);  // tepi jubah bawah kanan
  ctx.lineTo(cx - 120, baseY);  // tepi jubah bawah kiri
  ctx.closePath();
  ctx.fill();

  // Tubuh bagian atas & kerah tinggi
  ctx.fillRect(cx - 35, h * 0.32, 70, h * 0.2);

  // Kepala & Mahkota / Tudung
  ctx.beginPath();
  ctx.arc(cx, h * 0.24, 28, 0, Math.PI * 2);
  ctx.fill();

  // Detail Lipatan Kain & Aksara Kostum
  ctx.strokeStyle = art.accentColor || '#a3e635';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.36);
  ctx.lineTo(cx - 20, baseY);
  ctx.moveTo(cx + 15, h * 0.42);
  ctx.lineTo(cx + 40, baseY);
  ctx.stroke();

  // Swatch Palet Warna Desain Kostum di Samping
  const swatchX = w * 0.12;
  const swatchY = h * 0.28;
  const colors = [art.accentColor, '#2b2d42', '#8d99ae', '#edf2f4', '#d90429'];
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(swatchX, swatchY + idx * 32, 22, 22);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(swatchX, swatchY + idx * 32, 22, 22);
  });
}

function drawGeologicalStudies(ctx, art, w, h) {
  // Studi tebing batu berlapis (Geological strata)
  const steps = 7;
  const sliceH = (h * 0.6) / steps;

  for (let i = 0; i < steps; i++) {
    const yTop = h * 0.25 + i * sliceH;
    const tone = 25 + i * 18;
    ctx.fillStyle = `rgb(${tone + 20}, ${tone}, ${tone - 10})`;

    ctx.beginPath();
    ctx.moveTo(w * 0.15, yTop);
    ctx.lineTo(w * 0.85, yTop + (Math.sin(i * 1.5) * 18));
    ctx.lineTo(w * 0.85, yTop + sliceH + 8);
    ctx.lineTo(w * 0.15, yTop + sliceH + 8);
    ctx.closePath();
    ctx.fill();

    // Guratan rekahan bebatuan (Cracks & faults)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.35 + (i * 20), yTop);
    ctx.lineTo(w * 0.38 + (i * 22), yTop + sliceH);
    ctx.stroke();
  }

  // Anotasi sudut kemiringan geologi ala sketchbook Claire Hummel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '500 16px monospace';
  ctx.fillText('STRIKE & DIP: 42° NW // BASALTIC STRATA', w * 0.18, h * 0.22);
}

function drawTinyWanderer(ctx, x, y, size) {
  ctx.fillStyle = '#050505';
  // Tubuh & Jubah pengembara
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.35, y);
  ctx.lineTo(x - size * 0.35, y);
  ctx.closePath();
  ctx.fill();

  // Tongkat penjelajah
  ctx.strokeStyle = '#f4a261';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + size * 0.4, y - size * 1.1);
  ctx.lineTo(x + size * 0.4, y);
  ctx.stroke();

  // Cahaya lentera
  ctx.fillStyle = '#ffe49e';
  ctx.beginPath();
  ctx.arc(x + size * 0.4, y - size * 0.8, 4, 0, Math.PI * 2);
  ctx.fill();
}

function addPainterlyGrain(ctx, w, h) {
  // Vignette dramatis
  const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawArtbookMetadata(ctx, art, w, h) {
  // Border halus
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Label Kategori & Tahun di pojok kiri atas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '700 18px "Raleway", "Montserrat", sans-serif';
  ctx.fillText(`${art.category.toUpperCase()} // ${art.year}`, 44, 56);

  // Judul Karya di pojok kiri bawah
  ctx.font = '700 24px "Raleway", "Montserrat", sans-serif';
  ctx.fillText(art.title.toUpperCase(), 44, h - 50);

  // Project / Role di bawah judul
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '500 15px "Montserrat", sans-serif';
  ctx.fillText(art.client, 44, h - 30);

  // Badge Warna Aksen di pojok kanan bawah
  ctx.fillStyle = art.accentColor || '#ffffff';
  ctx.fillRect(w - 60, h - 50, 16, 16);
}
