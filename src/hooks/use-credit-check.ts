'use client';

import { useCreditBalance } from '@/hooks/use-credits';
import { useState, useCallback } from 'react';

/**
 * Credit check hook for the generate button
 *
 * Checks if the user has enough credits to generate a video (default: 10 credits).
 * If not, opens the pricing modal.
 *
 * Usage:
 * ```tsx
 * const { checkCredits, showPricingModal, setShowPricingModal, credits } = useCreditCheck();
 *
 * const handleGenerate = () => {
 *   if (!checkCredits(10)) return; // Will open pricing modal
 *   // Proceed with generation...
 * };
 * ```
 */
export function useCreditCheck() {
  const { data: credits, isLoading } = useCreditBalance();
  const [showPricingModal, setShowPricingModal] = useState(false);

  const checkCredits = useCallback(
    (requiredCredits: number = 10) => {
      if (isLoading) return false;
      if (!credits || credits < requiredCredits) {
        setShowPricingModal(true);
        return false;
      }
      return true;
    },
    [credits, isLoading]
  );

  return {
    checkCredits,
    showPricingModal,
    setShowPricingModal,
    credits: credits ?? 0,
    isLoading,
  };
}
