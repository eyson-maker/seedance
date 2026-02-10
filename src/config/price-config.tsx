'use client';

import type { PricePlan } from '@/payment/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get price plans with translations for client components
 *
 * NOTICE: This function should only be used in client components.
 * If you need to get the price plans in server components, use getAllPricePlans instead.
 * Use this function when showing the pricing table or the billing card to the user.
 *
 * docs:
 * https://mksaas.com/docs/config/price
 *
 * @returns The price plans with translated content
 */
export function usePricePlans(): Record<string, PricePlan> {
  const t = useTranslations('PricePlans');
  const priceConfig = websiteConfig.price;
  const plans: Record<string, PricePlan> = {};

  if (priceConfig.plans.basic) {
    plans.basic = {
      ...priceConfig.plans.basic,
      name: t('basic.name'),
      description: t('basic.description'),
      features: [
        t('basic.features.feature-1'),
        t('basic.features.feature-2'),
        t('basic.features.feature-3'),
        t('basic.features.feature-4'),
        t('basic.features.feature-5'),
      ],
      limits: [
        t('basic.limits.limit-1'),
      ],
    };
  }

  if (priceConfig.plans.standard) {
    plans.standard = {
      ...priceConfig.plans.standard,
      name: t('standard.name'),
      description: t('standard.description'),
      features: [
        t('standard.features.feature-1'),
        t('standard.features.feature-2'),
        t('standard.features.feature-3'),
        t('standard.features.feature-4'),
        t('standard.features.feature-5'),
        t('standard.features.feature-6'),
      ],
      limits: [],
    };
  }

  if (priceConfig.plans.pro) {
    plans.pro = {
      ...priceConfig.plans.pro,
      name: t('pro.name'),
      description: t('pro.description'),
      features: [
        t('pro.features.feature-1'),
        t('pro.features.feature-2'),
        t('pro.features.feature-3'),
        t('pro.features.feature-4'),
        t('pro.features.feature-5'),
        t('pro.features.feature-6'),
        t('pro.features.feature-7'),
      ],
      limits: [],
    };
  }

  return plans;
}
