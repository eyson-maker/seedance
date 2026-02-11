'use client';

import {
  Type,
  ImageIcon,
  Volume2,
  Upload,
  MonitorPlay,
  BadgeCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Seedance 2.0 Features Section
 *
 * 6-item grid with dark theme, matching the sora2.com aesthetic.
 * Each card reinforces the "Seedance 2.0" keyword for SEO density.
 */
export default function SeedanceFeaturesSection() {
  const t = useTranslations('HomePage.features');

  return (
    <section id="features" className="px-4 py-20 bg-[#050505]">
      <div className="mx-auto max-w-6xl">
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

        {/* 6-item grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={Type} title={t('items.item-1.title')} description={t('items.item-1.description')} />
          <FeatureCard icon={ImageIcon} title={t('items.item-2.title')} description={t('items.item-2.description')} />
          <FeatureCard icon={Volume2} title={t('items.item-3.title')} description={t('items.item-3.description')} />
          <FeatureCard icon={Upload} title={t('items.item-4.title')} description={t('items.item-4.description')} />
          <FeatureCard icon={MonitorPlay} title={t('items.item-5.title')} description={t('items.item-5.description')} />
          <FeatureCard icon={BadgeCheck} title={t('items.item-6.title')} description={t('items.item-6.description')} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-neutral-800 group-hover:bg-emerald-500/10 transition-colors">
          <Icon className="size-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
