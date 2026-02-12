'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreditCheck } from '@/hooks/use-credit-check';
import { PricingModal } from '@/components/pricing/pricing-modal';
import { calculateGenerationCost } from '@/lib/price-calculator';
import {
  Upload,
  X,
  Play,
  Loader2,
  Video,
  Music,
  Sparkles,
  Volume2,
  VolumeOff,
  Type,
  ImageIcon,
  FrameIcon,
  Download,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────── */

/** Available models */
const MODELS = [
  { id: 'seedance-2.0', label: 'Seedance 2.0' },
  { id: 'seedance-1.5', label: 'Seedance 1.5' },
] as const;

type ModelId = (typeof MODELS)[number]['id'];

/** Creation modes — add new modes here for extensibility */
const CREATION_MODES = [
  { id: 'text-to-video', label: 'Text to Video', icon: Type, description: 'Generate video from a text prompt' },
  { id: 'image-to-video', label: 'Image to Video', icon: ImageIcon, description: 'Animate a still image into video' },
  { id: 'first-last-frame', label: 'First & Last Frame', icon: FrameIcon, description: 'Define start and end keyframes' },
] as const;

type CreationMode = (typeof CREATION_MODES)[number]['id'];

/** Reference file types for Seedance 2.0 multi-modal input */
type RefType = 'face' | 'motion' | 'structure' | 'style' | 'audio';

const REF_TYPE_LABELS: Record<RefType, string> = {
  face: 'Face Ref',
  motion: 'Motion Ref',
  structure: 'Structure Ref',
  style: 'Style Ref',
  audio: 'Audio Ref',
};

const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'] as const;
const QUALITY_OPTIONS = ['480p', '720p', '1080p'] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number];
type Quality = (typeof QUALITY_OPTIONS)[number];

interface UploadSlot {
  id: number;
  file: File | null;
  preview: string | null;
  type: RefType;
  fileType: 'image' | 'video' | 'audio' | null;
}

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

/* ─── Main Component ──────────────────────────────────────────── */

/**
 * Studio Client Component — Multi-model, multi-mode video creation
 *
 * Layout:
 * - Left: Model tabs → Mode tabs → Mode-specific input → Shared settings → Generate button
 * - Right: Generation results
 */
export default function StudioClient() {
  const searchParams = useSearchParams();

  /* ── State ── */
  const [model, setModel] = useState<ModelId>(
    (searchParams.get('model') as ModelId) || 'seedance-2.0'
  );
  const [mode, setMode] = useState<CreationMode>(
    (searchParams.get('mode') as CreationMode) || 'text-to-video'
  );

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Shared settings
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState<Quality>('720p');
  const [generateAudio, setGenerateAudio] = useState(false);

  // Image-to-video: single image
  const [i2vImage, setI2vImage] = useState<{ file: File; preview: string } | null>(null);

  // First-last-frame: two images
  const [firstFrame, setFirstFrame] = useState<{ file: File; preview: string } | null>(null);
  const [lastFrame, setLastFrame] = useState<{ file: File; preview: string } | null>(null);

  // Text-to-video: reference slots
  const [slots, setSlots] = useState<UploadSlot[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      file: null,
      preview: null,
      type: 'face' as RefType,
      fileType: null,
    }))
  );

  const [generations, setGenerations] = useState<Generation[]>([]);

  const { checkCredits, showPricingModal, setShowPricingModal, credits } =
    useCreditCheck();

  /* ── Calculated Cost ── */
  const currentCost = calculateGenerationCost({
    duration,
    quality,
    generateAudio,
  });

  /* ── Load generations from localStorage on mount ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('seedance_generations');
      if (saved) {
        const parsed = JSON.parse(saved) as Generation[];
        setGenerations(parsed.filter((g) => g.status !== 'processing'));
      }
    } catch {}
  }, []);

  /* ── Persist generations to localStorage ── */
  useEffect(() => {
    try {
      localStorage.setItem('seedance_generations', JSON.stringify(generations));
    } catch {}
  }, [generations]);

  /* ── Handlers ── */

  const handleSingleImageUpload = (
    setter: (val: { file: File; preview: string } | null) => void,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setter({ file, preview: URL.createObjectURL(file) });
  };

  const handleFileUpload = (slotId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
          ? 'audio'
          : null;
    if (!fileType) return;

    const preview = URL.createObjectURL(file);
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              file,
              preview,
              fileType,
              type:
                fileType === 'audio'
                  ? 'audio'
                  : fileType === 'video'
                    ? 'motion'
                    : slot.type,
            }
          : slot
      )
    );
  };

  const clearSlot = (slotId: number) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot?.preview) URL.revokeObjectURL(slot.preview);
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, file: null, preview: null, fileType: null } : s
      )
    );
  };

  const setSlotType = (slotId: number, type: RefType) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, type } : slot))
    );
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.url;
  };

  const pollTaskStatus = async (taskId: string, genId: string) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      try {
        const res = await fetch(`/api/generate/status?taskId=${taskId}`);
        if (!res.ok) continue;
        const data = await res.json();

        setGenerations((prev) =>
          prev.map((g) =>
            g.id === genId
              ? {
                  ...g,
                  status:
                    data.status === 'completed' || data.status === 'succeeded'
                      ? 'completed'
                      : data.status === 'failed'
                        ? 'failed'
                        : 'processing',
                  videoUrl: data.videoUrl || g.videoUrl,
                  error:
                    data.status === 'failed'
                      ? data.error || data.fail_reason || 'Generation failed'
                      : g.error,
                }
              : g
          )
        );

        if (
          data.status === 'completed' ||
          data.status === 'succeeded' ||
          data.status === 'failed'
        )
          return;
      } catch (err) {
        console.error('[PollTask]', err);
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!checkCredits(currentCost)) return;

    setIsGenerating(true);
    const tempId = Date.now().toString();

    setGenerations((prev) => [
      {
        id: tempId,
        prompt: prompt.trim(),
        status: 'processing',
        createdAt: new Date().toISOString(),
        model,
        mode,
      },
      ...prev,
    ]);

    try {
      // Build image_urls based on mode
      const imageUrls: string[] = [];

      if (mode === 'image-to-video' && i2vImage) {
        const url = await uploadImage(i2vImage.file);
        imageUrls.push(url);
      } else if (mode === 'first-last-frame') {
        if (firstFrame) {
          const url = await uploadImage(firstFrame.file);
          imageUrls.push(url);
        }
        if (lastFrame) {
          const url = await uploadImage(lastFrame.file);
          imageUrls.push(url);
        }
      } else if (mode === 'text-to-video') {
        const activeSlots = slots.filter((s) => s.file);
        if (activeSlots.length > 0) {
          const uploadPromises = activeSlots.map((s) => uploadImage(s.file as File));
          const urls = await Promise.all(uploadPromises);
          imageUrls.push(...urls);
        }
      }

      // Build prompt with mode hints for first/last frame
      let apiPrompt = prompt.trim();
      if (mode === 'first-last-frame' && imageUrls.length > 0) {
        if (imageUrls.length === 2) {
          apiPrompt = `Start from the first image as the first frame and end with the second image as the last frame. ${apiPrompt}`;
        } else {
          apiPrompt = `Start from the image as the first frame. ${apiPrompt}`;
        }
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: apiPrompt,
          image_urls: imageUrls,
          duration,
          quality,
          aspect_ratio: aspectRatio,
          generate_audio: generateAudio,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed');
      }

      const data = await res.json();

      setGenerations((prev) =>
        prev.map((g) =>
          g.id === tempId ? { ...g, id: data.id || tempId } : g
        )
      );

      pollTaskStatus(data.id, data.id || tempId);
    } catch (error: any) {
      console.error('[Generate Error]', error);
      setGenerations((prev) =>
        prev.map((g) =>
          g.id === tempId
            ? { ...g, status: 'failed', error: error.message || 'Unknown error' }
            : g
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const usedSlots = slots.filter((s) => s.file).length;

  /* ── Render helpers ── */

  const canGenerate = (() => {
    if (!prompt.trim() || isGenerating) return false;
    if (mode === 'image-to-video' && !i2vImage) return false;
    if (mode === 'first-last-frame' && !firstFrame) return false;
    return true;
  })();

  return (
    <>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-var(--header-height))] overflow-hidden">
        {/* LEFT SIDEBAR — Parameter Area */}
        <div className="w-full lg:w-[420px] lg:min-w-[420px] border-r border-neutral-800 flex flex-col overflow-y-auto bg-[#0a0a0a]">

          {/* Model Tabs */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={cn(
                    'flex-1 py-2 text-xs font-semibold rounded-md transition-all text-center',
                    model === m.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="px-4 pb-3">
            <div className="flex gap-1 overflow-x-auto">
              {CREATION_MODES.map((cm) => {
                const Icon = cm.icon;
                return (
                  <button
                    key={cm.id}
                    type="button"
                    onClick={() => setMode(cm.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium rounded-lg transition-all whitespace-nowrap border',
                      mode === cm.id
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                    )}
                  >
                    <Icon className="size-3.5" />
                    {cm.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credits Badge */}
          <div className="px-5 py-2.5 border-y border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                Credits
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    credits < currentCost ? 'text-red-500' : 'text-emerald-400'
                  )}
                >
                  Cost: {currentCost}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-800 text-sm font-semibold text-white">
                  {credits.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {/* Mode-Specific Input */}
            {mode === 'image-to-video' && (
              <ImageUploadPanel
                label="Source Image"
                description="Upload an image to animate into video"
                image={i2vImage}
                onUpload={(e) => handleSingleImageUpload(setI2vImage, e)}
                onClear={() => {
                  if (i2vImage?.preview) URL.revokeObjectURL(i2vImage.preview);
                  setI2vImage(null);
                }}
              />
            )}

            {mode === 'first-last-frame' && (
              <div className="space-y-3">
                <ImageUploadPanel
                  label="First Frame"
                  description="Define the starting keyframe"
                  image={firstFrame}
                  onUpload={(e) => handleSingleImageUpload(setFirstFrame, e)}
                  onClear={() => {
                    if (firstFrame?.preview) URL.revokeObjectURL(firstFrame.preview);
                    setFirstFrame(null);
                  }}
                  required
                />
                <ImageUploadPanel
                  label="Last Frame"
                  description="Define the ending keyframe (optional)"
                  image={lastFrame}
                  onUpload={(e) => handleSingleImageUpload(setLastFrame, e)}
                  onClear={() => {
                    if (lastFrame?.preview) URL.revokeObjectURL(lastFrame.preview);
                    setLastFrame(null);
                  }}
                />
              </div>
            )}

            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'image-to-video'
                    ? "Describe how you want the image to come alive... e.g., 'The character slowly turns their head, wind blowing through their hair'"
                    : mode === 'first-last-frame'
                      ? "Describe the transition between frames... e.g., 'Smooth camera pan from day to night, clouds moving across the sky'"
                      : "Describe your video scene... e.g., 'A dancer performing in a rain storm, dramatic lighting, cinematic slow motion'"
                }
                className="min-h-[120px] bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-600 resize-none rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            {/* Generation Settings */}
            <div className="space-y-4 pt-2 border-t border-neutral-800">
              <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium block mb-3">
                Settings
              </label>

              {/* Duration Slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Duration</span>
                  <span className="text-white font-medium">{duration}s</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={10}
                  step={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-600">
                  <span>5s</span>
                  <span>10s (+5c)</span>
                </div>
              </div>

              {/* Quality & Audio Row */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <span className="text-xs text-neutral-400 block">Quality</span>
                  <div className="flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
                    {QUALITY_OPTIONS.filter((q) => q !== '480p').map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setQuality(q)}
                        className={cn(
                          'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
                          quality === q
                            ? 'bg-neutral-700 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-300'
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-xs text-neutral-400 block">Audio</span>
                  <div
                    onClick={() => setGenerateAudio(!generateAudio)}
                    onKeyDown={() => {}}
                    className={cn(
                      'flex items-center justify-between p-1.5 px-3 rounded-lg border cursor-pointer transition-all',
                      generateAudio
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {generateAudio ? (
                        <Volume2 className="size-3.5 text-blue-400" />
                      ) : (
                        <VolumeOff className="size-3.5 text-neutral-500" />
                      )}
                      <span
                        className={cn(
                          'text-xs font-medium',
                          generateAudio ? 'text-blue-200' : 'text-neutral-500'
                        )}
                      >
                        {generateAudio ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <span className="text-xs text-neutral-400 block">Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {ASPECT_RATIOS.slice(0, 3).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      className={cn(
                        'py-1.5 text-xs border rounded-md transition-all',
                        aspectRatio === ar
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-600'
                      )}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reference Assets Grid — only for text-to-video mode */}
            {mode === 'text-to-video' && (
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    Reference Assets
                  </label>
                  <span className="text-xs text-neutral-600">{usedSlots}/12 used</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      onUpload={(e) => handleFileUpload(slot.id, e)}
                      onClear={() => clearSlot(slot.id)}
                      onTypeChange={(type) => setSlotType(slot.id, type)}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Upload up to 12 reference files for precise control over characters,
                  motion, and style.
                </p>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="p-5 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500">Estimated Cost</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  credits < currentCost ? 'text-red-500' : 'text-neutral-400'
                )}
              >
                {currentCost} Credits
              </span>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-6 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 cursor-pointer transition-all shadow-lg shadow-blue-900/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <Sparkles className="size-5 mr-2" />
                    <span>Generate Video</span>
                  </div>
                  <span className="text-[10px] opacity-70 font-normal mt-0.5">
                    -{currentCost} Credits
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL — Results Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#050505]">
          {generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <Play className="size-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-400 mb-1">
                No generations yet
              </h3>
              <p className="text-sm text-neutral-600 max-w-sm">
                Enter a prompt on the left and click Generate to create your first
                cinematic video.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                Generations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generations.map((gen) => (
                  <GenerationCard key={gen.id} generation={gen} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
      />
    </>
  );
}

/* ─── Sub-Components ──────────────────────────────────────────── */

/**
 * Image upload panel for Image-to-Video and First/Last Frame modes
 */
function ImageUploadPanel({
  label,
  description,
  image,
  onUpload,
  onClear,
  required,
}: {
  label: string;
  description: string;
  image: { file: File; preview: string } | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      </div>

      {image ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800">
          {/* biome-ignore lint: preview image */}
          <img
            src={image.preview}
            alt={label}
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <span className="text-[10px] text-neutral-300 truncate block">
              {image.file.name}
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 rounded-xl border border-dashed border-neutral-700 bg-neutral-900 flex flex-col items-center justify-center hover:border-neutral-500 transition-colors cursor-pointer group"
        >
          <Upload className="size-5 text-neutral-600 group-hover:text-neutral-400 transition-colors mb-2" />
          <span className="text-xs text-neutral-500 group-hover:text-neutral-400">
            {description}
          </span>
          <span className="text-[10px] text-neutral-600 mt-1">
            JPG, PNG, WebP • Max 10MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}

/**
 * Generation result card
 */
function GenerationCard({ generation: gen }: { generation: Generation }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Video area */}
      <div className="aspect-video bg-neutral-950 flex items-center justify-center relative">
        {gen.status === 'processing' ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 text-blue-500 animate-spin" />
            <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full animate-pulse"
                style={{ width: '60%' }}
              />
            </div>
            <span className="text-xs text-neutral-500">Processing...</span>
          </div>
        ) : gen.status === 'completed' && gen.videoUrl ? (
          <div className="w-full h-full relative group">
            <video
              src={gen.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
            <a
              href={gen.videoUrl}
              download
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="size-4" />
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full gap-2 p-4 text-center">
            {gen.status === 'completed' ? (
              <span className="text-xs text-yellow-400">
                Video processing complete (loading...)
              </span>
            ) : (
              <>
                <span className="text-xs text-red-400 font-medium">
                  Generation failed
                </span>
                {gen.error && (
                  <span className="text-[10px] text-red-500/70 max-w-full break-words leading-tight">
                    {gen.error}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium uppercase">
            {gen.model}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">
            {gen.mode}
          </span>
        </div>
        <p className="text-xs text-neutral-400 line-clamp-2">{gen.prompt}</p>
        <p className="text-[10px] text-neutral-600 mt-1">
          {new Date(gen.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

/**
 * Upload Slot Card (for reference assets in text-to-video mode)
 */
function SlotCard({
  slot,
  onUpload,
  onClear,
  onTypeChange,
}: {
  slot: UploadSlot;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onTypeChange: (type: RefType) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (slot.file && slot.preview) {
    return (
      <div className="relative group aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
        {slot.fileType === 'image' && (
          // biome-ignore lint: demo code
          <img
            src={slot.preview}
            alt="Reference"
            className="w-full h-full object-cover"
          />
        )}
        {slot.fileType === 'video' && (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <Video className="size-5 text-neutral-400" />
          </div>
        )}
        {slot.fileType === 'audio' && (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <Music className="size-5 text-neutral-400" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
          <span className="text-[8px] text-neutral-300 font-medium truncate block">
            {REF_TYPE_LABELS[slot.type]}
          </span>
        </div>

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
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="aspect-square w-full rounded-lg border border-dashed border-neutral-700 bg-neutral-900 flex flex-col items-center justify-center hover:border-neutral-500 transition-colors cursor-pointer group"
      >
        <Upload className="size-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}
