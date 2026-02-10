'use client';

import { AnimatedGroup } from '@/components/tailark/motion/animated-group';
import { TextEffect } from '@/components/tailark/motion/text-effect';
import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

/**
 * SeedanceAI Hero Section
 *
 * Sora2.com-inspired full-screen hero with:
 * - Pure black background (#050505)
 * - Video background (muted, looping)
 * - Large centered headline "Creating Reality, with Sound."
 * - White capsule CTA "Start Creating"
 */
export default function SeedanceHeroSection() {
  const t = useTranslations('HomePage.hero');

  return (
    <main id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#050505] z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <section className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <AnimatedGroup variants={transitionVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm mb-10">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
            <span className="text-sm text-neutral-300 font-medium">
              {t('introduction')}
            </span>
          </div>
        </AnimatedGroup>

        {/* Headline */}
        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
        >
          {t('title')}
        </TextEffect>

        {/* Description */}
        <TextEffect
          per="line"
          preset="fade-in-blur"
          speedSegment={0.3}
          delay={0.5}
          as="p"
          className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-neutral-400 leading-relaxed"
        >
          {t('description')}
        </TextEffect>

        {/* CTA Buttons */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA - White capsule button */}
          <LocaleLink href="/studio" key="primary-cta">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
            >
              {t('primary')}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </LocaleLink>

          {/* Secondary CTA */}
          <LocaleLink href="/#pricing" key="secondary-cta">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-medium border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
            >
              {t('secondary')}
            </Button>
          </LocaleLink>
        </AnimatedGroup>
      </section>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20" />
    </main>
  );
}
