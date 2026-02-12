'use client';

import { usePricePlans } from '@/config/price-config';
import { useCreditPackages } from '@/config/credits-config';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMounted } from '@/hooks/use-mounted';
import { useLocalePathname } from '@/i18n/navigation';
import { formatPrice } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import {
  PaymentTypes,
  type PlanInterval,
  PlanIntervals,
} from '@/payment/types';
import { CheckCircleIcon, XCircleIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { LoginWrapper } from '@/components/auth/login-wrapper';
import { CheckoutButton } from '@/components/pricing/create-checkout-button';
import { Button } from '@/components/ui/button';

/**
 * SeedanceAI Pricing Section
 *
 * Sora2.com-inspired dark theme pricing with:
 * - Tabs for Subscriptions / Credit Packs
 * - Monthly/Annually toggle with "Save 50%" badge
 * - Blue glow highlight on popular plans (Standard / Creator)
 */
export default function SeedancePricingSection({
  className,
  id = 'pricing',
}: {
  className?: string;
  id?: string;
}) {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'payg'>('subscriptions');
  const [interval, setInterval] = useState<PlanInterval>(PlanIntervals.MONTH);

  return (
    <section id={id} className={cn('relative py-24 px-4', className)}>
      {/* Background gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            SeedanceAI Pricing Plans
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Generate cinematic AI videos with Seedance 2.0. Choose a subscription or credit pack to start creating with native audio sync.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-neutral-900 border border-neutral-800 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('subscriptions')}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                activeTab === 'subscriptions'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-neutral-200'
              )}
            >
              Subscriptions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('payg')}
              className={cn(
                'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                activeTab === 'payg'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-neutral-200'
              )}
            >
              Pay as you go
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'subscriptions' ? (
          <SubscriptionPlans interval={interval} setInterval={setInterval} />
        ) : (
          <PayAsYouGoPacks />
        )}
      </div>
    </section>
  );
}

/**
 * Subscription Plans Tab
 */
function SubscriptionPlans({
  interval,
  setInterval,
}: {
  interval: PlanInterval;
  setInterval: (i: PlanInterval) => void;
}) {
  const plans = usePricePlans();
  const currentUser = useCurrentUser();
  const currentPath = useLocalePathname();
  const mounted = useMounted();

  const planOrder = ['basic', 'standard', 'pro'];

  return (
    <div className="space-y-8">
      {/* Monthly / Annually Toggle */}
      <div className="flex justify-center items-center gap-3">
        <button
          type="button"
          onClick={() => setInterval(PlanIntervals.MONTH)}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer',
            interval === PlanIntervals.MONTH
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-neutral-200 border border-neutral-700'
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setInterval(PlanIntervals.YEAR)}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-2',
            interval === PlanIntervals.YEAR
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-neutral-200 border border-neutral-700'
          )}
        >
          Yearly
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white leading-none">
            -50%
          </span>
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planOrder.map((planKey) => {
          const plan = plans[planKey];
          if (!plan) return null;

          const price = plan.prices.find(
            (p) =>
              p.type === PaymentTypes.SUBSCRIPTION && p.interval === interval
          );

          const isPopular = plan.popular;
          const monthlyAmount = price
            ? interval === PlanIntervals.YEAR
              ? Math.round(price.amount / 12)
              : price.amount
            : 0;

          const yearlyTotal = plan.prices.find(
            (p) =>
              p.type === PaymentTypes.SUBSCRIPTION &&
              p.interval === PlanIntervals.YEAR
          )?.amount;

          return (
            <div
              key={planKey}
              className={cn(
                'relative rounded-2xl p-px transition-all duration-300',
                isPopular
                  ? 'bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]'
                  : 'bg-neutral-800'
              )}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                    <Sparkles className="size-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className={cn(
                'rounded-2xl p-6 md:p-8 h-full flex flex-col',
                'bg-[#111111]'
              )}>
                {/* Plan Name */}
                <h3 className="text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(monthlyAmount, 'USD')}
                    </span>
                    <span className="text-neutral-500 text-sm">/mo</span>
                  </div>
                  {interval === PlanIntervals.YEAR && yearlyTotal && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Billed {formatPrice(yearlyTotal, 'USD')} annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                {mounted && currentUser && price ? (
                  <CheckoutButton
                    userId={currentUser.id}
                    planId={plan.id}
                    priceId={price.priceId}
                    className={cn(
                      'w-full py-3 rounded-xl font-medium transition-all cursor-pointer mb-8',
                      isPopular
                        ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    )}
                  >
                    Get Started
                  </CheckoutButton>
                ) : (
                  <LoginWrapper mode="modal" asChild callbackUrl={currentPath}>
                    <Button
                      className={cn(
                        'w-full py-3 rounded-xl font-medium transition-all cursor-pointer mb-8',
                        isPopular
                          ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white hover:bg-neutral-200 text-black'
                      )}
                    >
                      Get Started
                    </Button>
                  </LoginWrapper>
                )}

                {/* Divider */}
                <div className="border-t border-neutral-800 mb-6" />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircleIcon className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-neutral-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limits?.map((limit, i) => (
                    <li key={`limit-${i}`} className="flex items-start gap-3 text-sm">
                      <XCircleIcon className="size-4 text-neutral-600 mt-0.5 shrink-0" />
                      <span className="text-neutral-500">{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Pay As You Go Tab
 */
function PayAsYouGoPacks() {
  const packages = useCreditPackages();
  const currentUser = useCurrentUser();
  const currentPath = useLocalePathname();
  const mounted = useMounted();

  // Combined list of all credit packages, sorted by price
  const allPacks = [
    {
      id: 'mini',
      name: 'Mini Pack',
      description: 'Perfect for testing waters',
      amount: 200,
      price: 599, // $5.99
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PAYG_MINI!,
      popular: false,
      currency: 'USD',
    },
    {
      id: 'plus',
      name: 'Plus Pack',
      description: 'Best value for creators',
      amount: 500,
      price: 1499, // $14.99
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PAYG_PLUS!,
      popular: true,
      currency: 'USD',
    },
    {
      // Map existing starter pack
      id: packages.starter?.id || 'starter',
      name: packages.starter?.name || 'Starter Pack',
      description: packages.starter?.description || 'For occasional videos',
      amount: packages.starter?.amount || 1000,
      price: packages.starter?.price.amount || 2990,
      priceId: packages.starter?.price.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_STARTER!,
      popular: packages.starter?.popular || false,
      currency: packages.starter?.price.currency || 'USD',
    },
    {
      id: 'power',
      name: 'Power Pack',
      description: 'For serious projects',
      amount: 1500,
      price: 3999, // $39.99
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PAYG_POWER!,
      popular: false,
      currency: 'USD',
    },
    {
      // Map existing creator pack
      id: packages.creator?.id || 'creator',
      name: packages.creator?.name || 'Creator Pack',
      description: packages.creator?.description || 'Our most popular option',
      amount: packages.creator?.amount || 2000,
      price: packages.creator?.price.amount || 4990,
      priceId: packages.creator?.price.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_CREATOR!,
      popular: packages.creator?.popular || false,
      currency: packages.creator?.price.currency || 'USD',
    },
    {
      // Map existing professional pack
      id: packages.professional?.id || 'professional',
      name: packages.professional?.name || 'Pro Pack',
      description: packages.professional?.description || 'Maximum value',
      amount: packages.professional?.amount || 5000,
      price: packages.professional?.price.amount || 9990,
      priceId: packages.professional?.price.priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_PROFESSIONAL!,
      popular: packages.professional?.popular || false,
      currency: packages.professional?.price.currency || 'USD',
    },
  ].sort((a, b) => a.price - b.price); // Ensure sorted by price just in case

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-neutral-500 mb-8">
        No subscription required • Credits valid for 90 days • One-time purchase
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPacks.map((pack) => {
          const isPopular = pack.popular;

          return (
            <div
              key={pack.id}
              className={cn(
                'relative rounded-2xl p-px transition-all duration-300',
                isPopular
                  ? 'bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
                  : 'bg-neutral-800'
              )}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <Sparkles className="size-3" />
                    Best Value
                  </span>
                </div>
              )}

              <div className="rounded-2xl p-6 md:p-8 h-full flex flex-col bg-[#111111]">
                {/* Package Name */}
                <h3 className="text-lg font-semibold text-white mb-1">
                  {pack.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  {pack.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(pack.price, pack.currency)}
                  </span>
                </div>

                {/* Credits amount */}
                <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-2xl">⚡️</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {pack.amount.toLocaleString()} credits
                    </p>
                    <p className="text-xs text-neutral-500">
                      ~{Math.round(pack.amount / 10)} videos
                    </p>
                  </div>
                </div>

                {/* CTA */}
                {mounted && currentUser ? (
                  <CheckoutButton
                    userId={currentUser.id}
                    planId={pack.id.startsWith('payg-') ? pack.id : `credit-${pack.id}`}
                    priceId={pack.priceId}
                    className={cn(
                      'w-full py-3 rounded-xl font-medium transition-all cursor-pointer',
                      isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    )}
                  >
                    Top Up
                  </CheckoutButton>
                ) : (
                  <LoginWrapper mode="modal" asChild callbackUrl={currentPath}>
                    <Button
                      className={cn(
                        'w-full py-3 rounded-xl font-medium transition-all cursor-pointer',
                        isPopular
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                          : 'bg-white hover:bg-neutral-200 text-black'
                      )}
                    >
                      Top Up
                    </Button>
                  </LoginWrapper>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
