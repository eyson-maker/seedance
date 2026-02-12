import FaqSection from '@/components/blocks/faqs/faqs';
import SeedancePricingSection from '@/components/blocks/pricing/seedance-pricing-section';
import { getTranslations } from 'next-intl/server';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PricingPage' });

  return constructMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    locale,
    pathname: '/pricing',
  });
}

export default async function PricingPage() {
  return (
    <div className="flex flex-col bg-[#050505] min-h-screen">
      <div className="mt-20">
        <SeedancePricingSection />
      </div>

      <FaqSection />
    </div>
  );
}
