/**
 * CueBadge Component
 * Displays observable behavioral cues detected during roleplay
 */

import { Badge } from "@/components/ui/badge";
import { getCueColorClass, type ObservableCue } from "@/lib/observable-cues";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CueBadgeProps {
  cue: ObservableCue;
  size?: "sm" | "md" | "lg";
}

export function CueBadge({ cue, size = "md" }: CueBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={`${getCueColorClass(cue.variant)} ${sizeClasses[size]} font-medium`}
      title={cue.description}
    >
      {cue.label}
    </Badge>
  );
}

interface CueBadgeGroupProps {
  cues: ObservableCue[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

export function CueBadgeGroup({ cues, maxVisible = 3, size = "md" }: CueBadgeGroupProps) {
  const [showAll, setShowAll] = useState(false);

  if (cues.length === 0) return null;

  const visibleCues = showAll ? cues : cues.slice(0, maxVisible);
  const hasMore = cues.length > maxVisible;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5 items-center">
      {visibleCues.map((cue, idx) => (
        <CueBadge key={`${cue.type}-${idx}`} cue={cue} size={size} />
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              +{cues.length - maxVisible} more
            </>
          )}
        </button>
      )}
    </div>
  );
}
