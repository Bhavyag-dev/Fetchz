import { a as __toESM } from "../_runtime.mjs";
import { i as performance_default, n as useMotionValueEvent, r as motion, t as useScroll } from "../_libs/framer-motion.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as Music, c as ChevronDown, i as Shield, l as Check, n as Video, o as Infinity$1, r as Sparkles, s as Download, t as Zap, u as ArrowUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-3RgmUKfi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VideoBackground({ videoUrl }) {
	const videoRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(null);
	const fadingOutRef = (0, import_react.useRef)(false);
	const opacityRef = (0, import_react.useRef)(0);
	const animateOpacity = (target, duration, callback) => {
		if (animFrameRef.current !== null) {
			cancelAnimationFrame(animFrameRef.current);
			animFrameRef.current = null;
		}
		const startOpacity = opacityRef.current;
		const startTime = performance_default.now();
		const step = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const current = startOpacity + (target - startOpacity) * progress;
			opacityRef.current = current;
			if (videoRef.current) videoRef.current.style.opacity = current.toString();
			if (progress < 1) animFrameRef.current = requestAnimationFrame(step);
			else {
				animFrameRef.current = null;
				if (callback) callback();
			}
		};
		animFrameRef.current = requestAnimationFrame(step);
	};
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (video) {
			video.style.opacity = "0";
			opacityRef.current = 0;
			const playVideo = async () => {
				try {
					await video.play();
					animateOpacity(1, 250);
				} catch (err) {
					console.warn("Video autoplay blocked or failed:", err);
				}
			};
			playVideo();
		}
		return () => {
			if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
		};
	}, []);
	const handleTimeUpdate = () => {
		const video = videoRef.current;
		if (!video) return;
		const duration = video.duration;
		const currentTime = video.currentTime;
		if (duration && !fadingOutRef.current) {
			if (duration - currentTime <= .55) {
				fadingOutRef.current = true;
				animateOpacity(0, 250);
			}
		}
	};
	const handleEnded = () => {
		if (videoRef.current) {
			videoRef.current.style.opacity = "0";
			opacityRef.current = 0;
		}
		fadingOutRef.current = false;
		setTimeout(() => {
			const video = videoRef.current;
			if (video) {
				video.currentTime = 0;
				video.play().then(() => {
					animateOpacity(1, 250);
				}).catch((err) => {
					console.error("Video play on loop failed:", err);
				});
			}
		}, 100);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 overflow-hidden z-0 pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			src: videoUrl,
			muted: true,
			playsInline: true,
			onTimeUpdate: handleTimeUpdate,
			onEnded: handleEnded,
			className: "w-[115%] h-[115%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center pointer-events-none",
			style: { opacity: 0 }
		})
	});
}
var platforms = [
	{
		id: "youtube",
		name: "YouTube",
		hint: "youtube.com/watch?v=…",
		tint: "#FF0033",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "h-4 w-4",
			fill: "currentColor",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" })
		})
	},
	{
		id: "instagram",
		name: "Instagram",
		hint: "instagram.com/reel/…",
		tint: "#E1306C",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "h-4 w-4",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "3",
					y: "3",
					width: "18",
					height: "18",
					rx: "5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "17.5",
					cy: "6.5",
					r: "1",
					fill: "currentColor"
				})
			]
		})
	},
	{
		id: "twitter",
		name: "Twitter / X",
		hint: "x.com/user/status/…",
		tint: "#0F0F14",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "h-4 w-4",
			fill: "currentColor",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.53 3H20.5l-6.5 7.43L22 21h-6.06l-4.74-6.2L5.7 21H2.72l6.96-7.95L2 3h6.2l4.28 5.66L17.53 3Zm-1.06 16.2h1.64L7.6 4.7H5.85l10.62 14.5Z" })
		})
	},
	{
		id: "pinterest",
		name: "Pinterest",
		hint: "pinterest.com/pin/…",
		tint: "#E60023",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "h-4 w-4",
			fill: "currentColor",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2a10 10 0 0 0-3.64 19.32c-.09-.79-.17-2.02.04-2.9.19-.78 1.2-4.95 1.2-4.95s-.3-.6-.3-1.5c0-1.4.82-2.44 1.84-2.44.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.4-.24 1.02.51 1.85 1.51 1.85 1.82 0 3.22-1.92 3.22-4.69 0-2.45-1.76-4.17-4.28-4.17-2.92 0-4.63 2.19-4.63 4.45 0 .88.34 1.83.76 2.34.08.1.09.19.07.29-.08.32-.25 1.02-.28 1.16-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.02 0-3.27 2.38-6.28 6.86-6.28 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.05-.55-2.39-1.2l-.65 2.47c-.23.9-.87 2.03-1.3 2.72A10 10 0 1 0 12 2Z" })
		})
	}
];
function NavBar() {
	const navItems = [
		{
			title: "Features",
			href: "#features"
		},
		{
			title: "Platforms",
			href: "#platforms"
		},
		{
			title: "FAQ",
			href: "#faq"
		}
	];
	const [hovered, setHovered] = (0, import_react.useState)(null);
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [isDesktop, setIsDesktop] = (0, import_react.useState)(true);
	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 20);
	});
	(0, import_react.useEffect)(() => {
		const update = () => setIsDesktop(window.innerWidth >= 768);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 top-0 z-50 pointer-events-none px-4 sm:px-8 md:px-16 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.nav, {
			initial: false,
			animate: {
				borderRadius: "9999px",
				boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.2)",
				paddingLeft: scrolled ? isDesktop ? "1.5rem" : "1rem" : "1.25rem",
				paddingRight: scrolled ? isDesktop ? "1.5rem" : "1rem" : "1.25rem",
				maxWidth: scrolled ? isDesktop ? "38rem" : "90%" : "72rem"
			},
			style: {
				marginLeft: "auto",
				marginRight: "auto"
			},
			transition: {
				type: "spring",
				stiffness: 120,
				damping: 22
			},
			className: "pointer-events-auto w-full flex items-center justify-between py-3 bg-black/40 backdrop-blur-md border border-white/10 font-schibsted text-white",
			onMouseLeave: () => setHovered(null),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/",
				className: "flex items-center gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "h-4 w-4",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-[20px] [letter-spacing:-1.2px] text-white",
					children: "Fetchz"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-1",
				children: [
					navItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: item.href,
						className: "relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors",
						onMouseEnter: () => setHovered(idx),
						children: [hovered === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							layoutId: "nav-pill",
							className: "absolute inset-0 rounded-full bg-white/10 -z-10",
							transition: {
								type: "spring",
								stiffness: 350,
								damping: 30
							}
						}), item.title]
					}, idx)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-white/20 mx-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#downloader",
						className: "rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black hover:opacity-90 transition",
						children: "Get started"
					})
				]
			})]
		})
	});
}
function Index() {
	const [url, setUrl] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("video");
	const [activePlatform, setActivePlatform] = (0, import_react.useState)("youtube");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [appDropdownOpen, setAppDropdownOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoBackground, { videoUrl: "/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/24 z-[1] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-[120px] pt-28 pb-24 flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-fustat font-bold text-[52px] sm:text-6xl md:text-[80px] [letter-spacing:-4.8px] leading-none text-white text-center mt-[34px]",
						children: [
							"Save any video",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic font-normal",
								children: "in one paste."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-[34px] max-w-[736px] md:w-[680px] font-fustat font-medium text-[20px] [letter-spacing:-0.4px] text-white/85 text-center leading-relaxed",
						children: "Fetchz pulls high-quality video and audio from Twitter, Pinterest, Instagram and YouTube. Drop a link, pick a format, get your file."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "downloader",
						className: "w-full max-w-[728px] mx-auto mt-[44px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { backgroundColor: "rgba(0,0,0,0.24)" },
								className: "w-full backdrop-blur-md rounded-[18px] p-5 border border-white/10 shadow-2xl flex flex-col justify-between h-[200px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-white font-schibsted font-medium text-[12px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unlimited downloads" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "rounded bg-[rgba(90,225,76,0.89)] hover:bg-[rgba(90,225,76,1)] px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider transition",
												children: "Upgrade"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-white/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Powered by Fetchz API" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full flex items-center bg-white/8 rounded-[12px] border border-white/15 p-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: url,
											onChange: (e) => setUrl(e.target.value),
											placeholder: `Paste ${platforms.find((p) => p.id === activePlatform)?.hint ?? "a link"}...`,
											className: "w-full bg-transparent text-[16px] text-white font-noto tracking-tight placeholder:text-white/40 focus:outline-none pl-3.5 pr-12 py-2",
											onKeyDown: (e) => {
												if (e.key === "Enter") handleGrab();
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleGrab,
											disabled: !url.trim() || status === "working",
											className: "absolute right-2 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-black hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed",
											children: status === "working" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: (e) => {
													e.stopPropagation();
													setAppDropdownOpen(!appDropdownOpen);
												},
												className: "flex items-center gap-1.5 rounded-[6px] bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition font-schibsted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: { color: platforms.find((p) => p.id === activePlatform)?.tint },
														children: platforms.find((p) => p.id === activePlatform)?.icon
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: platforms.find((p) => p.id === activePlatform)?.name }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 text-white/50" })
												]
											}), appDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute left-0 bottom-full mb-2 z-40 w-48 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 p-1 shadow-2xl flex flex-col gap-0.5 animate-in fade-in duration-150",
												children: platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setActivePlatform(p.id);
														setAppDropdownOpen(false);
													},
													className: `flex items-center gap-2 w-full text-left rounded-md px-2.5 py-1.5 text-xs font-medium transition ${activePlatform === p.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: { color: p.tint },
														children: p.icon
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name })]
												}, p.id))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex bg-white/10 rounded-lg p-0.5 border border-white/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setFormat("video"),
													className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${format === "video" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" }), " MP4"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setFormat("audio"),
													className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${format === "audio" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-3.5 w-3.5" }), " MP3"]
												})]
											})
										})]
									})
								]
							}),
							status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass mt-5 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-foreground text-background",
										children: format === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-[15px] font-semibold tracking-tight",
											children: ["Ready · ", format === "video" ? "1080p MP4" : "320kbps MP3"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 truncate text-xs text-muted-foreground",
											children: ["From ", platforms.find((p) => p.id === activePlatform)?.name]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60 font-schibsted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Up to 4K quality"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " No files stored"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Works on mobile"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "platforms",
						className: "mx-auto mt-32 w-full max-w-5xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 font-schibsted",
							children: "Works everywhere you scroll"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex flex-col items-center gap-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-7 transition duration-300 hover:-translate-y-1 hover:bg-black/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110",
									style: {
										backgroundColor: `${p.tint}22`,
										color: p.tint
									},
									children: p.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[15px] font-semibold tracking-tight font-schibsted text-white",
									children: p.name
								})]
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "features",
						className: "mx-auto mt-32 w-full max-w-5xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-2xl text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl font-fustat text-white",
								children: ["Built for people who ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "italic font-normal",
									children: "just want the file."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-[17px] leading-relaxed text-white/70 font-fustat",
								children: "No forced ads before the download. No blurry rips. No sketchy popups."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-14 grid gap-4 md:grid-cols-3",
							children: [
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" }),
									title: "Blazing fast",
									text: "Servers close to the source. Most grabs finish in under 4 seconds."
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" }),
									title: "Private by design",
									text: "We don't store your links, files, or history. Ever."
								},
								{
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "h-5 w-5" }),
									title: "Unlimited grabs",
									text: "No daily caps. No sign-up wall. Paste as many links as you like."
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-7 hover:bg-black/40 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white",
										children: f.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-[19px] font-semibold tracking-tight font-fustat text-white",
										children: f.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[14.5px] leading-relaxed text-white/60 font-fustat",
										children: f.text
									})
								]
							}, f.title))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto mt-32 w-full max-w-5xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-[28px] bg-black/30 backdrop-blur-md border border-white/10 p-8 sm:p-14",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-10 md:grid-cols-3",
								children: [
									{
										n: "01",
										t: "Copy the link",
										d: "From the app or browser share sheet."
									},
									{
										n: "02",
										t: "Paste into Fetchz",
										d: "We detect the platform automatically."
									},
									{
										n: "03",
										t: "Pick video or audio",
										d: "Grab it in the quality you need."
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-fustat",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-5xl font-light text-white/20",
											children: s.n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 text-[19px] font-semibold tracking-tight text-white",
											children: s.t
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-[14.5px] leading-relaxed text-white/60",
											children: s.d
										})
									]
								}, s.n))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "faq",
						className: "mx-auto mt-32 w-full max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-center text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl font-fustat text-white",
							children: ["Questions, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "italic font-normal",
								children: "answered."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-12 space-y-3",
							children: [
								{
									q: "Is Fetchz free?",
									a: "Yes. Every feature works with no account and no daily limit."
								},
								{
									q: "Which qualities are available?",
									a: "Up to 4K for video (where the source supports it) and up to 320kbps MP3 for audio."
								},
								{
									q: "Do you store the files?",
									a: "No. Downloads stream directly from source to your device. Nothing is kept on our servers."
								},
								{
									q: "Is this legal?",
									a: "Fetchz is a tool. Please only download content you own or have permission to save."
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "group rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-5 [&_summary::-webkit-details-marker]:hidden font-fustat transition hover:bg-black/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex cursor-pointer items-center justify-between gap-4 text-[15.5px] font-medium tracking-tight text-white",
									children: [item.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition group-open:rotate-45",
										children: "+"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[14.5px] leading-relaxed text-white/60",
									children: item.a
								})]
							}, item.q))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "mt-32 w-full border-t border-white/10 pt-8 text-center text-[13px] text-white/50 font-schibsted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Fetchz. Made for people who love a clean download."
						] })
					})
				]
			})
		]
	});
}
//#endregion
export { Index as component };
