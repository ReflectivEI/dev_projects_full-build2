import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Signal-aligned replacement for LiveEQAnalysis.
 * EI scoring, metrics, and labels are intentionally removed.
 * This component now acts as a Signal Reflection panel.
 */

export interface SignalReflection {
  summary?: string;
  observedPatterns?: string[];
  timestamp?: string;
}

interface SignalReflectionPanelProps {
  reflection: SignalReflection | null;
  isLoading?: boolean;
  hasMessages?: boolean;
}

export function LiveEQAnalysis({
  reflection,
  isLoading,
  hasMessages
}: SignalReflectionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!hasMessages && !reflection) {
    return (
      <div className="space-y-4">
        <Header title="Signal Reflection" />
        <EmptyState text="Reflections will appear as observable patterns emerge." />
      </div>
    );
  }

  if (isLoading && !reflection) {
    return (
      <div className="space-y-4">
        <Header title="Analyzing signals..." pulse />
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Header title="Signal Reflection" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && reflection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3"
          >
            {reflection.summary && (
              <div className="p-3 rounded-lg border bg-muted/40">
                <p className="text-sm text-muted-foreground">
                  {reflection.summary}
                </p>
              </div>
            )}

            {Array.isArray(reflection.observedPatterns) &&
              reflection.observedPatterns.map((p, i) => (
                <div
                  key={i}
                  className="p-2 rounded-md border text-xs text-muted-foreground"
                >
                  {p}
                </div>
              ))}

            <Footer timestamp={reflection.timestamp} />
          </motion.div>
        )}
      </AnimatePresence>

      <Disclaimer />
    </div>
  );
}

function Header({
  title,
  pulse
}: {
  title: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <AlertCircle className={`h-4 w-4 text-primary ${pulse ? "animate-pulse" : ""}`} />
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
      <AlertCircle className="h-10 w-10 mb-3 opacity-30" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function Footer({ timestamp }: { timestamp?: string }) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
      <Badge variant="outline" className="text-xs py-0">
        Signal Intelligence
      </Badge>
      {timestamp && (
        <span className="opacity-50">
          Updated: {new Date(timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

function Disclaimer() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
          <AlertCircle className="h-3 w-3" />
          <span>No scoring or evaluation</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs">
          This panel reflects observable communication patterns only.
          It does not score, rate, or assess behavioral capabilities,
          intent, or performance.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
