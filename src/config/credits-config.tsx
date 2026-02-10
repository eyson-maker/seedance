'use client';

import type { CreditPackage } from '@/credits/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get credit packages with translations for client components
 *
 * NOTICE: This function should only be used in client components.
 * If you need to get the credit packages in server components, use getAllCreditPackages instead.
 * Use this function when showing the credit packages to the user.
 *
 * docs:
 * https://mksaas.com/docs/config/credits
 *
 * @returns The credit packages with translated content
 */
export function useCreditPackages(): Record<string, CreditPackage> {
  const t = useTranslations('CreditPackages');
  const creditConfig = websiteConfig.credits;
  const packages: Record<string, CreditPackage> = {};

  if (creditConfig.packages.starter) {
    packages.starter = {
      ...creditConfig.packages.starter,
      name: t('starter.name'),
      description: t('starter.description'),
    };
  }

  if (creditConfig.packages.creator) {
    packages.creator = {
      ...creditConfig.packages.creator,
      name: t('creator.name'),
      description: t('creator.description'),
    };
  }

  if (creditConfig.packages.professional) {
    packages.professional = {
      ...creditConfig.packages.professional,
      name: t('professional.name'),
      description: t('professional.description'),
    };
  }

  return packages;
}
