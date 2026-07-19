# Knots Systems

The official landing platform for **Knots Systems** — the world's most respected engineering competency platform. Built to transform world-class engineering education into structured, project-based implementation.

## 🚀 Tech Stack

This project is built with a highly optimized, premium SaaS architecture targeting 120 FPS performance:

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/)

## ⚡ Performance Features

- **Zero-lag Custom Cursor**: Bypasses React state completely for native 1:1 hardware mouse tracking.
- **GPU-Instanced 3D WebGL**: Custom GLSL Vertex and Fragment shaders render the luxury 3D fabric ribbons natively on the GPU via `InstancedMesh`, completely eliminating CPU overhead and JavaScript garbage collection lag.
- **Scroll Decoupling**: Animation loop reads directly from native `window.scrollY` bypassing React's render loop, ensuring absolute maximum scroll fluidity.

## 💻 Running Locally

To run the development server on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the site:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Deployment

This repository is optimized for zero-configuration deployment on [Vercel](https://vercel.com). Simply import the GitHub repository into your Vercel dashboard and deploy. 

No custom build commands are necessary.
