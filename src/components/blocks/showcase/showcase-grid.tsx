'use client';

import { cn } from '@/lib/utils';
import { Play, Volume2 } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

/**
 * Showcase item type for the masonry grid
 */
interface ShowcaseItem {
  id: string;
  thumbnailUrl: string;
  videoUrl?: string;
  prompt: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

/**
 * Demo showcase items (placeholder data)
 * Replace with real Seedance 2.0 generated samples
 */
const DEMO_ITEMS: ShowcaseItem[] = [
  {
    id: '1',
    thumbnailUrl: '/showcase/demo-1.jpg',
    prompt: 'A woman walking through a neon-lit Tokyo alley at night, rain reflecting city lights, cinematic mood',
    aspectRatio: 'portrait',
  },
  {
    id: '2',
    thumbnailUrl: '/showcase/demo-2.jpg',
    prompt: 'Aerial shot of a sailboat cutting through turquoise ocean waves, golden hour lighting',
    aspectRatio: 'landscape',
  },
  {
    id: '3',
    thumbnailUrl: '/showcase/demo-3.jpg',
    prompt: 'A jazz musician playing saxophone in a smoky underground club, warm amber tones',
    aspectRatio: 'square',
  },
  {
    id: '4',
    thumbnailUrl: '/showcase/demo-4.jpg',
    prompt: 'Time-lapse of cherry blossoms blooming in a serene Japanese garden, soft piano music',
    aspectRatio: 'portrait',
  },
  {
    id: '5',
    thumbnailUrl: '/showcase/demo-5.jpg',
    prompt: 'A dancer performing contemporary ballet in an abandoned warehouse, dramatic side lighting',
    aspectRatio: 'landscape',
  },
  {
    id: '6',
    thumbnailUrl: '/showcase/demo-6.jpg',
    prompt: 'Macro shot of morning dew drops on spider web, nature sounds, shallow depth of field',
    aspectRatio: 'square',
  },
];

/**
 * ShowcaseGrid - Masonry Layout
 *
 * Sora2.com-inspired video showcase grid with:
 * - Masonry layout using CSS columns
 * - Hover to reveal prompt overlay
 * - Play icon indicator
 */
export default function ShowcaseGrid() {
  return (
    <section className="px-4 py-20 bg-[#050505]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            AI Videos Made with SeedanceAI
          </h2>
          <p className="text-neutral-500 text-base">
            Explore cinematic videos created with Seedance 2.0 — the latest AI video generation model with native audio sync
          </p>
        </div>

        {/* Masonry Grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {DEMO_ITEMS.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const [isHovered, setIsHovered] = useState(false);

  const aspectClass =
    item.aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : item.aspectRatio === 'landscape'
        ? 'aspect-video'
        : 'aspect-square';

  return (
    <div
      className="relative break-inside-avoid group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl',
          aspectClass,
          'bg-neutral-900'
        )}
      >
        {/* Thumbnail / Gradient placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900">
          {/* When actual images are available, replace with Next.js Image */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(${135 + parseInt(item.id) * 30}deg, 
                hsl(${200 + parseInt(item.id) * 40}, 30%, 15%) 0%, 
                hsl(${240 + parseInt(item.id) * 30}, 25%, 10%) 100%)`,
            }}
          />
        </div>

        {/* Play Icon */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm">
            <Play className="size-3 text-white fill-white" />
            <span className="text-[10px] text-white font-medium">0:05</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className={cn(
            'absolute inset-0 z-10 flex flex-col justify-end transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Prompt text */}
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="size-3.5 text-neutral-400" />
              <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                With Sound
              </span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed line-clamp-3">
              {item.prompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
