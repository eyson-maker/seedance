'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Play,
  Download,
  Trash2,
  Clock,
  Sparkles,
  Video,
  Filter,
  LayoutGrid,
  List,
  ArrowRight,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────── */

interface Generation {
  id: string;
  prompt: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  createdAt: string;
  model: string;
  mode: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
  mode: string;
  model: string;
  settings: {
    duration: number;
    quality: string;
    aspectRatio: string;
    generateAudio: boolean;
  };
  thumbnail: string;
  category: string;
}

/* ─── Recommended Templates ───────────────────────────────────── */

const TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    title: 'Cinematic Nature',
    description: 'Stunning aerial shot of mountains with dramatic clouds',
    prompt: 'Sweeping aerial shot over snow-capped mountains, golden hour sunlight, dramatic clouds rolling through valleys, cinematic camera movement, 4K quality',
    mode: 'text-to-video',
    model: 'seedance-2.0',
    settings: { duration: 10, quality: '1080p', aspectRatio: '16:9', generateAudio: true },
    thumbnail: '🏔️',
    category: 'Nature',
  },
  {
    id: 'tpl-2',
    title: 'Product Showcase',
    description: 'Elegant product reveal with studio lighting',
    prompt: 'Luxury product rotating on a reflective surface, soft studio lighting, shallow depth of field, premium feel, minimalist background, smooth 360-degree rotation',
    mode: 'text-to-video',
    model: 'seedance-2.0',
    settings: { duration: 5, quality: '1080p', aspectRatio: '1:1', generateAudio: false },
    thumbnail: '💎',
    category: 'Commercial',
  },
  {
    id: 'tpl-3',
    title: 'Urban Timelapse',
    description: 'City skyline transitioning from day to night',
    prompt: 'City skyline timelapse, day to night transition, lights turning on in buildings, car light trails on highways, clouds moving fast, dramatic sky colors at sunset',
    mode: 'text-to-video',
    model: 'seedance-2.0',
    settings: { duration: 10, quality: '1080p', aspectRatio: '16:9', generateAudio: true },
    thumbnail: '🌆',
    category: 'Urban',
  },
  {
    id: 'tpl-4',
    title: 'Character Animation',
    description: 'Bring a character portrait to life with subtle movement',
    prompt: 'The character slowly turns their head, wind blowing through their hair, subtle smile, eyes looking at camera, cinematic portrait lighting',
    mode: 'image-to-video',
    model: 'seedance-2.0',
    settings: { duration: 5, quality: '720p', aspectRatio: '9:16', generateAudio: false },
    thumbnail: '🎭',
    category: 'Portrait',
  },
  {
    id: 'tpl-5',
    title: 'Food Commercial',
    description: 'Appetizing food shot with steam and close-up details',
    prompt: 'Close-up shot of freshly cooked food, steam rising, warm lighting, ingredients falling in slow motion, appetizing colors, restaurant commercial quality',
    mode: 'text-to-video',
    model: 'seedance-2.0',
    settings: { duration: 5, quality: '1080p', aspectRatio: '1:1', generateAudio: true },
    thumbnail: '🍕',
    category: 'Commercial',
  },
  {
    id: 'tpl-6',
    title: 'Scene Transition',
    description: 'Smooth morphing transition between two scenes',
    prompt: 'Smooth cinematic transition, camera pushing through clouds revealing a new landscape, seamless morphing effect, dramatic orchestral feeling',
    mode: 'first-last-frame',
    model: 'seedance-2.0',
    settings: { duration: 5, quality: '720p', aspectRatio: '16:9', generateAudio: true },
    thumbnail: '🎬',
    category: 'Transition',
  },
];

const CATEGORIES = ['All', ...new Set(TEMPLATES.map((t) => t.category))];

type FilterStatus = 'all' | 'completed' | 'processing' | 'failed';
type ViewMode = 'grid' | 'list';

/* ─── Gallery Client Component ────────────────────────────────── */

export default function GalleryClient() {
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [templateCategory, setTemplateCategory] = useState('All');

  // Load generations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('seedance_generations');
      if (saved) {
        setGenerations(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const filteredGenerations = generations.filter((g) => {
    if (filterStatus === 'all') return true;
    return g.status === filterStatus;
  });

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (templateCategory === 'All') return true;
    return t.category === templateCategory;
  });

  const handleDeleteGeneration = (id: string) => {
    const updated = generations.filter((g) => g.id !== id);
    setGenerations(updated);
    localStorage.setItem('seedance_generations', JSON.stringify(updated));
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to studio with pre-filled settings
    const params = new URLSearchParams({
      mode: template.mode,
      model: template.model,
      prompt: template.prompt,
      duration: template.settings.duration.toString(),
      quality: template.settings.quality,
      aspectRatio: template.settings.aspectRatio,
      audio: template.settings.generateAudio.toString(),
    });
    router.push(`/studio?${params.toString()}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505]">
      <div className="max-w-7xl mx-auto p-6 space-y-10">

        {/* ── My Generations ──────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Video className="size-5 text-blue-400" />
                My Generations
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {generations.length} video{generations.length !== 1 ? 's' : ''} created
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'grid'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'list'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  )}
                >
                  <List className="size-4" />
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
                {(['all', 'completed', 'processing', 'failed'] as FilterStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilterStatus(status)}
                      className={cn(
                        'px-3 py-1.5 text-[11px] font-medium rounded-md transition-all capitalize',
                        filterStatus === status
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-500 hover:text-neutral-300'
                      )}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {filteredGenerations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Play className="size-6 text-neutral-600" />
              </div>
              <h3 className="text-base font-medium text-neutral-400 mb-1">
                {filterStatus === 'all'
                  ? 'No generations yet'
                  : `No ${filterStatus} generations`}
              </h3>
              <p className="text-sm text-neutral-600 max-w-sm mb-4">
                Create your first video in the Studio, or start from a template below.
              </p>
              <Button
                onClick={() => router.push('/studio')}
                className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                <Sparkles className="size-4 mr-2" />
                Go to Studio
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-3'
              )}
            >
              {filteredGenerations.map((gen) =>
                viewMode === 'grid' ? (
                  <GridGenerationCard
                    key={gen.id}
                    generation={gen}
                    onDelete={() => handleDeleteGeneration(gen.id)}
                  />
                ) : (
                  <ListGenerationCard
                    key={gen.id}
                    generation={gen}
                    onDelete={() => handleDeleteGeneration(gen.id)}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* ── Recommended Templates ───────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="size-5 text-purple-400" />
                Recommended Templates
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Quick-start presets to inspire your next creation
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTemplateCategory(cat)}
                className={cn(
                  'px-4 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap',
                  templateCategory === cat
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={() => handleUseTemplate(template)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Sub-Components ──────────────────────────────────────────── */

function GridGenerationCard({
  generation: gen,
  onDelete,
}: {
  generation: Generation;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden group hover:border-neutral-700 transition-all">
      {/* Video area */}
      <div className="aspect-video bg-neutral-950 flex items-center justify-center relative">
        {gen.status === 'processing' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-[10px] text-neutral-500">Processing...</span>
          </div>
        ) : gen.status === 'completed' && gen.videoUrl ? (
          <video
            src={gen.videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 p-3 text-center">
            <span className="text-xs text-red-400 font-medium">Failed</span>
            {gen.error && (
              <span className="text-[10px] text-red-500/60 line-clamp-2">
                {gen.error}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium uppercase">
            {gen.model}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">
            {gen.mode}
          </span>
          <span
            className={cn(
              'text-[9px] px-1.5 py-0.5 rounded font-medium ml-auto',
              gen.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400'
                : gen.status === 'processing'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-red-500/10 text-red-400'
            )}
          >
            {gen.status}
          </span>
        </div>
        <p className="text-xs text-neutral-400 line-clamp-2 mb-2">{gen.prompt}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-600 flex items-center gap-1">
            <Clock className="size-3" />
            {new Date(gen.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {gen.videoUrl && (
              <a
                href={gen.videoUrl}
                download
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
              >
                <Download className="size-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListGenerationCard({
  generation: gen,
  onDelete,
}: {
  generation: Generation;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-neutral-800 bg-neutral-900 group hover:border-neutral-700 transition-all">
      {/* Thumbnail */}
      <div className="w-32 h-20 rounded-lg bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden">
        {gen.status === 'completed' && gen.videoUrl ? (
          <video src={gen.videoUrl} className="w-full h-full object-cover" />
        ) : gen.status === 'processing' ? (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        ) : (
          <span className="text-[10px] text-red-400">Failed</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium uppercase">
            {gen.model}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">
            {gen.mode}
          </span>
          <span
            className={cn(
              'text-[9px] px-1.5 py-0.5 rounded font-medium',
              gen.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400'
                : gen.status === 'processing'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-red-500/10 text-red-400'
            )}
          >
            {gen.status}
          </span>
        </div>
        <p className="text-xs text-neutral-300 line-clamp-1">{gen.prompt}</p>
        <span className="text-[10px] text-neutral-600 flex items-center gap-1 mt-1">
          <Clock className="size-3" />
          {new Date(gen.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {gen.videoUrl && (
          <a
            href={gen.videoUrl}
            download
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all"
          >
            <Download className="size-4" />
          </a>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: Template;
  onUse: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden group hover:border-purple-500/30 transition-all">
      {/* Thumbnail */}
      <div className="h-36 bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center relative">
        <span className="text-5xl">{template.thumbnail}</span>
        <div className="absolute top-2 right-2 flex gap-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-neutral-300 font-medium backdrop-blur-sm">
            {template.mode.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1">{template.title}</h3>
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
          {template.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
            {template.settings.duration}s
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
            {template.settings.quality}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
            {template.settings.aspectRatio}
          </span>
          {template.settings.generateAudio && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
              Audio
            </span>
          )}
        </div>

        <Button
          onClick={onUse}
          variant="outline"
          size="sm"
          className="w-full border-neutral-700 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-300 cursor-pointer transition-all text-xs"
        >
          Use Template
          <ArrowRight className="size-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
