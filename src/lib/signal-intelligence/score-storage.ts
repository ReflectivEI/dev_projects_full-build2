/**
 * Score Storage System
 * Persists roleplay scores to localStorage for EI Metrics page
 */

const STORAGE_KEY = 'reflectivai-roleplay-scores';

interface StoredScores {
  timestamp: string;
  scores: Record<string, number>;
}

/**
 * Save roleplay scores to localStorage
 * @param scores - Map of capability ID to score (1-5)
 */
export function saveRoleplayScores(scores: Record<string, number>): void {
  const data: StoredScores = {
    timestamp: new Date().toISOString(),
    scores,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[SCORE_STORAGE] Saved scores:', scores);
  } catch (error) {
    console.error('[SCORE_STORAGE] Failed to save scores:', error);
  }
}

/**
 * Load roleplay scores from localStorage
 * @returns Map of capability ID to score, or null if no scores exist
 */
export function loadRoleplayScores(): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredScores = JSON.parse(raw);
    console.log('[SCORE_STORAGE] Loaded scores:', data.scores);
    return data.scores;
  } catch (error) {
    console.error('[SCORE_STORAGE] Failed to load scores:', error);
    return null;
  }
}

/**
 * Clear stored roleplay scores
 */
export function clearRoleplayScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[SCORE_STORAGE] Cleared scores');
  } catch (error) {
    console.error('[SCORE_STORAGE] Failed to clear scores:', error);
  }
}

/**
 * Get the timestamp of the last saved scores
 */
export function getScoresTimestamp(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const data: StoredScores = JSON.parse(raw);
    return data.timestamp;
  } catch (error) {
    console.error('[SCORE_STORAGE] Failed to get timestamp:', error);
    return null;
  }
}
