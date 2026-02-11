'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const HERO_VIDEOS = ['/hero-bg1.mp4', '/hero-bg2.mp4', '/hero-bg3.mp4'];

/**
 * Isolated video background with dual-buffer crossfade.
 *
 * All state lives here — the parent SeedanceHeroSection never re-renders
 * when videos switch, so AnimatedGroup buttons stay stable.
 */
export const HeroVideoBackground = memo(function HeroVideoBackground() {
  const [isMuted, setIsMuted] = useState(true);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const currentIndexRef = useRef(0);
  const activeRef = useRef<'A' | 'B'>('A');

  // We use a ref + direct DOM manipulation for opacity to avoid ANY re-render
  const fadeA = useRef<HTMLDivElement>(null);
  const fadeB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    // Init: A plays first video, B preloads second
    vA.src = HERO_VIDEOS[0];
    vA.load();
    vA.play().catch(() => {});

    if (HERO_VIDEOS.length > 1) {
      vB.src = HERO_VIDEOS[1];
      vB.load();
    }

    // Set initial opacity via DOM
    if (fadeA.current) fadeA.current.style.opacity = '1';
    if (fadeB.current) fadeB.current.style.opacity = '0';
  }, []);

  const handleEnded = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % HERO_VIDEOS.length;
    currentIndexRef.current = nextIdx;

    const wasA = activeRef.current === 'A';
    const standby = wasA ? videoBRef.current : videoARef.current;
    const standbyFade = wasA ? fadeB.current : fadeA.current;
    const activeFade = wasA ? fadeA.current : fadeB.current;

    // Play standby, crossfade via direct DOM
    if (standby) standby.play().catch(() => {});
    if (standbyFade) standbyFade.style.opacity = '1';
    if (activeFade) activeFade.style.opacity = '0';

    activeRef.current = wasA ? 'B' : 'A';

    // Preload next into the now-standby
    const preloadIdx = (nextIdx + 1) % HERO_VIDEOS.length;
    const nowStandby = wasA ? videoARef.current : videoBRef.current;
    setTimeout(() => {
      if (nowStandby) {
        nowStandby.src = HERO_VIDEOS[preloadIdx];
        nowStandby.load();
      }
    }, 600);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoARef.current) videoARef.current.muted = next;
      if (videoBRef.current) videoBRef.current.muted = next;
      return next;
    });
  }, []);

  return (
    <>
      {/* Video layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#050505] z-10" />

        {/* Buffer A */}
        <div
          ref={fadeA}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: 1 }}
        >
          <video
            ref={videoARef}
            muted
            playsInline
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Buffer B */}
        <div
          ref={fadeB}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: 0 }}
        >
          <video
            ref={videoBRef}
            muted
            playsInline
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-neutral-700 text-white hover:bg-black/60 transition-all cursor-pointer"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
      </button>
    </>
  );
});
