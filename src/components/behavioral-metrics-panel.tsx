/**
 * Behavioral Metrics Panel
 * 
 * Displays the 8 Signal Intelligence™ Capabilities with live evaluation scores.
 * This component replaces the legacy "Live EQ Analysis" component.
 * 
 * CRITICAL: All scores must be labeled "(illustrative)" and the mandatory
 * disclaimer must be displayed.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  signalIntelligenceCapabilities,
  SIGNAL_INTELLIGENCE_DISCLAIMER,
  type BehavioralMetricScore,
} from '@/lib/signal-intelligence-data';
import { cn } from '@/lib/utils';

interface BehavioralMetricsPanelProps {
  scores?: BehavioralMetricScore[];
  compact?: boolean;
  showDisclaimer?: boolean;
  className?: string;
}

export function BehavioralMetricsPanel({
  scores = [],
  compact = false,
  showDisclaimer = true,
  className,
}: BehavioralMetricsPanelProps) {
  const [expandedCapability, setExpandedCapability] = useState<string | null>(
    null
  );

  // Merge scores with capability definitions
  const capabilitiesWithScores = signalIntelligenceCapabilities.map((cap) => {
    const score = scores.find((s) => s.capabilityId === cap.id);
    return {
      ...cap,
      currentScore: score?.score ?? cap.exampleScore,
      maxScore: score?.maxScore ?? 5,
      feedback: score?.feedback,
      evidence: score?.evidence,
    };
  });

  const toggleExpanded = (capabilityId: string) => {
    setExpandedCapability(
      expandedCapability === capabilityId ? null : capabilityId
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Signal Intelligence™ Behavioral Metrics
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  {SIGNAL_INTELLIGENCE_DISCLAIMER.short}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          {SIGNAL_INTELLIGENCE_DISCLAIMER.micro}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Capabilities Grid */}
        <div
          className={cn(
            'grid gap-3',
            compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
          )}
        >
          {capabilitiesWithScores.map((capability) => {
            const Icon = capability.icon;
            const isExpanded = expandedCapability === capability.id;
            const scorePercentage =
              (capability.currentScore / capability.maxScore) * 100;

            return (
              <div
                key={capability.id}
                className="rounded-lg border border-border bg-card p-3 transition-all hover:shadow-sm"
              >
                {/* Capability Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div className={cn('rounded-md p-2', capability.bgColor)}>
                      <Icon className={cn('h-4 w-4', capability.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold leading-tight">
                        {capability.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {capability.behavioralMetric}
                      </p>
                    </div>
                  </div>
                  {!compact && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggleExpanded(capability.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Score Display */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Score
                    </span>
                    <span className="text-sm font-semibold">
                      {capability.currentScore.toFixed(1)} / {capability.maxScore}{' '}
                      <span className="text-xs text-muted-foreground font-normal">
                        (illustrative)
                      </span>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        scorePercentage >= 80
                          ? 'bg-green-500'
                          : scorePercentage >= 60
                            ? 'bg-blue-500'
                            : scorePercentage >= 40
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                      )}
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Feedback (if available) */}
                {capability.feedback && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {capability.feedback}
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && !compact && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs">
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        Definition
                      </p>
                      <p className="text-muted-foreground">
                        {capability.definition}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        How It's Evaluated
                      </p>
                      <p className="text-muted-foreground">
                        {capability.howEvaluated}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        What Good Looks Like
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {capability.whatGoodLooksLike.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {capability.evidence && capability.evidence.length > 0 && (
                      <div>
                        <p className="font-semibold text-foreground mb-1">
                          Evidence
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {capability.evidence.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mandatory Disclaimer */}
        {showDisclaimer && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{SIGNAL_INTELLIGENCE_DISCLAIMER.full}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Compact version for right panel in roleplay
 */
export function BehavioralMetricsCompact({
  scores,
  className,
}: BehavioralMetricsPanelProps) {
  return (
    <BehavioralMetricsPanel
      scores={scores}
      compact={true}
      showDisclaimer={false}
      className={className}
    />
  );
}
