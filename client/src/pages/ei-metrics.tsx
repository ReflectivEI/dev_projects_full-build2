import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Activity, CheckCircle2, X, Radio } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  eqMetrics, 
  getPerformanceLevel, 
  getScoreColor, 
  getScoreBgColor,
  performanceLevels,
  type EQMetric 
} from "@/lib/data";

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
          <div>
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Definition
            </h4>
            <p className="text-sm text-muted-foreground">{metric.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Behavioral Measurement Method
            </h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <code className="text-sm font-mono">
                {metric.calculation || 'Not specified'}
              </code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Observable Indicators
            </h4>
            <ul className="space-y-1.5">
              {Array.isArray(metric.sampleIndicators) && metric.sampleIndicators.map((indicator, idx) => (
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
