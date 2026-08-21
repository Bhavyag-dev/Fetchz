import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Download, Zap, Shield, Infinity as InfinityIcon, Star, Check } from "lucide-react";
import { VideoBackground } from "../components/VideoBackground";
import { NavBar } from "../components/NavBar";
import { HeroDownloader } from "../components/HeroDownloader";

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
  tint: string;
  icon: ReactNode;
};

const platforms: Platform[] = [
  {
    id: "youtube",
    name: "YouTube",
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
    tint: "#E1306C",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "Twitter / X",
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
    tint: "#E60023",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-3.64 19.32c-.09-.79-.17-2.02.04-2.9.19-.78 1.2-4.95 1.2-4.95s-.3-.6-.3-1.5c0-1.4.82-2.44 1.84-2.44.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.4-.24 1.02.51 1.85 1.51 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.17-4.28-4.17-2.92 0-4.63 2.19-4.63 4.45 0 .88.34 1.83.76 2.34.08.1.09.19.07.29-.08.32-.25 1.02-.28 1.16-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.02 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.05-.55-2.39-1.2l-.65 2.47c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" />
      </svg>
    ),
  },
];

function Index() {
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
          Fetchz pulls high-quality video and audio from Twitter, Pinterest, Instagram and YouTube.
          Drop a link, pick a format, get your file.
        </p>

        {/* Downloader — now connected to real backend */}
        <HeroDownloader />

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
                <div className="text-[15px] font-semibold tracking-tight font-schibsted text-white">
                  {p.name}
                </div>
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
              <div
                key={f.title}
                className="rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-7 hover:bg-black/40 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                  {f.icon}
                </div>
                <h3 className="mt-6 text-[19px] font-semibold tracking-tight font-fustat text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60 font-fustat">
                  {f.text}
                </p>
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
                  <div className="mt-4 text-[19px] font-semibold tracking-tight text-white">
                    {s.t}
                  </div>
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

        {/* Pricing Section */}
        <section id="pricing" className="mx-auto mt-32 w-full max-w-5xl">
          <div className="text-center font-fustat">
            <h2 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl text-white">
              Simple, transparent <span className="italic font-normal">pricing.</span>
            </h2>
            <p className="mt-3 text-base text-white/60 max-w-lg mx-auto">
              Start downloading for free today or upgrade to Pro for dedicated high-speed servers
              and batch processing.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 items-stretch">
            {/* Free Plan */}
            <div className="rounded-[28px] bg-black/30 backdrop-blur-md border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition font-fustat">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Free Plan
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70">
                    Always Free
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-white">$0</span>
                  <span className="text-sm text-white/50">/ forever</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Essential high-speed features for everyday media downloads.
                </p>

                <ul className="mt-8 space-y-3.5 text-sm text-white/80">
                  {[
                    "Unlimited video & audio grabs",
                    "Full HD 1080p & 4K video quality",
                    "High bitrate MP3 audio extraction",
                    "YouTube, X, Instagram & Pinterest",
                    "No account or sign-up required",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#downloader"
                className="mt-10 block w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/20 transition shadow-sm"
              >
                Start Downloading Free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-[28px] bg-gradient-to-b from-white/15 via-black/40 to-black/60 backdrop-blur-md border border-white/25 p-8 sm:p-10 flex flex-col justify-between shadow-2xl hover:border-white/40 transition font-fustat overflow-hidden">
              {/* Glowing accent background blur */}
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[rgba(90,225,76,0.15)] blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Pro Pass
                  </span>
                  <span className="rounded-full bg-[rgba(90,225,76,0.9)] px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-white">$4.99</span>
                  <span className="text-sm text-white/50">/ month</span>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Ultra-fast dedicated servers, batch downloads & priority queue.
                </p>

                <ul className="mt-8 space-y-3.5 text-sm text-white/90">
                  {[
                    "Everything in Free Plan",
                    "Cloud Vault: Save & organize media in custom collections",
                    "Stream & access your saved library anywhere on Fetchz",
                    "Ultra-fast dedicated proxy servers",
                    "Priority YouTube 4K & 8K queueing",
                    "Batch multi-link downloader",
                    "24/7 priority support",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(90,225,76,0.9)] text-black">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#downloader"
                className="mt-10 block w-full rounded-2xl bg-[rgba(90,225,76,0.9)] hover:bg-[rgba(90,225,76,1)] py-3.5 text-center text-sm font-bold text-black transition shadow-lg hover:shadow-[0_0_24px_rgba(90,225,76,0.4)]"
              >
                Upgrade to Pro
              </a>
            </div>
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
