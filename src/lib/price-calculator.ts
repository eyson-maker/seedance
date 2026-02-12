/**
 * Calculator for video generation cost
 *
 * Pricing Model:
 * - Base Cost: 10 credits (Standard 5s, 720p/480p, No Audio)
 * - Duration Add-on: +5 credits if duration > 5s
 * - Resolution Add-on: +5 credits for 1080p
 * - Audio Add-on: +5 credits if enabled
 */

export const BASE_CREDIT_COST = 10;
export const DURATION_ADDON_COST = 5;
export const RESOLUTION_ADDON_COST = 5;
export const AUDIO_ADDON_COST = 5;

export interface GenerationCostParams {
  duration?: number;
  quality?: string;
  generateAudio?: boolean;
}

export function calculateGenerationCost(params: GenerationCostParams): number {
  const { duration = 5, quality = '720p', generateAudio = false } = params;
  
  let cost = BASE_CREDIT_COST;

  // Duration Add-on (> 5s)
  if (duration > 5) {
    cost += DURATION_ADDON_COST;
  }

  // Resolution Add-on (1080p)
  if (quality === '1080p') {
    cost += RESOLUTION_ADDON_COST;
  }

  // Audio Add-on
  if (generateAudio) {
    cost += AUDIO_ADDON_COST;
  }

  return cost;
}
