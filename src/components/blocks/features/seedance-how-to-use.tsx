'use client';

import { PenLine, Sparkles, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * How to Use Seedance 2.0 Section
 *
 * 3-step guide with numbered steps, dark theme.
 * Reinforces "Seedance 2.0" keyword for SEO.
 */
export default function SeedanceHowToUseSection() {
  const t = useTranslations('HomePage.howToUse');

  const steps = [
    { key: '1', step: 1, icon: PenLine, title: t('steps.step-1.title'), description: t('steps.step-1.description') },
    { key: '2', step: 2, icon: Sparkles, title: t('steps.step-2.title'), description: t('steps.step-2.description') },
    { key: '3', step: 3, icon: Download, title: t('steps.step-3.title'), description: t('steps.step-3.description') },
  ];

  return (
    <section id="how-to-use" className="px-4 py-20 bg-[#050505]">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-wider text-emerald-400 font-semibold font-mono text-sm mb-4">
            {t('title')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* 3-step layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.key} className="relative text-center group">
              {/* Step number circle */}
              <div className="mx-auto mb-6 relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto group-hover:border-emerald-500/60 transition-colors">
                  <step.icon className="size-7 text-emerald-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-black text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
