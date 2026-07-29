import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
  { title: "Features", href: "#features" },
  { title: "Platforms", href: "#platforms" },
  { title: "FAQ", href: "#faq" },
];

export function NavBar() {
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
