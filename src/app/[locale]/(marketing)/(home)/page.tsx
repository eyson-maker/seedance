import SeedanceHeroSection from '@/components/blocks/hero/seedance-hero';
import ShowcaseGrid from '@/components/blocks/showcase/showcase-grid';
import SeedancePricingSection from '@/components/blocks/pricing/seedance-pricing-section';
import FaqSection from '@/components/blocks/faqs/faqs';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#metadata-api
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    pathname: '',
  });
}

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage(props: HomePageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const faqT = await getTranslations({ locale, namespace: 'HomePage.faqs' });
  const baseUrl = getBaseUrl();

  // JSON-LD: WebApplication schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SeedanceAI',
    url: baseUrl,
    description: t('description'),
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '19.90',
      highPrice: '99.90',
      offerCount: 3,
    },
    creator: {
      '@type': 'Organization',
      name: 'SeedanceAI',
      url: baseUrl,
    },
  };

  // JSON-LD: FAQPage schema
  const faqItems = [
    { q: faqT('items.item-1.question'), a: faqT('items.item-1.answer') },
    { q: faqT('items.item-2.question'), a: faqT('items.item-2.answer') },
    { q: faqT('items.item-3.question'), a: faqT('items.item-3.answer') },
    { q: faqT('items.item-4.question'), a: faqT('items.item-4.answer') },
    { q: faqT('items.item-5.question'), a: faqT('items.item-5.answer') },
  ].map(({ q, a }) => ({
    '@type': 'Question' as const,
    name: q,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: a,
    },
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems,
  };

  return (
    <div className="flex flex-col bg-[#050505]" role="main" aria-label="SeedanceAI - AI Video Generator powered by Seedance 2.0">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SeedanceHeroSection />

      <ShowcaseGrid />

      <SeedancePricingSection />

      <FaqSection />
    </div>
  );
}

