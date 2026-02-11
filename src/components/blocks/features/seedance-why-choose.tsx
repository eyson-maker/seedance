'use client';

import {
  Cpu,
  Volume2,
  Users,
  BadgeCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Why Choose Seedance 2.0 Section
 *
 * 4-item benefit cards with dark theme.
 * Reinforces "Seedance 2.0" keyword for SEO.
 */
export default function SeedanceWhyChooseSection() {
  const t = useTranslations('HomePage.whyChoose');

  const items = [
    { key: '1', icon: Cpu, title: t('items.item-1.title'), description: t('items.item-1.description') },
    { key: '2', icon: Volume2, title: t('items.item-2.title'), description: t('items.item-2.description') },
    { key: '3', icon: Users, title: t('items.item-3.title'), description: t('items.item-3.description') },
    { key: '4', icon: BadgeCheck, title: t('items.item-4.title'), description: t('items.item-4.description') },
  ];

  return (
    <section id="why-choose" className="px-4 py-20 bg-[#050505]">
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

        {/* 4-item grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div
              key={item.key}
              className="group relative p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative number */}
              <span className="absolute top-4 right-6 text-7xl font-black text-neutral-800/50 select-none">
                {index + 1}
              </span>

              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-emerald-500/10 w-fit mb-5">
                  <item.icon className="size-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
