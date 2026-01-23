import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Ear, 
  Target, 
  TrendingUp, 
  Shield, 
  GitBranch, 
  Handshake, 
  Shuffle,
  X,
  Lightbulb,
  Radio
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  eqMetrics,
  type EQMetric 
} from "@/lib/data";
import { getAllImprovementTipsForMetric } from "@/lib/metric-improvement-guidance";
import type { BehavioralMetricId } from "@/lib/signal-intelligence/metrics-spec";

interface MetricWithScore extends EQMetric {
  score: number | null;
}

// Icon mapping for each metric
const metricIcons: Record<string, any> = {
  'question_quality': MessageSquare,
  'listening_responsiveness': Ear,
  'making_it_matter': Target,
  'customer_engagement_signals': TrendingUp,
  'objection_navigation': Shield,
  'conversation_control_structure': GitBranch,
  'commitment_gaining': Handshake,
  'adaptability': Shuffle,
};

function MetricCard({ metric, onClick }: { metric: MetricWithScore; onClick: () => void }) {
  const Icon = metricIcons[metric.id] || MessageSquare;
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border/50"
      onClick={onClick}
      data-testid={`card-metric-${metric.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">
              {metric.displayName || metric.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metric.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricDetailDialog({ 
  metric, 
  open, 
  onOpenChange 
}: { 
  metric: MetricWithScore | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  if (!metric) return null;

  const improvementTips = getAllImprovementTipsForMetric(metric.id as BehavioralMetricId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {metric.displayName || metric.name}
              </DialogTitle>
              <p className="text-muted-foreground">
                {metric.description}
              </p>
            </div>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Observable Sub-Metrics */}
          {metric.examples && metric.examples.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                Observable Sub-Metrics
              </h3>
              <ul className="space-y-2">
                {metric.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Roll-Up Rule */}
          {metric.whyItMatters && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Roll-Up Rule
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {metric.whyItMatters}
              </p>
            </div>
          )}

          {/* What It Measures */}
          {metric.whatItMeasures && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                What It Measures
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {metric.whatItMeasures}
              </p>
            </div>
          )}

          {/* Coaching Insights */}
          {improvementTips.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Coaching Insights
              </h3>
              <div className="space-y-2">
                {improvementTips.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
  const [storedScores, setStoredScores] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // PROMPT #22: Load scores from localStorage
  useEffect(() => {
    const loadScores = async () => {
      const { getLatestRoleplayScores } = await import('@/lib/signal-intelligence/score-storage');
      const data = getLatestRoleplayScores();
      if (data) {
        setStoredScores(data.scores);
        setLastUpdated(data.timestamp);
        console.log('[EI_METRICS] Loaded scores from localStorage:', data.scores);
      } else {
        console.log('[EI_METRICS] No stored scores found, using defaults');
      }
    };
    loadScores();
  }, []);

  const metricsWithScores: MetricWithScore[] = eqMetrics.map(m => ({
    ...m,
    score: storedScores[m.id] ?? null  // Use stored score or null if not yet scored
  }));

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero Card */}
        <Card className="border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Behavioral Metrics
              </h1>
              <p className="text-xl text-muted-foreground">
                The Foundation of Signal Intelligence
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These 8 metrics are the <strong>only directly measured layer</strong>. They score observable behaviors (1-5) from role-play transcripts. Signal Intelligence capabilities are <strong>derived</strong> from these behavioral scores—never measured directly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsWithScores.map((metric) => (
            <MetricCard 
              key={metric.id} 
              metric={metric} 
              onClick={() => setSelectedMetric(metric)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Click any metric to view its definition, observable sub-metrics, and coaching guidance.</p>
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
