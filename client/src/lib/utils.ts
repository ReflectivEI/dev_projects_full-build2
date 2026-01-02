import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * UI utility (unchanged)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Signal Intelligence utilities
 */

/**
 * Ensures signals conform to Signal Intelligence guardrails:
 * - No scoring
 * - No trait labels
 * - Hypothesis-based language
 * - Evidence required
 */
export function sanitizeSignals(rawSignals: any[]): any[] {
  if (!Array.isArray(rawSignals)) return [];

  return rawSignals
    .flatMap((entry) => entry?.signals ?? entry)
    .filter((s) => {
      if (!s) return false;
      if (!s.type || !s.signal || !s.interpretation) return false;
      return true;
    })
    .map((s) => ({
      type: s.type,
      signal: String(s.signal),
      interpretation: enforceUncertaintyLanguage(String(s.interpretation)),
      evidence: s.evidence ? String(s.evidence) : "",
      suggestedOptions: Array.isArray(s.suggestedOptions)
        ? s.suggestedOptions.map(String)
        : [],
    }));
}

/**
 * Enforces uncertainty language in interpretations
 */
function enforceUncertaintyLanguage(text: string): string {
  const lowered = text.toLowerCase();
  if (
    lowered.includes("indicates") ||
    lowered.includes("means") ||
    lowered.includes("shows that")
  ) {
    return `May indicate ${text.replace(/^(indicates|means|shows that)/i, "").trim()}`;
  }
  return text;
}
