# 🎨 3D Interactive Portfolio — Art Director & 2D Game Artist

> Terinspirasi dari estetika kurasi minimalis karya **Claire Hummel** ([clairehummel.com](https://www.clairehummel.com/)), dipadukan dengan pengalaman spasial modern **Three.js WebGL**.

---

## 🌟 Fitur Utama

- **Floating 3D Gallery (Three.js WebGL):**
  - Kartu portofolio melayang di ruang 3D dengan lengkungan sinematik (*curved wave gallery*).
  - Gerakan melayang organik (*organic procedural bobbing/oscillation*).
  - Efek pencahayaan interaktif (*interactive sheen point light*) yang mengikuti kursor mouse.
  - Efek paralaks kamera halus saat kursor digerakkan.
  - Partikel debu atmosferik (*ambient floating particles*) dan bayangan dasar lembut.

- **Interaksi & Raycasting Mulus:**
  - **Hover:** Kartu bergerak maju mendekati kamera dengan tilt halus (*GSAP easing*).
  - **Click to Inspect:** Kamera melakukan *smooth zoom-in* ke kartu yang dipilih, membuka modal detail produksi (*Production Specs, Client/Project, Tools, Lore, Visual Notes*).
- **Struktur 2 Kategori Utama (Sesuai Permintaan):**
  - **GAMES:** Menampung seluruh game interaktif dari **itch.io** (*Warmth & Whistles, Alchefmist, Cikeas Cileungsi Overflow, Doom Scrolling, Night Ride, Dream Inc, The Broke Billionaire*).
  - **ILLUSTRATION:** Menampung karya ilustrasi digital, desain karakter, dan eksplorasi grafis dari **Instagram (@chrst.fl)** (*Street Ninja / Crossover Concept, Visual Art Series*).
  - Ditampilkan dalam **2 kartu 3D berukuran besar dan elegan** di halaman utama dengan efek paralaks mouse dan pencahayaan dinamis.

- **Estetika Claire Hummel & Portofolio Personal Christoffel:**
  - Tipografi anggun mengombinasikan **Raleway** dan **Montserrat**.
  - Pendekatan *Artwork-First* dengan latar gelap slate netral (`#0d1117`) dan aksen tembaga hangat (`#e07a5f`).
  - Halaman **About & Resume** terintegrasi penuh dengan data CV resmi:
    - **Pendidikan:** S2 Desain ITB (2023–2025) & D4 Game Technology STMM MMTC Yogyakarta (2018–2022).
    - **Pengalaman:** Innersight Games, FSRD ITB, Lentera Nusantara, Game Changer Studio.
    - **Penghargaan:** Ganesha Talent Assistantship Scholarship (ITB 2023) & Juara 2 MAME Kemendikbudristek (2021).
    - **Kompetensi:** Adobe Illustrator (Ai), Photoshop (Ps), Blender (3D), Figma (UI/UX), Unity (C#).
    - **Akses Dokumen:** Tombol download PDF CV langsung dan tautan Google Drive CV.

- **Siap Pakai Tanpa Missing Images:**
  - Menggunakan generator kanvas prosedural berkualitas tinggi untuk menghasilkan visual konsep seni, palet warna, siluet pengembara, dan anotasi geologi secara instan.
  - Mendukung penggantian dengan file gambar/karya seni nyata Anda sendiri.

---

## 🚀 Cara Menjalankan Proyek

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terpasang di komputer Anda.

### 1. Menjalankan Server Pengembangan Lokal
Buka terminal di folder project ini:
```bash
npm run dev
```
Buka browser di alamat yang muncul (biasanya `http://localhost:3000`).

### 2. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/` dan siap di-deploy ke Vercel, Netlify, atau GitHub Pages.

---

## 🛠️ Panduan Personalisasi Konten

Semua data portofolio dikumpulkan dalam satu file yang sangat mudah diedit:

### 📁 `src/data/portfolioData.js`

1. **Ubah Informasi Pribadi & Kontak:**
   ```javascript
   export const personalInfo = {
     name: "NAMA ANDA",
     role: "ART DIRECTOR & 2D GAME ARTIST",
     tagline: "Slogan / filosofi desain Anda...",
     location: "Kota, Negara / Remote",
     email: "emailanda@domain.com",
     social: {
       artstation: "https://artstation.com/username",
       twitter: "https://twitter.com/username",
       // ...
     },
     bio: `Tulis biografi dan latar belakang profesional Anda di sini...`,
     experience: [
       // Tambahkan riwayat studio / game yang pernah Anda buat
     ]
   };
   ```

2. **Menambah / Mengubah Karya Portofolio:**
   Setiap karya memiliki konfigurasi seperti berikut:
   ```javascript
   {
     id: "art-custom-1",
     title: "Judul Karya Anda",
     category: "concept-art", // 'concept-art' | 'visual-dev' | 'characters' | 'illustration' | 'studies'
     year: "2024",
     client: "Nama Game / Proyek",
     role: "Peran Anda (misal: Lead Concept Artist)",
     tools: ["Photoshop", "Blender"],
     accentColor: "#3d5a80",
     description: "Catatan produksi, penjelasan desain, pencahayaan, dll.",
     aspect: { width: 16, height: 9 }
   }
   ```

3. **Menggunakan Gambar Asli Anda:**
   - Masukkan gambar karya Anda ke folder `public/images/`.
   - Di `src/three/CardManager.js`, Anda dapat memuat gambar menggunakan `THREE.TextureLoader().load('/images/nama-karya.jpg')`.

---

## 📂 Struktur Folder Proyek

```
Web/
├── index.html                   # Halaman HTML utama & struktur UI
├── package.json                 # Konfigurasi dependensi (Three.js, Vite, GSAP)
├── vite.config.js               # Konfigurasi server Vite
├── README.md                    # Dokumentasi lengkap
└── src/
    ├── main.js                  # Entry point aplikasi & render loop
    ├── style.css                # Styling CSS (Claire Hummel aesthetic & glassmorphism)
    ├── data/
    │   └── portfolioData.js     # [PENTING] Data profil, karya, kategori & resume
    ├── three/
    │   ├── SceneManager.js      # Pengaturan Three.js Scene, Camera, Renderer, Light & Parallax
    │   ├── CardManager.js       # Manajemen kartu 3D, layout wave, animasi floating & filter
    │   └── EnvironmentEffects.js# Partikel debu atmosferik & shadow receiver floor
    ├── ui/
    │   └── UIManager.js         # Pengatur filter bar, artwork detail modal, dan about modal
    └── utils/
        └── artworkCanvasGenerator.js # Generator kanvas prosedural konsep seni beresolusi tinggi
```

---

## 💡 Tips Pengoptimalan

- **Kamera & Jarak Pandang:** Sesuaikan `camera.position.set(0, 0, 16)` di `src/three/SceneManager.js` jika ingin galeri tampak lebih dekat atau lebih jauh.
- **Warna Pencahayaan:** Anda dapat mengubah warna `PointLight` dan `DirectionalLight` untuk menyesuaikan nuansa warna studio yang Anda sukai.
