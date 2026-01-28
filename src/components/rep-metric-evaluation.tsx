/**
 * Rep Metric Evaluation Component
 * Displays real-time evaluation of sales rep responses across 8 behavioral metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RepMetricScore {
  metricId: string;
  metricName: string;
  score: number | null; // 1-5 or null if not applicable
  detected: boolean; // Was this metric demonstrated in the response?
  rationale: string;
  category: 'question' | 'listening' | 'value' | 'engagement' | 'objection' | 'control' | 'commitment' | 'adaptability';
}

interface RepMetricEvaluationProps {
  metrics: RepMetricScore[];
  messageContent: string;
  compact?: boolean;
}

const METRIC_ICONS: Record<string, React.ReactNode> = {
  question: '❓',
  listening: '👂',
  value: '💎',
  engagement: '🤝',
  objection: '🛡️',
  control: '🎯',
  commitment: '✅',
  adaptability: '🔄',
};

const SCORE_COLORS: Record<number, { bg: string; text: string; icon: React.ReactNode }> = {
  5: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle className="h-4 w-4" /> },
  4: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: <TrendingUp className="h-4 w-4" /> },
  3: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <AlertCircle className="h-4 w-4" /> },
  2: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: <TrendingDown className="h-4 w-4" /> },
  1: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <XCircle className="h-4 w-4" /> },
};

function getScoreLabel(score: number | null): string {
  if (score === null) return 'N/A';
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Strong';
  if (score >= 2.5) return 'Adequate';
  if (score >= 1.5) return 'Developing';
  return 'Needs Focus';
}

function MetricScoreCard({ metric, compact }: { metric: RepMetricScore; compact?: boolean }) {
  const scoreConfig = metric.score !== null ? SCORE_COLORS[Math.round(metric.score)] : null;
  const icon = METRIC_ICONS[metric.category];

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <p className="text-sm font-medium">{metric.metricName}</p>
            {metric.detected && (
              <p className="text-xs text-muted-foreground line-clamp-1">{metric.rationale}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {metric.score !== null ? (
            <>
              <Badge variant="outline" className={cn('text-xs', scoreConfig?.bg, scoreConfig?.text)}>
                {metric.score.toFixed(1)}/5
              </Badge>
              {scoreConfig?.icon}
            </>
          ) : (
            <Badge variant="secondary" className="text-xs">Not Detected</Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('transition-all', metric.detected && 'ring-2 ring-primary/20')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <CardTitle className="text-base">{metric.metricName}</CardTitle>
          </div>
          {metric.score !== null && scoreConfig && (
            <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md', scoreConfig.bg, scoreConfig.text)}>
              {scoreConfig.icon}
              <span className="text-sm font-semibold">{metric.score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {metric.score !== null ? (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{getScoreLabel(metric.score)}</span>
                <span>{metric.score.toFixed(1)}/5.0</span>
              </div>
              <Progress value={(metric.score / 5) * 100} className="h-2" />
            </div>
            {metric.rationale && (
              <p className="text-sm text-muted-foreground">{metric.rationale}</p>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <Badge variant="secondary" className="text-xs">Not Demonstrated</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              This metric was not detected in your response
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RepMetricEvaluation({ metrics, messageContent, compact = false }: RepMetricEvaluationProps) {
  const detectedMetrics = metrics.filter((m) => m.detected && m.score !== null);
  const averageScore = detectedMetrics.length > 0
    ? detectedMetrics.reduce((sum, m) => sum + (m.score || 0), 0) / detectedMetrics.length
    : null;

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div>
          <h4 className="text-sm font-semibold">Response Evaluation</h4>
          <p className="text-xs text-muted-foreground">
            {detectedMetrics.length} of 8 metrics demonstrated
          </p>
        </div>
        {averageScore !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      {compact ? (
        <div className="space-y-0 border border-border rounded-lg p-3">
          {metrics.map((metric) => (
            <MetricScoreCard key={metric.metricId} metric={metric} compact />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <MetricScoreCard key={metric.metricId} metric={metric} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline compact version for conversation flow
 */
export function InlineRepMetricEvaluation({ metrics }: { metrics: RepMetricScore[] }) {
  const detectedMetrics = metrics.filter((m) => m.detected && m.score !== null);

  if (detectedMetrics.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {detectedMetrics.map((metric) => {
        const scoreConfig = metric.score !== null ? SCORE_COLORS[Math.round(metric.score)] : null;
        const icon = METRIC_ICONS[metric.category];

        return (
          <Badge
            key={metric.metricId}
            variant="outline"
            className={cn('text-xs', scoreConfig?.bg, scoreConfig?.text)}
            title={metric.rationale}
          >
            <span className="mr-1">{icon}</span>
            {metric.metricName}: {metric.score?.toFixed(1)}
          </Badge>
        );
      })}
    </div>
  );
}
