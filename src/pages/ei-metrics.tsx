import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Activity, CheckCircle2, X, Radio, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  eqMetrics, 
  getPerformanceLevel, 
  getScoreColor, 
  getScoreBgColor,
  performanceLevels,
  type EQMetric 
} from "@/lib/data";
import { getMetricUIData } from "@/lib/metrics-ui-adapter";
import { getAllImprovementTipsForMetric } from "@/lib/metric-improvement-guidance";
import type { BehavioralMetricId } from "@/lib/signal-intelligence/metrics-spec";

interface MetricWithScore extends EQMetric {
  score: number;
}

function MetricCard({ metric, onClick }: { metric: MetricWithScore; onClick: () => void }) {
  const performanceLevel = getPerformanceLevel(metric.score);
  
  return (
    <div
      className={`rounded-xl p-5 cursor-pointer transition-all hover-elevate border ${getScoreBgColor(metric.score)}`}
      onClick={onClick}
      data-testid={`card-metric-${metric.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {metric.displayName || metric.name}
          </span>
          <Badge variant="outline" className="text-xs py-0 bg-muted/50 text-muted-foreground border-muted">
            Behavioral Metric
          </Badge>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>
            {metric.score.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">/5</span>
        </div>
        <p className="text-xs text-muted-foreground">Not yet scored — connect to a Role Play transcript to calculate</p>
        
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${performanceLevel.bgColor} ${performanceLevel.color} border-0`}>
            {performanceLevel.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function MetricDetailDialog({ metric, open, onOpenChange }: { 
  metric: MetricWithScore | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!metric) return null;
  
  const performanceLevel = getPerformanceLevel(metric.score);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{metric.displayName || metric.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score.toFixed(1)}/5
                </span>
                <Badge className={`${performanceLevel.bgColor} ${performanceLevel.color} border-0`}>
                  {performanceLevel.label}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {(() => {
            const uiData = getMetricUIData(metric.id);
            if (!uiData) {
              return (
                <div className="text-sm text-muted-foreground">
                  Metric data not available
                </div>
              );
            }
            return (
              <>
                <div>
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Definition
                  </h4>
                  <p className="text-sm text-muted-foreground">{uiData.definition}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Behavioral Measurement Method
                  </h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {uiData.measurementMethod}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Observable Indicators
                  </h4>
                  <ul className="space-y-1.5">
                    {uiData.indicators.map((indicator, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary" />
                    How This Is Evaluated
                  </h4>
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    {uiData.heuristicsExplanation.split('\n\n').map((section, idx) => {
                      const parts = section.split(': ');
                      if (parts.length === 2) {
                        return (
                          <div key={idx} className="text-xs">
                            <div className="font-semibold text-foreground mb-1">{parts[0]}</div>
                            <div className="text-muted-foreground">{parts[1]}</div>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {section}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        <div className="space-y-4">

          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Radio className="h-4 w-4 text-muted-foreground" />
              Signals observed during Role Play
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              During Role Play and real-world conversations, Signal Intelligence is informed by observable cues that vary by scenario and customer behavior.
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              These signals reflect what is happening in the interaction and provide context for how a Behavioral Metric is demonstrated.
            </p>
            <ul className="space-y-1.5 mb-2">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                Changes in tone or pacing
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                Interruptions or shortened responses
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                Hesitation or delayed replies
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                Follow-up questions after new information
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                Shifts from openness to resistance (or vice versa)
              </li>
            </ul>
            <p className="text-xs text-muted-foreground italic">
              Signals support reflection and coaching. They do not independently determine outcomes, intent, or capability.
            </p>
          </div>

          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm mb-1">Key Tip</h4>
            <p className="text-sm text-muted-foreground italic">
              {metric.keyTip || 'Focus on observable behaviors and adjust your approach based on customer cues.'}
            </p>
          </div>

          {/* How to Improve This Score */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              How to Improve This Score
            </h4>
            {metric.score === 3.0 ? (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Complete a Role Play to receive personalized guidance based on your performance.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const improvementGuidance = getAllImprovementTipsForMetric(metric.id as BehavioralMetricId);
                  if (improvementGuidance.length === 0) {
                    return (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Complete a Role Play to receive personalized guidance.
                        </p>
                      </div>
                    );
                  }
                  
                  // Find the lowest-scoring component (simulated for now)
                  const lowestComponent = improvementGuidance[0];
                  
                  return (
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                      <div className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-2">
                        Focus Area: {lowestComponent.componentName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </div>
                      <ul className="space-y-2">
                        {lowestComponent.improvementTips.slice(0, 3).map((tip, idx) => (
                          <li key={idx} className="text-sm text-amber-900 dark:text-amber-100 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground italic">
              Metrics reflect observable behaviors, not traits, intent, or personality.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EIMetricsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricWithScore | null>(null);

  const metricsWithScores: MetricWithScore[] = eqMetrics.map(m => ({
    ...m,
    score: 3.0
  }));

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-ei-metrics-title">Behavioral Metrics Overview</h1>
          </div>
          <p className="text-muted-foreground">
            Observable behaviors derived from Signal Intelligence capabilities. Scores shown are illustrative.
          </p>
          <p className="text-sm text-muted-foreground">
            Click any metric to view its definition, measurement method, and coaching guidance.
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Layer 1 - Signal Intelligence (Core Measurement)</p>
                <p className="text-sm text-muted-foreground">
                  Signal Intelligence refers to <strong>demonstrated capability</strong>: how effectively you perceive observable signals, 
                  interpret them in context, and adapt your communication. Metrics are scored 1-5 based on observable 
                  behaviors, not personality traits.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">Performance Levels:</span>
          {Object.values(performanceLevels).map(level => (
            <span key={level.level} className={`flex items-center gap-1 ${level.color}`}>
              <span className={`w-2 h-2 rounded-full ${level.bgColor.replace('/10', '')}`} />
              {level.label} ({level.range})
            </span>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Behavioral Metrics (Always Active)
              </h2>
              <p className="text-sm text-muted-foreground">
                These eight Behavioral Metrics are foundational to Signal Intelligence and are consistently applied across coaching, Role Play, and evaluation.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {metricsWithScores.map((metric) => (
              <MetricCard 
                key={metric.id} 
                metric={metric} 
                onClick={() => setSelectedMetric(metric)}
              />
            ))}
          </div>
        </div>
      </div>

      <MetricDetailDialog
        metric={selectedMetric}
        open={!!selectedMetric}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
      />
    </div>
  );
}
