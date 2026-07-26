# Fetchz

> Save any video or audio — in one paste.

Fetchz is a modern, privacy-first web app for downloading videos and audio from **YouTube**, **Instagram**, **Twitter / X**, and **Pinterest**. Paste a link, pick a format (MP4 or MP3), and get your file in seconds — no sign-up, no daily limits, no stored data.

---

## ✨ Features

- **Multi-platform support** — YouTube, Instagram, Twitter/X, Pinterest
- **Video & audio** — Download as MP4 (up to 4K) or MP3 (up to 320 kbps)
- **Privacy-first** — No files, links, or history are stored on our servers
- **Blazing fast** — Most downloads finish in under 4 seconds
- **Unlimited downloads** — No daily caps or sign-up walls
- **Responsive design** — Works seamlessly on desktop and mobile
- **Animated UI** — Smooth Framer Motion transitions, glassmorphism, and video background

---

## 🛠 Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| Framework    | [TanStack Start](https://tanstack.com/start) + React 19           |
| Language     | TypeScript                                                        |
| Styling      | Tailwind CSS v4 + shadcn/ui (New York style)                      |
| Animations   | Framer Motion                                                     |
| Routing      | TanStack Router                                                   |
| Data Fetching| TanStack React Query                                              |
| Forms        | React Hook Form + Zod                                             |
| Build Tool   | Vite 8                                                            |
| Server       | Nitro (Cloudflare-ready)                                          |
| Icons        | Lucide React                                                      |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** (a `bun.lock` is included)

### Install & Run

```sh
# Clone the repo
git clone https://github.com/Bhavyag-dev/Fetchz.git
cd Fetchz

# Install dependencies
npm install
# or
bun install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

---

## 📁 Project Structure

```
Fetchz/
├── public/                  # Static assets (video background, etc.)
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── VideoBackground.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.tsx
│   ├── lib/                 # Utilities & helpers
│   │   ├── utils.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   └── lovable-error-reporting.ts
│   ├── routes/              # TanStack file-based routes
│   │   ├── __root.tsx       # Root layout
│   │   └── index.tsx        # Home / landing page
│   ├── router.tsx           # Router configuration
│   ├── server.ts            # Custom SSR entry (error-handling wrapper)
│   ├── start.ts             # TanStack Start entry
│   ├── styles.css           # Global styles & Tailwind config
│   └── routeTree.gen.ts     # Auto-generated route tree
├── components.json          # shadcn/ui configuration
├── vite.config.ts           # Vite + TanStack Start + Nitro config
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📜 Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server                |
| `npm run build`    | Production build                         |
| `npm run build:dev`| Development-mode build                   |
| `npm run preview`  | Preview the production build locally     |
| `npm run lint`     | Lint with ESLint                         |
| `npm run format`   | Format code with Prettier                |

---

## 🌐 Deployment

The project is configured with **Nitro** targeting **Cloudflare** by default. Build output goes to:

```
dist/
├── server/   # Server-side bundle
└── client/   # Static client assets
```

To deploy, run `npm run build` and follow your hosting provider's instructions for deploying Nitro-based apps.

---

## 📄 License

This project is private. All rights reserved.
