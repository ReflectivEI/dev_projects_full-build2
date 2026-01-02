/**
 * Capability Detail Card
 * 
 * Expandable detail view for each Signal Intelligence™ Capability.
 * Used in evaluation dialogs and detailed capability views.
 * 
 * Displays:
 * - Capability name and behavioral metric
 * - Example score (illustrative)
 * - Definition
 * - How It's Evaluated
 * - What Good Looks Like
 * - How It's Calculated
 * - How It's Measured
 * - Score calculation example
 * - Mandatory disclaimer
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  type SignalIntelligenceCapability,
  SIGNAL_INTELLIGENCE_DISCLAIMER,
} from '@/lib/signal-intelligence-data';
import { cn } from '@/lib/utils';

interface CapabilityDetailCardProps {
  capability: SignalIntelligenceCapability;
  score?: number;
  maxScore?: number;
  feedback?: string;
  evidence?: string[];
  showCalculation?: boolean;
  showDisclaimer?: boolean;
  className?: string;
}

export function CapabilityDetailCard({
  capability,
  score,
  maxScore = 5,
  feedback,
  evidence,
  showCalculation = false,
  showDisclaimer = true,
  className,
}: CapabilityDetailCardProps) {
  const displayScore = score ?? capability.exampleScore;
  const scorePercentage = (displayScore / maxScore) * 100;
  const Icon = capability.icon;

  // Determine score status
  const getScoreStatus = (percentage: number) => {
    if (percentage >= 80) return { label: 'Strong', color: 'text-green-500' };
    if (percentage >= 60) return { label: 'Developing', color: 'text-blue-500' };
    if (percentage >= 40) return { label: 'Emerging', color: 'text-amber-500' };
    return { label: 'Focus Area', color: 'text-red-500' };
  };

  const scoreStatus = getScoreStatus(scorePercentage);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        {/* Capability Header */}
        <div className="flex items-start gap-4">
          <div className={cn('rounded-lg p-3', capability.bgColor)}>
            <Icon className={cn('h-6 w-6', capability.color)} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{capability.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {capability.behavioralMetric}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {displayScore.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ {maxScore}</span>
              <Badge variant="outline" className="ml-2">
                illustrative
              </Badge>
            </div>
          </div>
          <Progress value={scorePercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className={cn('font-medium', scoreStatus.color)}>
              {scoreStatus.label}
            </span>
            <span className="text-muted-foreground">
              {scorePercentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-sm">{feedback}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Definition */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Definition
          </h4>
          <p className="text-sm text-muted-foreground">
            {capability.definition}
          </p>
        </div>

        {/* How It's Evaluated */}
        <div>
          <h4 className="text-sm font-semibold mb-2">How It's Evaluated</h4>
          <p className="text-sm text-muted-foreground">
            {capability.howEvaluated}
          </p>
        </div>

        {/* What Good Looks Like */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            What Good Looks Like
          </h4>
          <ul className="space-y-1.5">
            {capability.whatGoodLooksLike.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-green-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence (if provided) */}
        {evidence && evidence.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              Evidence from Session
            </h4>
            <ul className="space-y-1.5">
              {evidence.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How It's Calculated */}
        <div>
          <h4 className="text-sm font-semibold mb-2">How It's Calculated</h4>
          <ul className="space-y-1.5">
            {capability.howCalculated.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score Calculation Example */}
        {showCalculation && (
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Score Calculation (Example)
            </h4>
            <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-2">
              {capability.scoreCalculationExample.components.map(
                (component, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {component.name}
                    </span>
                    <span className="font-mono">
                      {component.value.toFixed(2)} × {component.weight.toFixed(1)}
                    </span>
                  </div>
                )
              )}
              <div className="pt-2 border-t border-border flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>
                  {capability.scoreCalculationExample.total.toFixed(1)} / 5
                </span>
              </div>
            </div>
          </div>
        )}

        {/* How It's Measured */}
        <div>
          <h4 className="text-sm font-semibold mb-2">How It's Measured</h4>
          <p className="text-sm text-muted-foreground">
            {capability.howMeasured}
          </p>
        </div>

        {/* Mandatory Disclaimer */}
        {showDisclaimer && (
          <div className="pt-4 border-t border-border">
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
