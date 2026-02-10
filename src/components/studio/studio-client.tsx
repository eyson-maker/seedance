'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreditCheck } from '@/hooks/use-credit-check';
import { PricingModal } from '@/components/pricing/pricing-modal';
import {
  Upload,
  X,
  Play,
  Loader2,
  Image as ImageIcon,
  Video,
  Music,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

/**
 * Reference file types for Seedance 2.0 multi-modal input
 */
type RefType = 'face' | 'motion' | 'structure' | 'style' | 'audio';

const REF_TYPE_LABELS: Record<RefType, string> = {
  face: 'Face Ref',
  motion: 'Motion Ref',
  structure: 'Structure Ref',
  style: 'Style Ref',
  audio: 'Audio Ref',
};

interface UploadSlot {
  id: number;
  file: File | null;
  preview: string | null;
  type: RefType;
  fileType: 'image' | 'video' | 'audio' | null;
}

/**
 * Studio Client Component
 *
 * Left-right split layout:
 * - Left: Prompt input + 12-file reference grid
 * - Right: Generation results and history
 */
export default function StudioClient() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slots, setSlots] = useState<UploadSlot[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      file: null,
      preview: null,
      type: 'face' as RefType,
      fileType: null,
    }))
  );
  const [generations, setGenerations] = useState<
    Array<{
      id: string;
      prompt: string;
      status: 'processing' | 'completed' | 'failed';
      videoUrl?: string;
      createdAt: string;
    }>
  >([]);

  const { checkCredits, showPricingModal, setShowPricingModal, credits } =
    useCreditCheck();

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
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, file: null, preview: null, fileType: null }
          : slot
      )
    );
  };

  const setSlotType = (slotId: number, type: RefType) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, type } : slot))
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Credit check - opens pricing modal if insufficient
    if (!checkCredits(10)) return;

    setIsGenerating(true);

    // Create a placeholder generation
    const newGen = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      status: 'processing' as const,
      createdAt: new Date().toISOString(),
    };
    setGenerations((prev) => [newGen, ...prev]);

    try {
      // TODO: Integrate with actual Seedance 2.0 API
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({ prompt, refs: slots.filter(s => s.file) }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setGenerations((prev) =>
        prev.map((g) =>
          g.id === newGen.id ? { ...g, status: 'completed' as const } : g
        )
      );
    } catch {
      setGenerations((prev) =>
        prev.map((g) =>
          g.id === newGen.id ? { ...g, status: 'failed' as const } : g
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const usedSlots = slots.filter((s) => s.file).length;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-var(--header-height))] overflow-hidden">
        {/* LEFT SIDEBAR - Parameter Area */}
        <div className="w-full lg:w-[420px] lg:min-w-[420px] border-r border-neutral-800 flex flex-col overflow-y-auto bg-[#0a0a0a]">
          {/* Credits Badge */}
          <div className="px-5 py-3 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                Credits
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-800 text-sm font-semibold text-white">
                {credits.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex-1 p-5 space-y-6 overflow-y-auto">
            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video scene... e.g., 'A dancer performing in a rain storm, dramatic lighting, cinematic slow motion'"
                className="min-h-[140px] bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-600 resize-none rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            {/* Reference Assets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  Reference Assets
                </label>
                <span className="text-xs text-neutral-600">
                  {usedSlots}/12 used
                </span>
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
                Upload up to 12 reference files (images, videos, or audio) for
                precise control over characters, motion, and style.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="p-5 border-t border-neutral-800">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-400 text-white disabled:opacity-40 cursor-pointer transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Generate Video (10 credits)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL - Results Area */}
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
                Enter a prompt on the left and click Generate to create your
                first cinematic video.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                Generations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generations.map((gen) => (
                  <div
                    key={gen.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden"
                  >
                    {/* Video area */}
                    <div className="aspect-video bg-neutral-950 flex items-center justify-center">
                      {gen.status === 'processing' ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="size-8 text-blue-500 animate-spin" />
                          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                          <span className="text-xs text-neutral-500">
                            Processing...
                          </span>
                        </div>
                      ) : gen.status === 'completed' ? (
                        <div className="flex flex-col items-center gap-2 text-emerald-400">
                          <Play className="size-10 fill-current" />
                          <span className="text-xs">Video ready</span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-400">
                          Generation failed
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {gen.prompt}
                      </p>
                      <p className="text-[10px] text-neutral-600 mt-1">
                        {new Date(gen.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal for credit gate */}
      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
      />
    </>
  );
}

/**
 * Upload Slot Card
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
  const [showTypeMenu, setShowTypeMenu] = useState(false);

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

        {/* Type label */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
          <span className="text-[8px] text-neutral-300 font-medium truncate block">
            {REF_TYPE_LABELS[slot.type]}
          </span>
        </div>

        {/* Clear button */}
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
