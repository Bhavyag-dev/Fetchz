import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  videoUrl: string;
}

export function VideoBackground({ videoUrl }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const opacityRef = useRef<number>(0);

  const animateOpacity = (target: number, duration: number, callback?: () => void) => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startOpacity = opacityRef.current;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = startOpacity + (target - startOpacity) * progress;
      opacityRef.current = current;
      
      if (videoRef.current) {
        videoRef.current.style.opacity = current.toString();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        if (callback) callback();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
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
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    const currentTime = video.currentTime;

    if (duration && !fadingOutRef.current) {
      const timeRemaining = duration - currentTime;
      // Start fade out 250ms before video end when 0.55s remain
      if (timeRemaining <= 0.55) {
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
        video.play()
          .then(() => {
            animateOpacity(1, 250);
          })
          .catch((err) => {
            console.error("Video play on loop failed:", err);
          });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="w-[115%] h-[115%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center pointer-events-none"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
