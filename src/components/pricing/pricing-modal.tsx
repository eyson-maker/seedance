'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SeedancePricingSection from '@/components/blocks/pricing/seedance-pricing-section';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Pricing Modal
 *
 * Displays when a user tries to generate a video
 * but has insufficient credits. Shows the full
 * Seedance pricing section inside a dialog.
 */
export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#050505] border-neutral-800 p-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Choose a Plan</DialogTitle>
        </DialogHeader>
        <SeedancePricingSection className="py-12" id="pricing-modal" />
      </DialogContent>
    </Dialog>
  );
}
