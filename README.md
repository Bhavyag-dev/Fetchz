# Fetchz

Fetchz downloads publicly available media from YouTube, X, Instagram, and Pinterest. Paste a post URL, preview the media, choose a format, and download it.

## Supported platforms

| Platform | Video | Audio | Images |
| --- | --- | --- | --- |
| YouTube | Yes | Yes | No |
| X | Yes | Yes | Yes |
| Instagram | Yes | Yes | Yes |
| Pinterest | Yes | Yes | Yes |

Private, deleted, age-restricted, sign-in-only, or platform-restricted posts cannot be downloaded.

## Architecture

The app is split into two deployable services:

```text
Browser → Vercel frontend → Render API → media provider
```

- `frontend/` is the Vite/TanStack web app. It is deployed to Vercel.
- `backend/` is a Next.js API. It is deployed to Render as a Docker web service because YouTube support requires `yt-dlp` and `FFmpeg`.
- The frontend calls the API using the build-time `VITE_API_URL` value.

## Deploy to Vercel and Render

Deploy the backend first, then use its public HTTPS URL when deploying the frontend.

### 1. Create the Render backend

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Render, select **New → Web Service** and connect the repository.
3. Use these settings:

   | Setting | Value |
   | --- | --- |
   | Runtime | `Docker` |
   | Root Directory | `backend` |
   | Dockerfile Path | `./Dockerfile` |
   | Health Check Path | `/api/health` |

4. Add the `FRONTEND_ORIGIN` environment variable after the Vercel deployment is created. Use the exact Vercel production URL, for example `https://fetchz.vercel.app`.
5. Deploy. Copy the resulting Render URL, such as `https://fetchz-api.onrender.com`.

The included [backend/Dockerfile](backend/Dockerfile) installs Node 20, FFmpeg, and yt-dlp. Do not use a static site for the backend. Render web services run the production command automatically and provide the `PORT` variable that Next.js uses.

> Render can spin down inactive instances on some plans. The first request after an idle period may be slower. Use an always-on plan if that is unacceptable.

### 2. Create the Vercel frontend

1. In Vercel, select **Add New → Project** and import the same repository.
2. Set **Root Directory** to `frontend`.
3. Vercel should detect Vite. Keep the build command as `npm run build`.
4. Add this environment variable for **Production** and **Preview**:

   | Variable | Value |
   | --- | --- |
   | `VITE_API_URL` | Your Render URL, for example `https://fetchz-api.onrender.com` |

5. Deploy and copy the Vercel URL.
6. Return to Render and set `FRONTEND_ORIGIN` to that exact Vercel URL. Redeploy the Render service.

`VITE_API_URL` is public browser configuration, not a secret. Vite embeds it into the frontend during the build, so changing it requires a new Vercel deployment.

### 3. Preview deployments and custom domains

The API only permits browser requests from local development and origins listed in `FRONTEND_ORIGIN`. To use Vercel preview deployments, add each allowed preview domain as a comma-separated value:

```text
FRONTEND_ORIGIN=https://fetchz.vercel.app,https://fetchz-git-main-your-team.vercel.app
```

After adding a custom frontend domain, include it in `FRONTEND_ORIGIN` and redeploy Render. Do not use `*` in production; restricting origins prevents other sites from using the API from a visitor’s browser.

### 4. Verify the deployment

From the Vercel site:

1. Paste a public YouTube URL and confirm the preview appears and a download completes.
2. Paste one public URL from X, Instagram, and Pinterest.
3. Open browser developer tools and confirm `POST /api/info` targets the Render URL and has no CORS error.
4. Confirm a Threads URL returns an unsupported-link error.

If a provider fails, check the Render service logs first. Provider availability can change and private or restricted posts are expected to fail.

## Local development

### Requirements

- Node.js 20 or newer
- `yt-dlp` and FFmpeg for YouTube downloads and yt-dlp fallback support

macOS:

```bash
brew install yt-dlp ffmpeg
```

### Backend

```bash
cd backend
cp .env.example .env.local
npm install
npm run dev
```

The API starts at `http://localhost:8080`.

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Change VITE_API_URL to http://localhost:8080 in .env.local
npm install
npm run dev
```

The frontend starts at `http://localhost:3000`.

## Environment variables

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes in production | Public base URL of the Render API, without a trailing slash. |

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `FRONTEND_ORIGIN` | Yes in production | Comma-separated, exact frontend origins permitted by CORS. |
| `COBALT_API_URL` | No | Base URL for a self-hosted Cobalt API. |
| `YTDLP_PATH` | No | Path to the yt-dlp executable when not using Docker. |
| `FFMPEG_PATH` | No | Path to FFmpeg or its directory when not using Docker. |

Never commit `.env.local` or credentials. The `.env.example` files document the safe configuration shape.

## API

### `POST /api/info`

Returns metadata and format options for a supported media URL.

```json
{
  "url": "https://www.youtube.com/watch?v=example"
}
```

### `GET /api/download`

Streams a selected format as a download. Required query parameters are `url` and `format_id`. Add `inline=true` only for browser video previews.

### `GET /api/thumbnail`

Returns a proxied thumbnail where one is available.

## Security and operational notes

- The backend validates incoming URLs and rejects unsupported platforms.
- Media downloads are proxied, and the API rejects local/private upstream URLs before fetching them.
- CORS is restricted to configured frontend origins in production.
- The service does not store downloaded files, but it does fetch public media on behalf of the requester.
- Keep yt-dlp current: provider changes can require extractor updates.
- Respect platform terms, copyright, and applicable laws when using Fetchz.

## Project structure

```text
Fetchz/
  backend/       Next.js API, Dockerfile, provider integrations
  frontend/      Vite/TanStack web app
  README.md      Setup and deployment guide
```
