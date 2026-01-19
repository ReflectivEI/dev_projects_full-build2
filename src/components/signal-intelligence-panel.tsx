import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MetricResult } from "@/lib/signal-intelligence/scoring";

export interface SignalIntelligenceCapability {
  id?: string;
  type: "verbal" | "conversational" | "engagement" | "contextual";
  signal: string;
  interpretation: string;
  evidence?: string;
  suggestedOptions?: string[];
  timestamp?: string;
}

interface SignalIntelligencePanelProps {
  signals: SignalIntelligenceCapability[];
  isLoading?: boolean;
  hasActivity?: boolean;
  compact?: boolean;
  metricResults?: MetricResult[];
}

const signalTypeConfig = {
  verbal: {
    label: "Verbal",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  conversational: {
    label: "Conversational",
    icon: MessageCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  engagement: {
    label: "Engagement",
    icon: Eye,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  contextual: {
    label: "Contextual",
    icon: Clock,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30"
  }
};

function getSafeSignalType(type: unknown): SignalIntelligenceCapability["type"] {
  if (
    type === "verbal" ||
    type === "conversational" ||
    type === "engagement" ||
    type === "contextual"
  ) {
    return type;
  }
  return "contextual";
}

function getSignalConfig(type: unknown) {
  return signalTypeConfig[getSafeSignalType(type)];
}

function SignalCard({ signal }: { signal: SignalIntelligenceCapability }) {
  const config = getSignalConfig(signal.type);
  const Icon = config.icon ?? TrendingUp;

  if (!signal.signal && !signal.interpretation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`h-4 w-4 mt-0.5 ${config.color} flex-shrink-0`} />
        <div className="flex-1 min-w-0 space-y-1">
          <Badge variant="outline" className={`text-xs py-0 ${config.color}`}>
            {config.label}
          </Badge>

          <p className="text-sm font-medium">{signal.signal}</p>

          <p className="text-xs text-muted-foreground">
            {signal.interpretation}
          </p>

          {signal.evidence && (
            <p className="text-[11px] text-muted-foreground italic">
              Evidence: “{signal.evidence}”
            </p>
          )}

          {Array.isArray(signal.suggestedOptions) &&
            signal.suggestedOptions.length > 0 && (
              <div className="mt-2 space-y-1">
                {signal.suggestedOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-primary"
                  >
                    <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}

export function SignalIntelligencePanel({
  signals,
  isLoading,
  hasActivity,
  compact = false,
  metricResults = [],
  detectedCues
}: SignalIntelligencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const validSignals = signals.filter(
    s => s?.signal?.trim() || s?.interpretation?.trim()
  );

  const hasMetrics = metricResults.length > 0;

  if (!hasActivity && validSignals.length === 0) {
    return (
      <div className="space-y-3">
        <Header title="Signal Intelligence" />
        <EmptyState text="Observable signals will appear as the conversation progresses." />
      </div>
    );
  }

  if (isLoading && validSignals.length === 0) {
    return (
      <div className="space-y-3">
        <Header title="Detecting signals..." pulse />
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  const displaySignals = compact ? validSignals.slice(-3) : validSignals;

  return (
    <div className="space-y-3">
      {hasMetrics && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Behavioral Metrics</h4>
          <div className="space-y-1.5">
            {metricResults
              .filter(m => !m.not_applicable && m.overall_score !== null)
              .map(m => (
                <div key={m.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{m.metric}</span>
                  <span className="font-medium">{m.overall_score?.toFixed(1)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Header title="Signal Intelligence" count={displaySignals.length} />
        {!compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {(isExpanded || compact) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {displaySignals.map((s, i) => (
              <SignalCard key={s.id ?? i} signal={s} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
            <AlertCircle className="h-3 w-3" />
            <span>Observable signals only</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">
            Signal Intelligence reflects observable communication patterns.
            These are hypotheses, not conclusions about emotion, intent, or competence.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function Header({
  title,
  count,
  pulse
}: {
  title: string;
  count?: number;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Activity className={`h-4 w-4 text-primary ${pulse ? "animate-pulse" : ""}`} />
      <h4 className="text-sm font-medium">{title}</h4>
      {typeof count === "number" && count > 0 && (
        <Badge variant="secondary" className="text-xs py-0">
          {count}
        </Badge>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
      <Activity className="h-8 w-8 mb-2 opacity-30" />
      <p className="text-xs">{text}</p>
    </div>
  );
}
