'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  Upload,
  X,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeOff,
  Play,
} from 'lucide-react';
import { useState, useRef, type ChangeEvent } from 'react';

type GenerationMode = 'text-to-video' | 'image-to-video' | 'first-last-frame';

const MODE_LABELS: Record<GenerationMode, string> = {
  'text-to-video': 'Text to Video',
  'image-to-video': 'Image to Video',
  'first-last-frame': 'First & Last Frame',
};

const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'] as const;
const QUALITY_OPTIONS = ['480p', '720p', '1080p'] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number];
type Quality = (typeof QUALITY_OPTIONS)[number];

/**
 * Seedance 2.0 Studio Preview Section
 *
 * A functional preview of the studio on the homepage.
 * Shows real workspace controls (prompt, mode tabs, aspect ratio, duration,
 * quality, audio toggle) and a CTA to open the full studio.
 */
export default function SeedanceStudioPreview() {
  const [mode, setMode] = useState<GenerationMode>('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState<Quality>('720p');
  const [generateAudio, setGenerateAudio] = useState(true);

  /* Image state for I2V / FLF */
  const [firstImage, setFirstImage] = useState<{ file: File; preview: string } | null>(null);
  const [lastImage, setLastImage] = useState<{ file: File; preview: string } | null>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (target: 'first' | 'last', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    if (target === 'first') setFirstImage({ file, preview });
    else setLastImage({ file, preview });
  };

  const clearImage = (target: 'first' | 'last') => {
    if (target === 'first') {
      if (firstImage?.preview) URL.revokeObjectURL(firstImage.preview);
      setFirstImage(null);
    } else {
      if (lastImage?.preview) URL.revokeObjectURL(lastImage.preview);
      setLastImage(null);
    }
  };

  const switchMode = (m: GenerationMode) => {
    setMode(m);
    if (m === 'text-to-video') { clearImage('first'); clearImage('last'); }
    if (m === 'image-to-video') { clearImage('last'); }
  };

  return (
    <section id="studio-preview" className="px-4 py-20 bg-[#050505]">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-wider text-blue-400 font-semibold font-mono text-sm mb-4">
            Seedance 2.0 Studio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try the Seedance 2.0 AI Video Generator
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Enter a prompt and let Seedance 2.0 create cinematic videos with native audio sync.
          </p>
        </div>

        {/* Studio preview card */}
        <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/50">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Controls */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-neutral-800 space-y-5">
              {/* Mode tabs */}
              <div className="flex rounded-lg bg-neutral-900 p-1">
                {(['text-to-video', 'image-to-video', 'first-last-frame'] as GenerationMode[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer',
                        mode === m
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-500 hover:text-neutral-300'
                      )}
                    >
                      {MODE_LABELS[m]}
                    </button>
                  )
                )}
              </div>

              {/* Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A dancer performing in a rain storm, dramatic cinematic lighting..."
                  maxLength={2000}
                  className="min-h-[100px] bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-600 resize-none rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                />
                <span className="text-[10px] text-neutral-600 text-right block">
                  {prompt.length}/2000
                </span>
              </div>

              {/* Image uploads for I2V / FLF */}
              {mode !== 'text-to-video' && (
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    {mode === 'image-to-video' ? 'Reference Image' : 'First & Last Frame'}
                  </label>
                  <div className="flex gap-3">
                    <ImageSlot
                      label={mode === 'first-last-frame' ? 'First Frame' : 'Image'}
                      image={firstImage}
                      inputRef={firstRef}
                      onUpload={(e) => handleImageUpload('first', e)}
                      onClear={() => clearImage('first')}
                    />
                    {mode === 'first-last-frame' && (
                      <ImageSlot
                        label="Last Frame"
                        image={lastImage}
                        inputRef={lastRef}
                        onUpload={(e) => handleImageUpload('last', e)}
                        onClear={() => clearImage('last')}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      className={cn(
                        'py-1.5 text-xs rounded-lg border transition-all cursor-pointer',
                        aspectRatio === ar
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
                      )}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration + Quality row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    Duration — {duration}s
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    step={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-600">
                    <span>4s</span>
                    <span>12s</span>
                  </div>
                </div>

                {/* Quality */}
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    Quality
                  </label>
                  <div className="flex gap-1.5">
                    {QUALITY_OPTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuality(q)}
                        className={cn(
                          'flex-1 py-1.5 text-xs rounded-lg border transition-all cursor-pointer',
                          quality === q
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500'
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audio toggle */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2">
                  {generateAudio ? (
                    <Volume2 className="size-4 text-blue-400" />
                  ) : (
                    <VolumeOff className="size-4 text-neutral-500" />
                  )}
                  <span className="text-sm text-neutral-300">Generate Audio</span>
                </div>
                <Switch checked={generateAudio} onCheckedChange={setGenerateAudio} />
              </div>

              {/* CTA */}
              <LocaleLink href="/studio?model=seedance-2.0">
                <Button className="w-full py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-400 text-white cursor-pointer transition-all">
                  <Sparkles className="size-4 mr-2" />
                  Open Seedance 2.0 Studio
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </LocaleLink>
            </div>

            {/* Right: Preview */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Play className="size-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-400 mb-1">
                Video Preview
              </h3>
              <p className="text-sm text-neutral-600 max-w-xs text-center">
                Open the full studio to generate your first cinematic video with Seedance 2.0
              </p>

              {/* Parameter summary */}
              <div className="mt-8 w-full max-w-xs space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Mode</span>
                  <span className="text-neutral-400">{MODE_LABELS[mode]}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Aspect Ratio</span>
                  <span className="text-neutral-400">{aspectRatio}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Duration</span>
                  <span className="text-neutral-400">{duration}s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Quality</span>
                  <span className="text-neutral-400">{quality}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Audio</span>
                  <span className="text-neutral-400">{generateAudio ? 'On' : 'Off'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Image upload slot ──────────────────────────────────────────── */

function ImageSlot({
  label,
  image,
  inputRef,
  onUpload,
  onClear,
}: {
  label: string;
  image: { file: File; preview: string } | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  if (image) {
    return (
      <div className="relative group flex-1">
        <div className="aspect-video rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
          {/* biome-ignore lint: preview image */}
          <img src={image.preview} alt={label} className="w-full h-full object-cover" />
        </div>
        <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/60 px-1.5 py-0.5 rounded">
          {label}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="aspect-video w-full rounded-lg border border-dashed border-neutral-700 bg-neutral-900 flex flex-col items-center justify-center gap-1 hover:border-neutral-500 transition-colors cursor-pointer"
      >
        <Upload className="size-4 text-neutral-600" />
        <span className="text-[10px] text-neutral-600">{label}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}
