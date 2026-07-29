import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  Sparkles,
  Video,
  Music,
  ChevronDown,
  ArrowUp,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMediaInfo } from "../lib/api";
import type { MediaInfo } from "../lib/types";
import { MediaResult } from "./MediaResult";

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

export function HeroDownloader() {
  const [url, setUrl] = useState("");
  const [activePlatform, setActivePlatform] = useState<string>("youtube");
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!appDropdownOpen) return;
    const handleDocumentClick = () => setAppDropdownOpen(false);
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [appDropdownOpen]);

  // Auto-detect platform from URL as user types
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (/twitter\.com|x\.com/i.test(trimmed)) setActivePlatform("twitter");
    else if (/instagram\.com/i.test(trimmed)) setActivePlatform("instagram");
    else if (/threads\.(net|com)/i.test(trimmed)) setActivePlatform("instagram");
    else if (/pinterest\.(com|ca|co\.uk|fr|de|jp)|pin\.it/i.test(trimmed)) setActivePlatform("pinterest");
    else if (/youtube\.com|youtu\.be/i.test(trimmed)) setActivePlatform("youtube");
  }, [url]);

  const handleGrab = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage("");
    setMediaInfo(null);

    try {
      const info = await fetchMediaInfo(trimmed);
      setMediaInfo(info);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setMediaInfo(null);
    setErrorMessage("");
  };

  const handleClear = () => {
    setUrl("");
    setStatus("idle");
    setMediaInfo(null);
    setErrorMessage("");
  };

  return (
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
            className="w-full bg-transparent text-[16px] text-white font-noto tracking-tight placeholder:text-white/40 focus:outline-none pl-3.5 pr-[5.5rem] py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGrab();
            }}
            disabled={status === "loading"}
          />
          {/* Clear button */}
          {url.trim() && status !== "loading" && (
            <button
              onClick={handleClear}
              className="absolute right-12 flex h-[28px] w-[28px] items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition"
              aria-label="Clear URL"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleGrab}
            disabled={!url.trim() || status === "loading"}
            className="absolute right-2 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-black hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* App Selector Dropdown */}
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
                    className={`flex items-center gap-2 w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                      activePlatform === p.id
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

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {status === "loading" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-white/50 font-schibsted"
              >
                Fetching media info…
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {status === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-[13px] text-red-300 font-schibsted"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
            <button
              onClick={handleClose}
              className="ml-auto text-red-300/60 hover:text-red-300 transition text-[11px] font-medium"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {status === "success" && mediaInfo && (
          <MediaResult info={mediaInfo} onClose={handleClose} />
        )}
      </AnimatePresence>

      {/* Trust row */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60 font-schibsted">
        <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Up to 4K quality</span>
        <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> No files stored</span>
        <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Works on mobile</span>
      </div>
    </section>
  );
}
