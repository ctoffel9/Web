/**
 * Data Portofolio Personalisasi - Christoffel
 * 2 Kategori Utama:
 * 1. GAMES (Semua proyek game dari itch.io)
 * 2. ILLUSTRATION (Karya seni & grafis dari Instagram @chrst.fl)
 */

export const personalInfo = {
  name: "CHRISTOFFEL",
  nickname: "Chris",
  role: "ILLUSTRATOR & GAME DEVELOPER",
  titleSub: "2D Game Artist • UI/UX Designer • Visual Development",
  tagline: "Crafting engaging 2D game assets, character design, background illustration, and educational game mechanics.",
  location: "Bandung, West Java, Indonesia",
  email: "c.toffel9@gmail.com",
  phone: "+62 813 6838 0327",
  avatar: "./images/avatar.jpg",
  cvPdf: "./cv-christoffel.pdf",
  social: {
    instagram: "https://www.instagram.com/chrst.fl/",
    itchio: "https://christoffel.itch.io",
    linktree: "https://linktr.ee/christoffel",
    linkedin: "https://www.linkedin.com/in/christov27/",
    twitter: "https://twitter.com/chrst_fl",
    whatsapp: "https://api.whatsapp.com/send?phone=6281368380327",
    resumeDrive: "https://drive.google.com/file/d/13bmjgV6geHRY95HkYUCnfocecpjfK7n8/view?usp=sharing"
  },
  profileSummary: `Illustrator with over 2 years of experience crafting engaging 2D assets for mobile and PC games. Expertise includes character design, background illustration, and UI asset creation. Proficient in Adobe design tools (Photoshop and Illustrator), Figma, Blender, and Unity. Passionate about developing educational games that are both entertaining and informative.`,
  education: [
    {
      period: "2023 — 2025",
      degree: "Master in Design (S2)",
      institution: "Institut Teknologi Bandung (ITB)"
    },
    {
      period: "2018 — 2022",
      degree: "Game Technology (D4)",
      institution: "STMM MMTC Yogyakarta"
    }
  ],
  experience: [
    {
      role: "2D Artist",
      company: "Innersight Games",
      period: "Feb 2025 — Feb 2026",
      description: "Responsible for: Creating 2D illustration for game asset purposes such as in-game objects, character, environment, and key art."
    },
    {
      role: "Lecturer Assistant",
      company: "ITB Faculty of Art and Design (FSRD ITB)",
      period: "Feb 2024 – Jun 2024 & Feb 2025 – Jun 2025",
      description: "Responsible for: Assisting students in game design class, guiding them from the concept phase to a playable project."
    },
    {
      role: "2D Artist (Part Time & Intern)",
      company: "Lentera Nusantara",
      period: "Feb 2023 — Mar 2024",
      description: "Responsible for: Working as a 2D artist for initial and ongoing game development needs, including character design, environment design, and user interface design."
    },
    {
      role: "2D Artist (Intern)",
      company: "Game Changer Studio",
      period: "Aug 2021 — Nov 2021",
      description: "Responsible for: Assisting in converting frame-by-frame rough animations into ready-to-use game assets, and working as a character and environment concept artist."
    }
  ],
  achievements: [
    {
      title: "Ganesha Talent Assistantship Scholarship",
      year: "2023",
      issuer: "ITB Postgraduate Department",
      description: "Scholarship provided by ITB postgraduate department, awarded to master's students based on academic performance."
    },
    {
      title: "2nd Place MAME Competition (Group)",
      year: "2021",
      issuer: "BPMPK Kemendikbudristek",
      description: "National educational game-making competition organized by BPMPK Kemendikbudristek."
    }
  ],
  detailedSkills: [
    {
      icon: "Ai",
      name: "Adobe Illustrator",
      desc: "Proficient in creating complete graphic designs or individual vector assets such as icons, logos, game assets, and more."
    },
    {
      icon: "Ps",
      name: "Adobe Photoshop",
      desc: "Skilled in creating finished illustrations or concept art for characters and environments."
    },
    {
      icon: "3D",
      name: "Blender",
      desc: "Experienced in creating and texturing simple 3D models for both organic and non-organic designs, as well as in rigging and animating."
    },
    {
      icon: "Fi",
      name: "Figma",
      desc: "Capable of using Figma to design user interfaces for game development purposes."
    },
    {
      icon: "Un",
      name: "Unity & C#",
      desc: "Able to develop simple casual games using C# in Unity."
    }
  ],
  skills: [
    "2D Character & Sprite Design",
    "Environment & Background Illustration",
    "Game UI/UX Asset Creation",
    "Vector Graphic & Logo Design",
    "3D Blockout & Texturing (Blender)",
    "Educational Game Prototyping (Unity)"
  ],
  tools: [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Blender",
    "Unity (C#)",
    "Three.js / WebGL"
  ]
};

// Kategori Utama Portofolio (Games on itch.io)
export const heroCategories = [
  {
    id: "game",
    title: "GAMES",
    coverImage: "./images/warmth.png",
    subtitle: "Playable Titles, Simulations & Deckbuilding on itch.io",
    theme: "warmth",
    accentColor: "#a3e635",
    platform: "itch.io"
  }
];

export const artworks = [
  // ================= KATEGORI: GAMES (itch.io) =================
  {
    id: "art-warmth",
    title: "Warmth & Whistles",
    category: "game",
    label: "2024 • ITCH.IO",
    pastelTheme: "theme-peach",
    year: "2024",
    client: "Summerland Games",
    role: "Visual Development & 2D Art",
    tools: ["Digital Illustration", "Photoshop", "Unity"],
    accentColor: "#a3e635",
    theme: "warmth",
    image: "./images/warmth.png",
    itchUrl: "https://summerland-games.itch.io/warmth-and-whistles",
    playMode: "Play in browser / Windows Download",
    shortDesc: "Game simulasi menyeduh teh yang menenangkan di itch.io: 'One cup at a time, toward warmth and forgiveness.' Menghadirkan atmosfer visual hangat.",
    description: "Game simulasi menyeduh teh yang menenangkan di itch.io: 'One cup at a time, toward warmth and forgiveness.' Menghadirkan atmosfer visual hangat dan interaksi karakter naratif menyentuh.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-alchefmist",
    title: "Alchefmist",
    category: "game",
    label: "2025 • THESIS ITB",
    pastelTheme: "theme-lavender",
    year: "2025",
    client: "Master's Thesis Project | ITB",
    role: "Game Designer, Concept & 2D Artist",
    tools: ["Digital Illustration", "Game Mechanics", "Unity"],
    accentColor: "#a3e635",
    theme: "alchefmist",
    image: "./images/alchefmist.png",
    itchUrl: "https://christoffel.itch.io/alchefmist",
    playMode: "Play in browser (itch.io)",
    shortDesc: "Educational deck-building game di itch.io yang mengajarkan tata nama senyawa kimia melalui mekanisme kartu kuliner alkimia dan sistem reward engagement.",
    description: "Educational deck-building game di itch.io yang mengajarkan tata nama senyawa kimia melalui mekanisme kartu kuliner alkimia dan sistem reward engagement.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-cco",
    title: "Cikeas Cileungsi Overflow",
    category: "game",
    label: "2022 • STMM MMTC",
    pastelTheme: "theme-sage",
    year: "2022",
    client: "Undergraduate Final Project | STMM MMTC",
    role: "Lead Developer, Concept & 2D Artist",
    tools: ["Game Development", "Pixel & 2D Assets", "Unity / WebGL"],
    accentColor: "#a3e635",
    theme: "cco",
    image: "./images/cikeas-cileungsi.jpg",
    itchUrl: "https://christoffel.itch.io/cco",
    playMode: "Play in browser (itch.io)",
    shortDesc: "Permainan simulasi peringatan dini bencana banjir di daerah aliran sungai Cikeas-Cileungsi berbasis naratif dan strategi mitigasi, tersedia di itch.io.",
    description: "Permainan simulasi peringatan dini bencana banjir di daerah aliran sungai Cikeas-Cileungsi berbasis naratif dan strategi mitigasi, tersedia di itch.io.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-doomscroll",
    title: "Doom Scrolling (Masbook)",
    category: "game",
    label: "2024 • ROGUELIKE",
    pastelTheme: "theme-pink",
    year: "2024",
    client: "Summerland Games",
    role: "2D Card Artist & UI Designer",
    tools: ["Photoshop", "Digital Illustration", "Card Layout"],
    accentColor: "#a3e635",
    theme: "doomscroll",
    image: "./images/doom-scroll.png",
    itchUrl: "https://summerland-games.itch.io/doom-scroll",
    playMode: "Play in browser / Mobile (itch.io)",
    shortDesc: "Deckbuilding Roguelike about chasing social validation di itch.io. Desain kartu satir bertema feed media sosial, kecanduan notifikasi, dan algoritma digital.",
    description: "Deckbuilding Roguelike about chasing social validation di itch.io. Desain kartu satir bertema feed media sosial, kecanduan notifikasi, dan algoritma digital.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-nightride",
    title: "Night Ride",
    category: "game",
    label: "2024 • HORROR",
    pastelTheme: "theme-blue",
    year: "2024",
    client: "Collaboration with Ken Kenobi",
    role: "Environmental Concept & Atmosphere Art",
    tools: ["Photoshop", "Atmospheric Lighting"],
    accentColor: "#a3e635",
    theme: "nightride",
    image: "./images/night-ride.png",
    itchUrl: "https://kenthekenobi.itch.io/night-ride",
    playMode: "Play on itch.io",
    shortDesc: "Survival narrative horror game di itch.io: 'What awaits you at midnight when you're riding home?' Studi pencahayaan malam, kabut tebal, dan teror psikologis.",
    description: "Survival narrative horror game di itch.io: 'What awaits you at midnight when you're riding home?' Studi pencahayaan malam, kabut tebal, dan teror psikologis.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-dreaminc",
    title: "Dream Inc",
    category: "game",
    label: "2024 • FANTASY",
    pastelTheme: "theme-sunset",
    year: "2024",
    client: "Collaboration with wahyuunt97",
    role: "Card Illustration & Visual Development",
    tools: ["Card Illustration", "Photoshop"],
    accentColor: "#a3e635",
    theme: "dreaminc",
    image: "./images/dream-inc.png",
    itchUrl: "https://wahyuunt97.itch.io/dream-inc",
    playMode: "Play in browser (itch.io)",
    shortDesc: "Deck-building game di mana kamu bertugas sebagai Pengendali Mimpi di itch.io. Memadukan ilustrasi fantasi surealis dan tata letak kartu mistis.",
    description: "Deck-building game di mana kamu bertugas sebagai Pengendali Mimpi di itch.io. Memadukan ilustrasi fantasi surealis dan tata letak kartu mistis.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-billionaire",
    title: "The Broke Billionaire",
    category: "game",
    label: "2024 • TYPING GAME",
    pastelTheme: "theme-lime",
    year: "2024",
    client: "Collaboration with Mogi",
    role: "Graphic Design & Game Art",
    tools: ["Graphic Design", "UI Typography", "Browser Web"],
    accentColor: "#a3e635",
    theme: "billionaire",
    image: "./images/broke-billionaire.png",
    itchUrl: "https://fifmogi.itch.io/broke-billionaire",
    playMode: "Play in browser (itch.io)",
    shortDesc: "Decremental typing game di itch.io: 'Spend $1 billion in 10 minutes!' Desain visual berfokus pada antarmuka minimalis serba cepat dengan humor satir finansial.",
    description: "Decremental typing game di itch.io: 'Spend $1 billion in 10 minutes!' Desain visual berfokus pada antarmuka minimalis serba cepat dengan humor satir finansial.",
    aspect: { width: 315, height: 250 }
  },
  {
    id: "art-magehourglass",
    title: "Mage Hourglass",
    category: "game",
    label: "2026 • GMTK GAME JAM",
    pastelTheme: "theme-sunset",
    year: "2026",
    client: "GMTK Game Jam 2026",
    role: "Game Artist & Visual Development",
    tools: ["2D Character Design", "Boss Concept", "HTML5"],
    accentColor: "#f59e0b",
    theme: "magehourglass",
    image: "./images/mage-hourglass.png",
    itchUrl: "https://angelina-rianti.itch.io/magehourglass",
    playMode: "Play in browser (itch.io)",
    shortDesc: "Action bullet hell boss rush game untuk GMTK Game Jam 2026 dengan mekanik manipulasi waktu dan looping countdown.",
    description: "Action bullet hell boss rush game untuk GMTK Game Jam 2026 dengan mekanik manipulasi waktu dan looping countdown. Visual direction memadukan atmosfer arcane mistis dan ritme aksi intens.",
    aspect: { width: 315, height: 250 }
  }
];

