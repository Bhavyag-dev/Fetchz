import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
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
  ChevronDown,
  ArrowUp,
  Star,
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { VideoBackground } from "../components/VideoBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fetchz — Download videos & audio from Twitter, Pinterest, Instagram, YouTube" },
      {
        name: "description",
        content:
          "Fetchz is the fastest way to save videos and audio from Twitter, Pinterest, Instagram and YouTube. Paste a link, pick a format, download in seconds.",
      },
      { property: "og:title", content: "Fetchz — Save any video or audio, instantly" },
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-3.64 19.32c-.09-.79-.17-2.02.04-2.9.19-.78 1.2-4.95 1.2-4.95s-.3-.6-.3-1.5c0-1.4.82-2.44 1.84-2.44.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.4-.24 1.02.51 1.85 1.51 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.17-4.28-4.17-2.92 0-4.63 2.19-4.63 4.45 0 .88.34 1.83.76 2.34.08.1.09.19.07.29-.08.32-.25 1.02-.28 1.16-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.02 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.05-.55-2.39-1.2l-.65 2.47c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" />
      </svg>
    ),
  },
];

function NavBar() {
  const navItems = [
    { title: "Features", href: "#features" },
    { title: "Platforms", href: "#platforms" },
    { title: "FAQ", href: "#faq" },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none px-4 sm:px-8 md:px-16 pt-4">
      <motion.nav
        initial={false}
        animate={{
          borderRadius: "9999px",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.2)",
          paddingLeft: scrolled ? (isDesktop ? "1.5rem" : "1rem") : "1.25rem",
          paddingRight: scrolled ? (isDesktop ? "1.5rem" : "1rem") : "1.25rem",
          maxWidth: scrolled ? (isDesktop ? "38rem" : "90%") : "72rem",
        }}
        style={{ marginLeft: "auto", marginRight: "auto" }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="pointer-events-auto w-full flex items-center justify-between py-3 bg-black/40 backdrop-blur-md border border-white/10 font-schibsted text-white"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white">
            <Download className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-[20px] [letter-spacing:-1.2px] text-white">
            Fetchz
          </span>
        </a>

        {/* Nav links */}
        <div className="ml-auto flex items-center gap-1">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
              onMouseEnter={() => setHovered(idx)}
            >
              {hovered === idx && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {item.title}
            </a>
          ))}

          {/* Separator */}
          <div className="h-4 w-px bg-white/20 mx-2" />

          {/* CTA */}
          <a
            href="#downloader"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Get started
          </a>
        </div>
      </motion.nav>
    </div>
  );
}

function Index() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"video" | "audio">("video");
  const [activePlatform, setActivePlatform] = useState<string>("youtube");
  const [status, setStatus] = useState<"idle" | "working" | "ready">("idle");
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);

  useEffect(() => {
    if (!appDropdownOpen) return;
    const handleDocumentClick = () => {
      setAppDropdownOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [appDropdownOpen]);

  const handleGrab = () => {
    if (!url.trim()) return;
    setStatus("working");
    setTimeout(() => setStatus("ready"), 1400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background and Overlay */}
      <VideoBackground videoUrl="/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" />
      <div className="fixed inset-0 bg-black/24 z-[1] pointer-events-none" />

      {/* Nav */}
      <NavBar />

      {/* Hero Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-[120px] pt-28 pb-24 flex flex-col items-center">


        {/* Main Headline */}
        <h1 className="font-fustat font-bold text-[52px] sm:text-6xl md:text-[80px] [letter-spacing:-4.8px] leading-none text-white text-center mt-[34px]">
          Save any video
          <br />
          <span className="italic font-normal">in one paste.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-[34px] max-w-[736px] md:w-[680px] font-fustat font-medium text-[20px] [letter-spacing:-0.4px] text-white/85 text-center leading-relaxed">
          Fetchz pulls high-quality video and audio from Twitter, Pinterest, Instagram and YouTube. Drop a link, pick a format, get your file.
        </p>

        {/* Downloader Search Input Box */}
        <section id="downloader" className="w-full max-w-[728px] mx-auto mt-[44px]">
          <div
            style={{ backgroundColor: "rgba(0,0,0,0.24)" }}
            className="w-full backdrop-blur-md rounded-[18px] p-5 border border-white/10 shadow-2xl flex flex-col justify-between h-[200px]"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between text-white font-schibsted font-medium text-[12px]">
              <div className="flex items-center gap-2">
                <span>Unlimited downloads</span>
                <button className="rounded bg-[rgba(90,225,76,0.89)] hover:bg-[rgba(90,225,76,1)] px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider transition">
                  Upgrade
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                <span>Powered by Fetchz API</span>
              </div>
            </div>

            {/* Main Input Area */}
            <div className="relative w-full flex items-center bg-white/8 rounded-[12px] border border-white/15 p-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={`Paste ${platforms.find((p) => p.id === activePlatform)?.hint ?? "a link"}...`}
                className="w-full bg-transparent text-[16px] text-white font-noto tracking-tight placeholder:text-white/40 focus:outline-none pl-3.5 pr-12 py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGrab();
                }}
              />
              <button
                onClick={handleGrab}
                disabled={!url.trim() || status === "working"}
                className="absolute right-2 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-black hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "working" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              {/* App Selector Dropdown replacing Attach, Voice, Prompts */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAppDropdownOpen(!appDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 rounded-[6px] bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition font-schibsted"
                >
                  <span style={{ color: platforms.find((p) => p.id === activePlatform)?.tint }}>
                    {platforms.find((p) => p.id === activePlatform)?.icon}
                  </span>
                  <span>{platforms.find((p) => p.id === activePlatform)?.name}</span>
                  <ChevronDown className="h-3 w-3 text-white/50" />
                </button>
                {appDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 z-40 w-48 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 p-1 shadow-2xl flex flex-col gap-0.5 animate-in fade-in duration-150">
                    {platforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePlatform(p.id);
                          setAppDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium transition ${activePlatform === p.id
                          ? "bg-white/15 text-white"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        <span style={{ color: p.tint }}>{p.icon}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Format Toggle + Character Counter */}
              <div className="flex items-center gap-4">
                <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => setFormat("video")}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${format === "video"
                      ? "bg-white text-black shadow-sm"
                      : "text-white/70 hover:text-white"
                      }`}
                  >
                    <Video className="h-3.5 w-3.5" /> MP4
                  </button>
                  <button
                    onClick={() => setFormat("audio")}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${format === "audio"
                      ? "bg-white text-black shadow-sm"
                      : "text-white/70 hover:text-white"
                      }`}
                  >
                    <Music className="h-3.5 w-3.5" /> MP3
                  </button>
                </div>

              </div>
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

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60 font-schibsted">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Up to 4K quality</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> No files stored</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Works on mobile</span>
          </div>
        </section>

        {/* Platforms strip */}
        <section id="platforms" className="mx-auto mt-32 w-full max-w-5xl">
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 font-schibsted">
            Works everywhere you scroll
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-7 transition duration-300 hover:-translate-y-1 hover:bg-black/40"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110"
                  style={{ backgroundColor: `${p.tint}22`, color: p.tint }}
                >
                  {p.icon}
                </div>
                <div className="text-[15px] font-semibold tracking-tight font-schibsted text-white">{p.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto mt-32 w-full max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl font-fustat text-white">
              Built for people who <span className="italic font-normal">just want the file.</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70 font-fustat">
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
              <div key={f.title} className="rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-7 hover:bg-black/40 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  {f.icon}
                </div>
                <h3 className="mt-6 text-[19px] font-semibold tracking-tight font-fustat text-white">{f.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60 font-fustat">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto mt-32 w-full max-w-5xl">
          <div className="rounded-[28px] bg-black/30 backdrop-blur-md border border-white/10 p-8 sm:p-14">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { n: "01", t: "Copy the link", d: "From the app or browser share sheet." },
                { n: "02", t: "Paste into Fetchz", d: "We detect the platform automatically." },
                { n: "03", t: "Pick video or audio", d: "Grab it in the quality you need." },
              ].map((s) => (
                <div key={s.n} className="font-fustat">
                  <div className="text-5xl font-light text-white/20">{s.n}</div>
                  <div className="mt-4 text-[19px] font-semibold tracking-tight text-white">{s.t}</div>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/60">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto mt-32 w-full max-w-3xl">
          <h2 className="text-center text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl font-fustat text-white">
            Questions, <span className="italic font-normal">answered.</span>
          </h2>
          <div className="mt-12 space-y-3">
            {[
              {
                q: "Is Fetchz free?",
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
                a: "Fetchz is a tool. Please only download content you own or have permission to save.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-5 [&_summary::-webkit-details-marker]:hidden font-fustat transition hover:bg-black/40"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15.5px] font-medium tracking-tight text-white">
                  {item.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 w-full border-t border-white/10 pt-8 text-center text-[13px] text-white/50 font-schibsted">
          <p>© {new Date().getFullYear()} Fetchz. Made for people who love a clean download.</p>
        </footer>
      </main>
    </div>
  );
}
