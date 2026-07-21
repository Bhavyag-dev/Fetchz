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
  tint: string;
  icon: ReactNode;
};

const platforms: Platform[] = [
  {
    id: "youtube",
    name: "YouTube",
    hint: "youtube.com/watch?v=…",
    tint: "#FF0033",
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
    tint: "#E1306C",
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
    tint: "#0F0F14",
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
    tint: "#E60023",
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Soft colored orbs behind glass — provides the subject the blur reveals */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 left-[8%] h-[520px] w-[520px] rounded-full opacity-70 blur-3xl animate-float"
          style={{ background: "radial-gradient(circle, #FFD6E8 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-[15%] right-[-8%] h-[560px] w-[560px] rounded-full opacity-70 blur-3xl animate-float-slower"
          style={{ background: "radial-gradient(circle, #CFE4FF 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-[55%] left-[35%] h-[480px] w-[480px] rounded-full opacity-60 blur-3xl animate-float"
          style={{ background: "radial-gradient(circle, #E6DAFE 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[5%] left-[-6%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl animate-float-slower"
          style={{ background: "radial-gradient(circle, #FFE9C7 0%, transparent 65%)" }}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground">
              <Download className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Loopgrab</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#platforms" className="transition hover:text-foreground">Platforms</a>
            <a href="#faq" className="transition hover:text-foreground">FAQ</a>
          </nav>
          <a
            href="#downloader"
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Get started
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-subtle mx-auto mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            No signup · No watermarks · Free forever
          </div>
          <h1 className="text-balance text-[52px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-7xl">
            Save any video
            <br />
            <span className="font-display italic font-normal">in one paste.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-balance text-[17px] leading-relaxed text-muted-foreground">
            Loopgrab pulls high-quality video and audio from Twitter, Pinterest, Instagram
            and YouTube. Drop a link, pick a format, get your file.
          </p>
        </div>

        {/* Downloader card */}
        <section id="downloader" className="mx-auto mt-14 max-w-3xl">
          <div className="glass-strong rounded-[28px] p-2 sm:p-2.5">
            {/* Platform tabs */}
            <div className="glass-subtle flex flex-wrap gap-1 rounded-2xl p-1.5">
              {platforms.map((p) => {
                const active = activePlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlatform(p.id)}
                    className={`flex flex-1 min-w-[130px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={active ? { color: p.tint } : undefined}
                  >
                    {p.icon}
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* URL input + format */}
            <div className="mt-2.5 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="glass-subtle flex flex-1 items-center gap-3 rounded-xl px-4 py-3.5">
                  <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={`Paste ${platforms.find((p) => p.id === activePlatform)?.hint ?? "a link"}`}
                    className="w-full bg-transparent text-[15px] tracking-tight placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleGrab}
                  disabled={!url.trim() || status === "working"}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-[15px] font-semibold text-background shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_24px_-8px_rgba(0,0,0,0.3)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "working" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
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
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Format
                </span>
                <div className="glass-subtle flex rounded-lg p-1">
                  <button
                    onClick={() => setFormat("video")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      format === "video"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" /> Video · MP4
                  </button>
                  <button
                    onClick={() => setFormat("audio")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      format === "audio"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Music className="h-3.5 w-3.5" /> Audio · MP3
                  </button>
                </div>
              </div>

              {/* Result preview */}
              {status === "ready" && (
                <div className="glass mt-5 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                    {format === "video" ? <Video className="h-6 w-6" /> : <Music className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[15px] font-semibold tracking-tight">
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Up to 4K quality</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> No files stored</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Works on mobile</span>
          </div>
        </section>

        {/* Platforms strip */}
        <section id="platforms" className="mx-auto mt-32 max-w-5xl">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Works everywhere you scroll
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="glass group flex flex-col items-center gap-3 rounded-2xl p-7 transition duration-300 hover:-translate-y-1"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110"
                  style={{ backgroundColor: `${p.tint}18`, color: p.tint }}
                >
                  {p.icon}
                </div>
                <div className="text-[15px] font-semibold tracking-tight">{p.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto mt-32 max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
              Built for people who <span className="font-display italic font-normal">just want the file.</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground">
              No forced ads before the download. No blurry rips. No sketchy popups.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
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
              <div key={f.title} className="glass rounded-2xl p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                  {f.icon}
                </div>
                <h3 className="mt-6 text-[19px] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-32 max-w-5xl">
          <div className="glass-strong rounded-[28px] p-8 sm:p-14">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { n: "01", t: "Copy the link", d: "From the app or browser share sheet." },
                { n: "02", t: "Paste into Loopgrab", d: "We detect the platform automatically." },
                { n: "03", t: "Pick video or audio", d: "Grab it in the quality you need." },
              ].map((s) => (
                <div key={s.n}>
                  <div className="font-display text-5xl">{s.n}</div>
                  <div className="mt-4 text-[19px] font-semibold tracking-tight">{s.t}</div>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto mt-32 max-w-3xl">
          <h2 className="text-center text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
            Questions, <span className="font-display italic font-normal">answered.</span>
          </h2>
          <div className="mt-12 space-y-3">
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
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15.5px] font-medium tracking-tight">
                  {item.q}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-border pt-8 text-center text-[13px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Loopgrab. Made for people who love a clean download.</p>
        </footer>
      </main>
    </div>
  );
}
