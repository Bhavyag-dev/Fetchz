import { useState, useEffect } from "react";
import { Download, Video, Music, Image as ImageIcon, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaInfo, MediaFormat } from "../lib/types";
import { getDownloadUrl } from "../lib/api";

interface MediaResultProps {
  info: MediaInfo;
  onClose: () => void;
}

export function MediaResult({ info, onClose }: MediaResultProps) {
  const videoFormats = info.formats.filter((f) => f.isVideo);
  const audioFormats = info.formats.filter((f) => f.isAudio);

  const [tab, setTab] = useState<"video" | "audio">(videoFormats.length > 0 ? "video" : "audio");
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setIsVertical(false);
    setTab(videoFormats.length > 0 ? "video" : "audio");
  }, [info.url]);

  const activeFormats = tab === "video" ? videoFormats : audioFormats;

  const handleDownload = (format: MediaFormat) => {
    const url = getDownloadUrl(info.url, format.id);
    // Open in a new tab — the backend streams the file with Content-Disposition: attachment
    window.open(url, "_blank");
  };

  const handleImageDownload = () => {
    if (info.imageUrl) {
      window.open(info.imageUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="w-full mt-5 rounded-[18px] border border-white/10 bg-black/30 backdrop-blur-md p-5 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        {info.thumbnail && (
          <div className="shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <img
              src={info.thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Title & meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-white truncate font-fustat">
            {info.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 uppercase tracking-wider font-schibsted">
              {info.platform}
            </span>
            {info.author && (
              <span className="text-[12px] text-white/50 truncate font-schibsted">
                by {info.author}
              </span>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grid layout that adapts to vertical/horizontal video */}
      <div className={`mt-4 ${isVertical ? "grid gap-6 md:grid-cols-[240px_1fr] items-start" : "flex flex-col"}`}>
        
        {/* Media Preview Column */}
        <div className={isVertical ? "mx-auto w-full max-w-[240px]" : "w-full"}>
          {/* Thumbnail Preview for video posts */}
          {!info.isImage && info.thumbnail && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
              <img
                src={info.thumbnail}
                alt={info.title}
                className={`w-full bg-black object-cover ${isVertical ? "aspect-[9/16] max-h-[420px]" : "max-h-72"}`}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setIsVertical(img.naturalHeight > img.naturalWidth);
                  }
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                  <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Thumbnail fallback when no direct video URL */}
          {!info.isImage && (!previewUrl || previewFailed) && info.thumbnail && (
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <img
                src={info.thumbnail}
                alt={info.title}
                className={`w-full bg-black ${isVertical ? "aspect-[9/16] max-h-[420px] object-contain" : "max-h-56 object-contain"}`}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setIsVertical(img.naturalHeight > img.naturalWidth);
                  }
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Image-only post */}
          {info.isImage && info.imageUrl && (
            <div>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={info.imageUrl}
                  alt={info.title}
                  className={`w-full bg-black ${isVertical ? "aspect-[9/16] max-h-[420px] object-contain" : "max-h-72 object-contain"}`}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                      setIsVertical(img.naturalHeight > img.naturalWidth);
                    }
                  }}
                />
              </div>
              <button
                onClick={handleImageDownload}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition font-schibsted"
              >
                <Download className="h-4 w-4" />
                Save Image
              </button>
            </div>
          )}
        </div>

        {/* Video/Audio formats Column */}
        <div className="flex-1 w-full">
          {!info.isImage && activeFormats.length > 0 && (
            <>
              {/* Tab switcher */}
              {videoFormats.length > 0 && audioFormats.length > 0 && (
                <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10 w-fit">
                  <button
                    onClick={() => setTab("video")}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[11px] font-semibold transition font-schibsted ${
                      tab === "video"
                        ? "bg-white text-black shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" /> Video
                  </button>
                  <button
                    onClick={() => setTab("audio")}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[11px] font-semibold transition font-schibsted ${
                      tab === "audio"
                        ? "bg-white text-black shadow-sm"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Music className="h-3.5 w-3.5" /> Audio
                  </button>
                </div>
              )}

              {/* Format list */}
              <div className="mt-3 space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {activeFormats.map((format) => (
                    <motion.button
                      key={format.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      onClick={() => handleDownload(format)}
                      className="group w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 group-hover:text-white transition">
                          {format.isVideo ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <Music className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-[13px] font-medium text-white/90 font-schibsted">
                          {format.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {format.sizeBytes > 0 && (
                          <span className="text-[11px] text-white/40 font-schibsted">
                            {formatBytes(format.sizeBytes)}
                          </span>
                        )}
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 group-hover:bg-white group-hover:text-black transition">
                          <Download className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* No formats available */}
          {!info.isImage && activeFormats.length === 0 && (
            <div className="text-center text-[13px] text-white/50 font-schibsted py-4">
              No {tab} formats available for this media.
            </div>
          )}
        </div>
      </div>

      {/* No formats available */}
      {!info.isImage && activeFormats.length === 0 && (
        <div className="mt-4 text-center text-[13px] text-white/50 font-schibsted py-4">
          No {tab} formats available for this media.
        </div>
      )}
    </motion.div>
  );
}

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
