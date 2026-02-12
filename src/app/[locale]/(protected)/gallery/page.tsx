import GalleryClient from '@/components/gallery/gallery-client';
import { constructMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: `Gallery | ${t('name')}`,
    description: t('description'),
    locale,
    pathname: '/gallery',
  });
}

export default async function GalleryPage() {
  return <GalleryClient />;
}
