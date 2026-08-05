

# Project Knowledge & AI Context Window

This repository is **AI-native**, built and refactored from scratch using AI. To ensure that AI agents (such as Gemini, Claude, or GPT) can work on this project efficiently, this section defines the codebase architecture, file mapping, and context scopes.

## Codebase Context Windows (Scopes)

When performing a task, load only the files relevant to the active context window to minimize token usage:

### 1. Frontend UI Context
- **Entrypoints**: [__root.tsx](file:///Users/bhavyag/Projects/Fetchz/frontend/src/routes/__root.tsx), [index.tsx](file:///Users/bhavyag/Projects/Fetchz/frontend/src/routes/index.tsx), [router.tsx](file:///Users/bhavyag/Projects/Fetchz/frontend/src/router.tsx)
- **Key Components**: [HeroDownloader.tsx](file:///Users/bhavyag/Projects/Fetchz/frontend/src/components/HeroDownloader.tsx), [MediaResult.tsx](file:///Users/bhavyag/Projects/Fetchz/frontend/src/components/MediaResult.tsx), [styles.css](file:///Users/bhavyag/Projects/Fetchz/frontend/src/styles.css)

### 2. Backend API Context
- **API Routes**: Info [route.ts](file:///Users/bhavyag/Projects/Fetchz/backend/app/api/info/route.ts), Download [route.ts](file:///Users/bhavyag/Projects/Fetchz/backend/app/api/download/route.ts), Thumbnail [route.ts](file:///Users/bhavyag/Projects/Fetchz/backend/app/api/thumbnail/route.ts)
- **Downloader Core**: [media-fetcher.ts](file:///Users/bhavyag/Projects/Fetchz/backend/lib/media-fetcher.ts), [ytdlp.ts](file:///Users/bhavyag/Projects/Fetchz/backend/lib/ytdlp.ts), [cobalt.ts](file:///Users/bhavyag/Projects/Fetchz/backend/lib/cobalt.ts), [detect.ts](file:///Users/bhavyag/Projects/Fetchz/backend/lib/detect.ts)

### 3. Build & Config Context
- **Configs**: [Dockerfile](file:///Users/bhavyag/Projects/Fetchz/backend/Dockerfile), [vite.config.ts](file:///Users/bhavyag/Projects/Fetchz/frontend/vite.config.ts), [vercel.json](file:///Users/bhavyag/Projects/Fetchz/frontend/vercel.json)
