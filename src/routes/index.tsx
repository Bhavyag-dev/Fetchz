import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Download,
  Link2,
  Music,
  Video,
  Sparkles,
  Zap,
  Shield,
  Infinity as InfinityIcon,
  Check,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loopgrab — Download videos & audio from Twitter, Pinterest, Instagram, YouTube" },
      {
        name: "description",
        content:
          "Loopgrab is the fastest way to save videos and audio from Twitter, Pinterest, Instagram and YouTube. Paste a link, pick a format, download in seconds.",
      },
      { property: "og:title", content: "Loopgrab — Save any video or audio, instantly" },
      {
        property: "og:description",
        content:
          "One tool for Twitter, Pinterest, Instagram and YouTube. HD video, crisp MP3, no watermarks, no signup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Platform = {
  id: string;
  name: string;
  hint: string;
  color: string;
  icon: ReactNode;
};

const platforms: Platform[] = [
  {
    id: "youtube",
    name: "YouTube",
    hint: "youtube.com/watch?v=…",
    color: "oklch(0.68 0.24 25)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    hint: "instagram.com/reel/…",
    color: "oklch(0.72 0.2 340)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "Twitter / X",
    hint: "x.com/user/status/…",
    color: "oklch(0.88 0.02 260)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M17.53 3H20.5l-6.5 7.43L22 21h-6.06l-4.74-6.2L5.7 21H2.72l6.96-7.95L2 3h6.2l4.28 5.66L17.53 3Zm-1.06 16.2h1.64L7.6 4.7H5.85l10.62 14.5Z" />
      </svg>
    ),
  },
  {
    id: "pinterest",
    name: "Pinterest",
    hint: "pinterest.com/pin/…",
    color: "oklch(0.62 0.2 25)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-3.64 19.32c-.09-.79-.17-2.02.04-2.9.19-.78 1.2-4.95 1.2-4.95s-.3-.6-.3-1.5c0-1.4.82-2.44 1.84-2.44.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.4-.24 1.02.51 1.85 1.51 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.17-4.28-4.17-2.92 0-4.63 2.19-4.63 4.45 0 .88.34 1.83.76 2.34.08.1.09.19.07.29-.08.32-.25 1.02-.28 1.16-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.02 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.05-.55-2.39-1.2l-.65 2.47c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" />
      </svg>
    ),
  },
];

function Index() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"video" | "audio">("video");
  const [activePlatform, setActivePlatform] = useState<string>("youtube");
  const [status, setStatus] = useState<"idle" | "working" | "ready">("idle");

  const handleGrab = () => {
    if (!url.trim()) return;
    setStatus("working");
    setTimeout(() => setStatus("ready"), 1400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.22 310 / 0.35), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 h-[380px] w-[380px] rounded-full blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.19 210 / 0.28), transparent 70%)" }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
            <Download className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight">Loopgrab</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#platforms" className="transition hover:text-foreground">Platforms</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="#downloader"
          className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-card"
        >
          Get started
        </a>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            No signup · No watermarks · Free forever
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Save any video.
            <br />
            <span className="text-gradient">In one paste.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            Loopgrab pulls high-quality video and audio from Twitter, Pinterest, Instagram
            and YouTube. Drop a link, pick a format, get your file.
          </p>
        </div>

        {/* Downloader card */}
        <section id="downloader" className="mx-auto mt-14 max-w-3xl">
          <div className="glass shadow-glow rounded-3xl p-2 sm:p-3">
            {/* Platform tabs */}
            <div className="flex flex-wrap gap-1 rounded-2xl bg-background/40 p-1.5">
              {platforms.map((p) => {
                const active = activePlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlatform(p.id)}
                    className={`flex flex-1 min-w-[130px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-card text-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={active ? { color: p.color } : undefined}
                  >
                    {p.icon}
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* URL input + format */}
            <div className="mt-3 rounded-2xl bg-background/40 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
                  <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={`Paste ${platforms.find((p) => p.id === activePlatform)?.hint ?? "a link"}`}
                    className="w-full bg-transparent text-base placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleGrab}
                  disabled={!url.trim() || status === "working"}
                  className="bg-gradient-brand shadow-glow group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "working" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                      Fetching
                    </>
                  ) : (
                    <>
                      Grab it
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Format toggle */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Format
                </span>
                <div className="flex rounded-lg border border-border bg-card/60 p-1">
                  <button
                    onClick={() => setFormat("video")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      format === "video"
                        ? "bg-gradient-brand text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" /> Video · MP4
                  </button>
                  <button
                    onClick={() => setFormat("audio")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      format === "audio"
                        ? "bg-gradient-brand text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Music className="h-3.5 w-3.5" /> Audio · MP3
                  </button>
                </div>
              </div>

              {/* Result preview */}
              {status === "ready" && (
                <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                    {format === "video" ? <Video className="h-6 w-6" /> : <Music className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      Ready · {format === "video" ? "1080p MP4" : "320kbps MP3"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      From {platforms.find((p) => p.id === activePlatform)?.name}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Up to 4K quality</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No files stored</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Works on mobile</span>
          </div>
        </section>

        {/* Platforms strip */}
        <section id="platforms" className="mx-auto mt-28 max-w-5xl">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Works everywhere you scroll
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="glass group flex flex-col items-center gap-3 rounded-2xl p-6 transition hover:-translate-y-1"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110"
                  style={{ backgroundColor: `color-mix(in oklab, ${p.color} 22%, transparent)`, color: p.color }}
                >
                  {p.icon}
                </div>
                <div className="text-sm font-semibold">{p.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto mt-28 max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Built for people who <span className="text-gradient">just want the file</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              No forced ads before the download. No blurry rips. No sketchy popups.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Blazing fast",
                text: "Servers close to the source. Most grabs finish in under 4 seconds.",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Private by design",
                text: "We don't store your links, files, or history. Ever.",
              },
              {
                icon: <InfinityIcon className="h-5 w-5" />,
                title: "Unlimited grabs",
                text: "No daily caps. No sign-up wall. Paste as many links as you like.",
              },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-28 max-w-5xl">
          <div className="glass rounded-3xl p-8 sm:p-12">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { n: "01", t: "Copy the link", d: "From the app or browser share sheet." },
                { n: "02", t: "Paste into Loopgrab", d: "We detect the platform automatically." },
                { n: "03", t: "Pick video or audio", d: "Grab it in the quality you need." },
              ].map((s) => (
                <div key={s.n}>
                  <div className="text-gradient text-4xl font-semibold">{s.n}</div>
                  <div className="mt-3 text-lg font-semibold">{s.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto mt-28 max-w-3xl">
          <h2 className="text-center text-4xl font-semibold tracking-tight">Questions, answered</h2>
          <div className="mt-10 space-y-3">
            {[
              {
                q: "Is Loopgrab free?",
                a: "Yes. Every feature works with no account and no daily limit.",
              },
              {
                q: "Which qualities are available?",
                a: "Up to 4K for video (where the source supports it) and up to 320kbps MP3 for audio.",
              },
              {
                q: "Do you store the files?",
                a: "No. Downloads stream directly from source to your device. Nothing is kept on our servers.",
              },
              {
                q: "Is this legal?",
                a: "Loopgrab is a tool. Please only download content you own or have permission to save.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="glass group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium">
                  {item.q}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-28 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Loopgrab. Made for people who love a clean download.</p>
        </footer>
      </main>
    </div>
  );
}
