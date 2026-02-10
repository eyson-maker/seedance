import { PaymentTypes, PlanIntervals } from '@/payment/types';
import type { WebsiteConfig } from '@/types';

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  ui: {
    mode: {
      defaultMode: 'dark',
      enableSwitch: true,
    },
  },
  metadata: {
    images: {
      ogImage: '/og.png',
      logoLight: '/logo.png',
      logoDark: '/logo-dark.png',
    },
    social: {
      github: 'https://github.com/MkSaaSHQ',
      twitter: 'https://mksaas.link/twitter',
      blueSky: 'https://mksaas.link/bsky',
      discord: 'https://mksaas.link/discord',
      mastodon: 'https://mksaas.link/mastodon',
      linkedin: 'https://mksaas.link/linkedin',
      youtube: 'https://mksaas.link/youtube',
    },
  },
  features: {
    enableUpgradeCard: true,
    enableUpdateAvatar: true,
    enableAffonsoAffiliate: false,
    enablePromotekitAffiliate: false,
    enableDatafastRevenueTrack: false,
    enableCrispChat: process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true',
    enableTurnstileCaptcha: process.env.NEXT_PUBLIC_DEMO_WEBSITE === 'true',
  },
  routes: {
    defaultLoginRedirect: '/dashboard',
  },
  analytics: {
    enableVercelAnalytics: false,
    enableSpeedInsights: false,
  },
  auth: {
    enableGoogleLogin: true,
    enableGithubLogin: true,
    enableCredentialLogin: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        flag: '🇺🇸',
        name: 'English',
        hreflang: 'en',
      },
      zh: {
        flag: '🇨🇳',
        name: '中文',
        hreflang: 'zh-CN',
      },
    },
  },
  blog: {
    enable: true,
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  docs: {
    enable: true,
  },
  mail: {
    provider: 'resend',
    fromEmail: 'MkSaaS <support@mksaas.com>',
    supportEmail: 'MkSaaS <support@mksaas.com>',
  },
  newsletter: {
    enable: true,
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  storage: {
    enable: true,
    provider: 's3',
  },
  payment: {
    provider: 'stripe',
  },
  price: {
    plans: {
      basic: {
        id: 'basic',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY!,
            amount: 1990,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY!,
            amount: 11940,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: {
          enable: true,
          amount: 800,
          expireDays: 30,
        },
      },
      standard: {
        id: 'standard',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD_MONTHLY!,
            amount: 3990,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD_YEARLY!,
            amount: 23940,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        popular: true,
        credits: {
          enable: true,
          amount: 2000,
          expireDays: 30,
        },
      },
      pro: {
        id: 'pro',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
            amount: 9990,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
            amount: 59940,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: {
          enable: true,
          amount: 6000,
          expireDays: 30,
        },
      },
    },
  },
  credits: {
    enableCredits: true,
    enablePackagesForFreePlan: false,
    registerGiftCredits: {
      enable: false,
      amount: 0,
      expireDays: 0,
    },
    packages: {
      starter: {
        id: 'starter',
        popular: false,
        amount: 1000,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER!,
          amount: 2990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
      creator: {
        id: 'creator',
        popular: true,
        amount: 2000,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_CREATOR!,
          amount: 4990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
      professional: {
        id: 'professional',
        popular: false,
        amount: 5000,
        price: {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL!,
          amount: 9990,
          currency: 'USD',
          allowPromotionCode: true,
        },
      },
    },
  },
};
