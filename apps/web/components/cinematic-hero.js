'use client';

import { useState, useRef, useEffect } from 'react';

export default function CinematicHero({ poster = '/hero.jpg' } = {}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Permanently muted video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch((err) => {
            console.warn('Hero video autoplay fallback:', err);
          });
      }
    }
  }, []);

  return (
    <section
      className="by-cinematic-hero by-cinematic-hero-pure"
      aria-label="BharatYatra Travel Video Hero"
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      {!videoFailed ? (
        <video
          ref={videoRef}
          className={`by-hero-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          poster={poster || '/hero.jpg'}
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/bharatyatra-india.mp4" type="video/mp4" />
        </video>
      ) : null}
    </section>
  );
}
