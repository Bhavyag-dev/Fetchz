# Fetchz

Fetchz is a web application for retrieving publicly available media from supported social platforms. Paste a post URL, review the available media, select a format, and download the result.

## Supported platforms

Fetchz supports public media from the following platforms.

| Platform | Video | Audio | Images |
| --- | --- | --- | --- |
| YouTube | Yes | Yes | No |
| X | Yes | Yes | Yes |
| Instagram | Yes | Yes | Yes |
| Threads | Yes | No | No |
| Pinterest | Yes | Yes | Yes |

Private, deleted, age-restricted, or sign-in-only posts cannot be downloaded.

## How it works

The frontend accepts a supported URL and requests media information from the backend.

The backend identifies the platform and retrieves metadata and available formats. YouTube downloads use yt-dlp. Threads uses its native page-data extractor. Other supported platforms use Cobalt with yt-dlp as a fallback where available.

The selected file is streamed through the backend so the browser receives a downloadable response.

## Project structure

```text
Fetchz/
  backend/
    app/api/          API routes for media information downloads and thumbnails
    lib/              Platform detection provider clients and media utilities
    types/            Backend TypeScript types
    middleware.ts     API CORS middleware
  frontend/
    src/components/   Downloader and interface components
    src/lib/          API client and shared frontend types
    src/routes/       Application routes
    public/           Static assets
  README.md           Project documentation
```

## Requirements

Install Node.js 20 or later.

Install yt-dlp and FFmpeg for YouTube downloads and yt-dlp fallback support.

```bash
brew install yt-dlp ffmpeg
```

## Run the backend

Open a terminal in the backend directory.

```bash
cd backend
npm install
npm run dev
```

The backend starts at `http://localhost:8080`.

## Run the frontend

Open a second terminal in the frontend directory.

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000` and uses `http://localhost:8080` as its default API URL.

## Configuration

The backend accepts these optional environment variables.

| Variable | Purpose |
| --- | --- |
| `COBALT_API_URL` | Cobalt API base URL |
| `YTDLP_PATH` | Path to the yt-dlp executable |
| `FFMPEG_PATH` | Path to the FFmpeg executable or directory |

The frontend accepts this optional environment variable.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend API base URL |

## API

### `POST /api/info`

Accepts a JSON body containing a supported URL. Returns media metadata and format options.

```json
{
  "url": "https://www.youtube.com/watch?v=example"
}
```

### `GET /api/download`

Accepts `url` and `format_id` query parameters. Streams the selected file as a browser download.

### `GET /api/thumbnail`

Accepts a `url` query parameter. Returns a proxied thumbnail where one is available.

## Development notes

Keep the frontend and backend running during local development. Do not commit credentials or provider tokens. Media providers can change their access rules and supported public content may vary over time.
