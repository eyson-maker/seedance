'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LocaleLink } from '@/i18n/navigation';
import {
  Upload,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Seedance 2.0 Studio Preview Section
 *
 * A simplified, non-functional preview of the studio tool on the homepage.
 * Shows the prompt input, reference grid, and generation area to give visitors
 * a taste of the Seedance 2.0 video generation experience.
 */
export default function SeedanceStudioPreview() {
  const [prompt, setPrompt] = useState('');

  return (
    <section id="studio-preview" className="px-4 py-20 bg-[#050505]">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-wider text-emerald-400 font-semibold font-mono text-sm mb-4">
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
            {/* Left: Input area */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-neutral-800">
              {/* Model selector mock */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Sparkles className="size-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Seedance 2.0</span>
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-2 mb-6">
                <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                  Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your video scene... e.g., 'A dancer performing in a rain storm, dramatic cinematic lighting'"
                  className="min-h-[120px] bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-600 resize-none rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              {/* Reference grid mock */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    Reference Files
                  </label>
                  <span className="text-xs text-neutral-600">0/12</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`ref-${i}`}
                      className="aspect-square rounded-lg border border-dashed border-neutral-700 bg-neutral-900 flex items-center justify-center"
                    >
                      <Upload className="size-3 text-neutral-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <LocaleLink href="/studio">
                <Button
                  className="w-full py-3 rounded-xl font-medium bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer transition-all"
                >
                  <Sparkles className="size-4 mr-2" />
                  Open Seedance 2.0 Studio
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </LocaleLink>
            </div>

            {/* Right: Result preview */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Seedance 2.0 AI Video Generator Result
                </h3>
                <p className="text-sm text-neutral-500 mb-8">
                  Your Seedance AI generated video will appear here
                </p>

                {/* Placeholder video area */}
                <div className="aspect-[9/16] max-h-[300px] w-auto mx-auto rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="size-7 text-neutral-600" />
                    </div>
                    <p className="text-xs text-neutral-600">
                      Powered by Seedance 2.0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
