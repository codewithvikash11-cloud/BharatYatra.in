'use client';

import { useRef, useEffect } from 'react';

export default function CinematicHero() {
  const videoRef = useRef(null);

  const startPlayback = (el) => {
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry muted autoplay
        el.muted = true;
        el.play().catch(() => {});
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      startPlayback(video);
    }

    // Safety fallback for strict browser policies: kick off play on first user interaction
    const handleFirstTouch = () => {
      if (videoRef.current && videoRef.current.paused) {
        startPlayback(videoRef.current);
      }
    };

    window.addEventListener('scroll', handleFirstTouch, { once: true, passive: true });
    window.addEventListener('click', handleFirstTouch, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstTouch, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  return (
    <section
      className="by-cinematic-hero by-cinematic-hero-pure"
      aria-label="BharatYatra India Video"
    >
      <video
        ref={(el) => {
          videoRef.current = el;
          if (el) startPlayback(el);
        }}
        src="/videos/bharatyatra-india.mp4"
        className="by-hero-video"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        onCanPlay={(e) => startPlayback(e.currentTarget)}
        onLoadedData={(e) => startPlayback(e.currentTarget)}
      >
        <source src="/videos/bharatyatra-india.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

