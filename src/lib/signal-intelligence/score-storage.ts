/**
 * Score Storage - Persist behavioral metric scores across sessions
 * Stores roleplay scores in localStorage for display on Behavioral Metrics page
 */

import type { BehavioralMetricId } from './metrics-spec';

const STORAGE_KEY = 'reflectivai-roleplay-scores';
const TIMESTAMP_KEY = 'reflectivai-roleplay-timestamp';

export interface StoredScores {
  [metricId: string]: number;
}

export interface RoleplayScoreData {
  scores: StoredScores;
  timestamp: string;
  sessionId?: string;
}

/**
 * Save roleplay scores to localStorage
 */
export function saveRoleplayScores(
  scores: StoredScores,
  sessionId?: string
): void {
  try {
    const data: RoleplayScoreData = {
      scores,
      timestamp: new Date().toISOString(),
      sessionId
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[SCORE_STORAGE] Saved roleplay scores:', data);
  } catch (err) {
    console.error('[SCORE_STORAGE] Failed to save scores:', err);
  }
}

/**
 * Load latest roleplay scores from localStorage
 */
export function getLatestRoleplayScores(): RoleplayScoreData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: RoleplayScoreData = JSON.parse(stored);
    console.log('[SCORE_STORAGE] Loaded roleplay scores:', data);
    return data;
  } catch (err) {
    console.error('[SCORE_STORAGE] Failed to load scores:', err);
    return null;
  }
}

/**
 * Get score for a specific metric
 */
export function getMetricScore(metricId: BehavioralMetricId): number | null {
  const data = getLatestRoleplayScores();
  if (!data) return null;

  return data.scores[metricId] ?? null;
}

/**
 * Check if scores exist
 */
export function hasStoredScores(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear stored scores
 */
export function clearStoredScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[SCORE_STORAGE] Cleared roleplay scores');
  } catch (err) {
    console.error('[SCORE_STORAGE] Failed to clear scores:', err);
  }
}

/**
 * Get timestamp of last roleplay
 */
export function getLastRoleplayTimestamp(): string | null {
  const data = getLatestRoleplayScores();
  return data?.timestamp ?? null;
}

/**
 * Format timestamp for display
 */
export function formatRoleplayTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  } catch (err) {
    return 'Unknown';
  }
}
