'use client';

import { useState, useRef, useEffect } from 'react';
import { IconVolume, IconVolumeOff } from './icons.js';

export default function CinematicHero({ poster = '/hero.jpg' } = {}) {
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Ensure video begins muted strictly (browser autoplay requirement)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch((err) => {
            console.warn('Hero video autoplay was prevented or failed:', err);
          });
      }
    }
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section
      className="by-cinematic-hero by-cinematic-hero-pure"
      aria-label="Hero: Beauty of India"
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      {/* Background Video Layer */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          className={`by-hero-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster || '/hero.jpg'}
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/bharatyatra-india.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Subtle Natural Ambient Overlay for Seamless Section Transition */}
      <div className="by-hero-video-overlay" aria-hidden="true" />

      {/* Discreet Sound / Mute Toggle in Corner */}
      {!videoFailed && (
        <button
          type="button"
          onClick={toggleSound}
          className="by-hero-sound-toggle"
          aria-label={isMuted ? 'Unmute travel audio' : 'Mute travel audio'}
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <>
              <IconVolumeOff size={16} />
              <span className="by-sound-label">Audio Muted</span>
            </>
          ) : (
            <>
              <IconVolume size={16} />
              <span className="by-sound-label">Audio On</span>
            </>
          )}
        </button>
      )}
    </section>
  );
}
