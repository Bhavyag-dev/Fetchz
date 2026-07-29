# Fetchz

Universal media downloader for X (Twitter), Instagram, Threads, and Pinterest. Paste a link, pick a quality, download as MP4 or extract as MP3.

## Structure

```
├── frontend/       # TanStack Start + React frontend app
│   ├── src/        # Source code (components, routes, hooks, lib)
│   ├── public/     # Static assets
│   └── ...         # Config files (vite, tsconfig, eslint, etc.)
├── backend/        # Next.js 14 API backend
│   ├── app/api/    # API routes (info, download, thumbnail)
│   ├── lib/        # Core logic (cobalt, yt-dlp, detection, formatting)
│   ├── types/      # TypeScript type definitions
│   └── ...         # Config files (next.config, tsconfig, etc.)
├── AGENTS.md
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server will start at `http://localhost:8080` (or the next available port).

### Backend

```bash
cd backend
npm install
npm run dev
```

The API server will start at `http://localhost:3000`.

#### System Dependencies

The backend requires `yt-dlp` and `ffmpeg` for media processing:

```bash
# macOS
brew install yt-dlp ffmpeg

# Or via pip
pip install -U yt-dlp
```

#### Environment Variables

Copy the example env file and configure as needed:

```bash
cp backend/.env.example backend/.env
```

See [backend/.env.example](backend/.env.example) for available options.

### API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/info` | POST | Fetch media info & available qualities |
| `/api/download` | POST | Stream media download (MP4/MP3) |
| `/api/thumbnail` | GET | Fetch media thumbnail |

## Supported Platforms

| Platform | Videos | Images | Notes |
|---|---|---|---|
| X (Twitter) | ✅ | ✅ | Public posts only |
| Instagram | ✅ | ✅ | Public posts and reels |
| Threads | ✅ | ✅ | Public posts |
| Pinterest | ✅ | ✅ | Public pins |

## Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

## License

This project is private. All rights reserved.
