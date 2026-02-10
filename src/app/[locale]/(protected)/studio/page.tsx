import StudioClient from '@/components/studio/studio-client';
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
    title: `Studio | ${t('name')}`,
    description: t('description'),
    locale,
    pathname: '/studio',
  });
}

interface StudioPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function StudioPage(props: StudioPageProps) {
  return <StudioClient />;
}
