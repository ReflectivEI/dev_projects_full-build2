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
      className="cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:-translate-y-1 hover:border-teal-500/50 border-border/50"
      onClick={onClick}
      data-testid={`card-metric-${metric.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
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
  const Icon = metricIcons[metric.id] || MessageSquare;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{metric.displayName || metric.name}</DialogTitle>
        </DialogHeader>
        {/* Header with gradient background */}
        <div className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-background p-8 pb-6 border-b">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {metric.displayName || metric.name}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {metric.description}
              </p>
            </div>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </div>

        {/* Content sections */}
        <div className="p-8 space-y-6">
          {/* Observable Sub-Metrics */}
          {metric.examples && metric.examples.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                <Radio className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-base">Observable Sub-Metrics</h3>
              </div>
              <ul className="space-y-2.5 pl-1">
                {metric.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-teal-600 dark:text-teal-400 mt-0.5 font-bold">•</span>
                    <span className="text-muted-foreground leading-relaxed">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Roll-Up Rule */}
          {metric.whyItMatters && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-base">Roll-Up Rule</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                {metric.whyItMatters}
              </p>
            </div>
          )}

          {/* What It Measures */}
          {metric.whatItMeasures && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-base">What It Measures</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                {metric.whatItMeasures}
              </p>
            </div>
          )}

          {/* Coaching Insights */}
          {improvementTips.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                <Lightbulb className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-base">Coaching Insights</h3>
              </div>
              <div className="space-y-2.5">
                {improvementTips.map((tip, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground leading-relaxed">{typeof tip === "string" ? tip : tip.description || tip.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground italic text-center">
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
