---

# 3D Rube Goldberg Scroll Animation

An interactive 3D Rube Goldberg machine synced to scroll, built with **Astro**, **Three.js**, and **GSAP**.

![Demo](https://img.shields.io/badge/Demo-3D%20Animation-blue)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js\&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-FF6B6B?logo=astro\&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock\&logoColor=white)

---

## Features

* Scroll-driven 3D animation with camera sync
* Candy-style PBR materials & soft dynamic shadows
* Lenis smooth scrolling & GSAP UI effects
* Modular ES6 architecture with Astro
* Global API for control & debugging

---

## Quick Start

```bash
git clone <repo>
cd 3D_rube_goldberg_demo
npm install
npm run dev
```

Visit `http://localhost:4321`

---

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

---

## Structure

```
src/
├── pages/              # Astro pages
├── scripts/            # Three.js, GSAP, scroll logic
└── styles/             # CSS
public/
└── scene.glb           # 3D model
```

---

## License

MIT License

---

**Built with ❤️ Astro · Three.js · GSAP**

---
