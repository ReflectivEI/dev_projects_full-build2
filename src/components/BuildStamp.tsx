/**
 * BuildStamp Component
 * 
 * Displays build information (git SHA + build time) for deployment verification.
 * Pure presentational component with no side effects.
 * 
 * Environment variables (injected at build time):
 * - VITE_GIT_SHA: Full git commit SHA
 * - VITE_BUILD_TIME: ISO 8601 timestamp of build
 */

import { useMemo } from 'react';

export function BuildStamp() {
  const buildInfo = useMemo(() => {
    const sha = import.meta.env.VITE_GIT_SHA;
    const buildTime = import.meta.env.VITE_BUILD_TIME;

    // Shorten SHA to 7 characters (git short SHA convention)
    const shortSha = sha ? sha.substring(0, 7) : 'unknown';

    // Format build time (if available)
    let formattedTime = 'unknown';
    if (buildTime) {
      try {
        const date = new Date(buildTime);
        // Format: YYYY-MM-DD HH:MM UTC
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        formattedTime = `${year}-${month}-${day} ${hours}:${minutes} UTC`;
      } catch {
        // If date parsing fails, use 'unknown'
        formattedTime = 'unknown';
      }
    }

    return { shortSha, formattedTime };
  }, []);

  return (
    <div className="text-xs text-muted-foreground">
      Build: {buildInfo.shortSha} • {buildInfo.formattedTime}
    </div>
  );
}
