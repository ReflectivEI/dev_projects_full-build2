import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  TrendingUp,
  Target,
  MessageSquareQuote,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { eqMetrics } from "@/lib/data";
import { readEnabledEIMetricIds, EI_METRICS_SETTINGS_EVENT } from "@/lib/eiMetricSettings";
import { getCuesForMetric, type CueMetricMapping } from "@/lib/observable-cue-to-metric-map";
import { CueBadge } from "@/components/CueBadge";
import type { ObservableCue } from "@/lib/observable-cues";
import type { MetricResult } from "@/lib/signal-intelligence/scoring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComprehensiveFeedback {
  overallScore: number;
  performanceLevel: "exceptional" | "strong" | "developing" | "emerging" | "needs-focus";
  eqScores: Array<{
    metricId: string;
    score: number;
    feedback: string;
    observedBehaviors?: number;
    totalOpportunities?: number;
    calculationNote?: string;
  }>;
  salesSkillScores: Array<{
    skillId: string;
    skillName: string;
    score: number;
    feedback: string;
    observedBehaviors?: number;
    totalOpportunities?: number;
    calculationNote?: string;
  }>;
  topStrengths: string[];
  priorityImprovements: string[];
  specificExamples: Array<{ quote: string; analysis: string; isPositive: boolean }>;
  nextSteps: string[];
  overallSummary: string;
}

interface RoleplayFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: ComprehensiveFeedback | null;
  scenarioTitle?: string;
  onStartNew?: () => void;
  detectedCues?: ObservableCue[];
  metricResults?: MetricResult[];
}

function getPerformanceBadgeColor(level: string): string {
  switch (level) {
    case "exceptional":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "strong":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "developing":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    case "emerging":
      return "bg-orange-500/10 text-orange-600 border-orange-500/30";
    case "needs-focus":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getScoreColor(score: number): string {
  if (score >= 4) return "text-green-500";
  if (score >= 3) return "text-yellow-500";
  if (score >= 2) return "text-orange-500";
  return "text-red-500";
}

function getProgressColor(score: number): string {
  if (score >= 4) return "bg-green-500";
  if (score >= 3) return "bg-yellow-500";
  if (score >= 2) return "bg-orange-500";
  return "bg-red-500";
}

function normalizeToFive(score?: unknown): number {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  if (score <= 5) {
    const clamped = Math.min(Math.max(score, 0), 5);
    return Math.round(clamped * 10) / 10;
  }
  const clamped = Math.min(Math.max(score, 0), 100);
  return Math.round(((clamped / 100) * 5) * 10) / 10;
}

function ScoreRing({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const percentage = (safeScore / 5) * 100;

  // SVG arc math (use explicit numeric radius to avoid % edge cases)
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const dimensions = size === "lg" ? "w-32 h-32" : "w-20 h-20";
  const textSize = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className={`relative ${dimensions}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={getScoreColor(safeScore)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`${textSize} font-bold ${getScoreColor(safeScore)}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          {safeScore.toFixed(1)}
        </motion.span>
        <span className="text-xs text-muted-foreground">out of 5</span>
      </div>
    </div>
  );
}

const metricDefinitions: Record<string, { definition: string; formula: string }> = {
  empathy: {
    definition: "Recognizing and appreciating how the HCP feels",
    formula: "(Empathetic responses / Total HCP concerns) × 100",
  },
  clarity: {
    definition: "Expressing clinical data and value propositions clearly",
    formula: "(Clear messages / Total informational statements) × 100",
  },
  compliance: {
    definition: "Staying on-label and maintaining fair balance",
    formula: "(On-label statements / Total claims made) × 100",
  },
  discovery: {
    definition: "Asking insightful questions to uncover needs",
    formula: "(Quality discovery questions / Opportunities to probe) × 100",
  },
  "objection-handling": {
    definition: "Acknowledging and reframing concerns constructively",
    formula: "(Effectively handled objections / Total objections raised) × 100",
  },
  confidence: {
    definition: "Self-assurance in presenting data while remaining open",
    formula: "Scored 1-5 based on directness, clarity, and composure",
  },
  "active-listening": {
    definition: "Paraphrasing and responding to what was actually said",
    formula: "(Active listening behaviors / Total exchanges) × 100",
  },
  adaptability: {
    definition: "Flexibility in adjusting approach based on cues",
    formula: "(Successful pivots / Detected cue changes) × 100",
  },
  "action-insight": {
    definition: "Translating discussion into concrete next steps",
    formula: "(Relevant next steps proposed / Conversation conclusions) × 100",
  },
  resilience: {
    definition: "Maintaining composure when facing pushback",
    formula: "(Professional recovery instances / Challenging moments) × 100",
  },
  opening: {
    definition: "Establishing credibility and capturing attention",
    formula: "Scored 1-5 based on impact and engagement",
  },
  "needs-assessment": {
    definition: "Thoroughly understanding the HCP's situation",
    formula: "(Need areas explored / Potential need areas) × 100",
  },
  "value-articulation": {
    definition: "Clearly communicating product/solution value",
    formula: "(Compelling value statements / Total value statements) × 100",
  },
  "evidence-based": {
    definition: "Using clinical data effectively",
    formula: "(Relevant data citations / Opportunities to cite) × 100",
  },
  closing: {
    definition: "Seeking commitment or next steps",
    formula: "(Successful closes / Close opportunities) × 100",
  },
};

function MetricScoreCard({
  name,
  score,
  feedback,
  metricId,
  observedBehaviors,
  totalOpportunities,
  calculationNote,
  icon: Icon,
  detectedCues,
  metricResult,
}: {
  name: string;
  score: number | null;
  feedback: string;
  metricId?: string;
  observedBehaviors?: number;
  totalOpportunities?: number;
  calculationNote?: string;
  icon?: any;
  detectedCues?: ObservableCue[];
  metricResult?: MetricResult;
}) {
  const [expanded, setExpanded] = useState(false);

  const metricFromRubric = metricId ? eqMetrics.find((m) => m.id === metricId) : undefined;
  const metricInfo = metricId ? metricDefinitions[metricId] : undefined;

  const definitionText = metricFromRubric?.description ?? metricInfo?.definition;
  const scoringText = metricFromRubric?.calculation ?? metricInfo?.formula;

  const observableIndicators = Array.isArray(metricFromRubric?.sampleIndicators)
    ? metricFromRubric!.sampleIndicators
    : [];

  const keyTipText = typeof metricFromRubric?.keyTip === "string" ? metricFromRubric.keyTip : undefined;

  const percentage =
    totalOpportunities && totalOpportunities > 0
      ? Math.round((((observedBehaviors ?? 0) / totalOpportunities) * 100) * 10) / 10
      : null;

  // IMPLEMENTATION MODE: Handle null scores (not yet scored)
  const safeScore = score !== null && Number.isFinite(score) ? score : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-3 hover-elevate cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {safeScore !== null ? (
            <span className={`font-bold ${getScoreColor(safeScore)}`}>{safeScore.toFixed(1)}/5</span>
          ) : (
            <span className="font-bold text-muted-foreground">—</span>
          )}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
      </div>

      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`absolute left-0 top-0 h-full rounded-full ${safeScore !== null ? getProgressColor(safeScore) : 'bg-muted'}`}
          initial={{ width: 0 }}
          animate={{ width: safeScore !== null ? `${(safeScore / 5) * 100}%` : '0%' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t space-y-3"
          >
            {metricResult && metricResult.components && metricResult.components.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-primary">How this score was derived</span>
                <p className="text-xs text-muted-foreground">
                  {safeScore === 3.0 && metricResult.components.filter(c => c.applicable).length === 0
                    ? "Limited observable data resulted in a neutral baseline score."
                    : "This score reflects how consistently observable behaviors aligned with this metric during the conversation."}
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold">Component</TableHead>
                        <TableHead className="text-xs font-semibold text-center w-20">Weight</TableHead>
                        <TableHead className="text-xs font-semibold text-center w-20">Score</TableHead>
                        <TableHead className="text-xs font-semibold">Evidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metricResult.components.map((component, idx) => {
                        const evidenceItems = component.rationale ? [component.rationale] : [];
                        const displayEvidence = evidenceItems.slice(0, 3);
                        const hasMore = evidenceItems.length > 3;
                        
                        // Determine performance level
                        const componentScore = component.score ?? 0;
                        const performanceBadge = componentScore <= 2.5 
                          ? { label: "Needs Attention", color: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400", icon: "🔴" }
                          : componentScore >= 4.0
                          ? { label: "Strength", color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400", icon: "🟢" }
                          : null;
                        
                        return (
                          <TableRow key={idx} className={!component.applicable ? "opacity-50" : ""}>
                            <TableCell className="text-xs font-medium">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {component.name}
                                  {!component.applicable && (
                                    <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0">N/A</Badge>
                                  )}
                                  {performanceBadge && component.applicable && (
                                    <Badge className={`text-[10px] px-1.5 py-0 ${performanceBadge.color} border-0`}>
                                      {performanceBadge.icon} {performanceBadge.label}
                                    </Badge>
                                  )}
                                </div>
                                {component.applicable && component.rationale && (
                                  <p className="text-[10px] text-muted-foreground italic">
                                    This score was influenced by: {component.rationale.split('.')[0]}.
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-center">
                              {Math.round(component.weight * 100)}%
                            </TableCell>
                            <TableCell className="text-xs text-center font-medium">
                              {component.score !== null ? `${component.score.toFixed(1)} / 5` : "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {displayEvidence.length > 0 ? (
                                <div className="space-y-1">
                                  {displayEvidence.map((evidence, eIdx) => (
                                    <div key={eIdx} className="flex items-start gap-1.5">
                                      <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                                      <span className="text-muted-foreground">{evidence}</span>
                                    </div>
                                  ))}
                                  {hasMore && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button className="text-primary hover:underline text-[10px]">
                                            +{evidenceItems.length - 3} more
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                          <div className="space-y-1">
                                            {evidenceItems.slice(3).map((evidence, eIdx) => (
                                              <div key={eIdx} className="text-xs">
                                                • {evidence}
                                              </div>
                                            ))}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">No observable evidence detected in this session.</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {(definitionText || scoringText) && (
              <div className="space-y-2">
                {definitionText && (
                  <div>
                    <span className="text-xs font-semibold text-primary">Definition</span>
                    <p className="text-xs text-muted-foreground">{definitionText}</p>
                  </div>
                )}
                {scoringText && (
                  <div>
                    <span className="text-xs font-semibold text-primary">Scoring Method</span>
                    <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {scoringText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(observedBehaviors !== undefined &&
              totalOpportunities !== undefined &&
              totalOpportunities > 0) && (
              <div className="bg-muted/50 rounded-lg p-2 space-y-2">
                <div>
                  <span className="text-xs font-semibold text-primary">Signal Capture Rate</span>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>Signals captured:</span>
                    <span className="font-medium text-foreground">{observedBehaviors}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total observable signals:</span>
                    <span className="font-medium text-foreground">{totalOpportunities}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-medium">Capture rate:</span>
                    {percentage !== null ? (
                      <Badge variant="outline" className="text-xs">
                        {percentage}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                {calculationNote && <p className="text-xs text-muted-foreground">{calculationNote}</p>}
              </div>
            )}

            {(metricId &&
              (observedBehaviors === undefined ||
                totalOpportunities === undefined ||
                totalOpportunities === 0)) && (
              <div className="bg-muted/50 rounded-lg p-2">
                <span className="text-xs font-semibold text-primary">Signal Capture Rate</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Session-specific capture counts were not provided for this metric.
                </p>
              </div>
            )}

            {calculationNote && observedBehaviors === undefined && (
              <div className="bg-muted/50 rounded-lg p-2">
                <span className="text-xs font-semibold text-primary">Score Basis</span>
                <p className="text-xs text-muted-foreground mt-1">{calculationNote}</p>
              </div>
            )}

            {observableIndicators.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-primary">Observable Indicators</span>
                <ul className="mt-2 space-y-1.5">
                  {observableIndicators.map((indicator: string, idx: number) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {keyTipText && (
              <div className="bg-primary/5 p-2 rounded-lg border border-primary/20">
                <span className="text-xs font-semibold text-primary">Key Tip</span>
                <p className="text-xs text-muted-foreground italic mt-1">{keyTipText}</p>
              </div>
            )}

            {metricId && detectedCues && detectedCues.length > 0 && (() => {
              const relevantMappings = getCuesForMetric(metricId as any);
              const relevantCues = detectedCues.filter(cue => 
                relevantMappings.some(m => m.cueType === cue.type)
              );
              
              if (relevantCues.length === 0) return null;
              
              return (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-primary">Observed Evidence During Role Play</span>
                  <div className="space-y-2">
                    {relevantCues.map((cue, idx) => {
                      const mapping = relevantMappings.find(m => m.cueType === cue.type);
                      return (
                        <div key={idx} className="bg-muted/30 rounded-lg p-2 space-y-1">
                          <CueBadge cue={cue} size="sm" />
                          {mapping && (
                            <p className="text-xs text-muted-foreground">{mapping.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {metricId && (!detectedCues || detectedCues.length === 0 || (() => {
              const relevantMappings = getCuesForMetric(metricId as any);
              const relevantCues = (detectedCues || []).filter(cue => 
                relevantMappings.some(m => m.cueType === cue.type)
              );
              return relevantCues.length === 0;
            })()) && (
              <div className="bg-muted/30 rounded-lg p-2">
                <span className="text-xs font-semibold text-primary">Observed Evidence During Role Play</span>
                <p className="text-xs text-muted-foreground mt-1">No observable cues detected for this metric</p>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-primary">Feedback</span>
              <p className="text-xs text-muted-foreground">{feedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RoleplayFeedbackDialog({
  open,
  onOpenChange,
  feedback,
  scenarioTitle,
  onStartNew,
  detectedCues,
  metricResults,
}: RoleplayFeedbackDialogProps) {
  if (!feedback) return null;

  const getMetricName = (metricId: string) => {
    const metric = eqMetrics.find((m) => m.id === metricId);
    return (
      metric?.name ||
      metricId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  const [enabledExtras, setEnabledExtras] = useState<string[]>(() => readEnabledEIMetricIds());

  useEffect(() => {
    const handler = () => setEnabledExtras(readEnabledEIMetricIds());
    window.addEventListener(EI_METRICS_SETTINGS_EVENT, handler);
    return () => window.removeEventListener(EI_METRICS_SETTINGS_EVENT, handler);
  }, []);

  const metricItems = useMemo(() => {
    console.log('[CRITICAL DEBUG - DIALOG] Props received:', {
      feedback,
      metricResults,
      metricResultsLength: metricResults?.length
    });
    
    const root: any = (feedback as any)?.analysis ?? (feedback as any);

    const detailedScores = Array.isArray(feedback.eqScores) ? feedback.eqScores : [];
    const byId = new Map(detailedScores.map((m) => [m.metricId, m] as const));

    const aggregateScore = normalizeToFive(root?.eqScore ?? feedback.overallScore);

    const coreMetricIds = eqMetrics.filter((m) => m.isCore).map((m) => m.id);
    const enabledSet = new Set(enabledExtras);
    const extraMetricIds = eqMetrics
      .filter((m) => !m.isCore)
      .map((m) => m.id)
      .filter((id) => enabledSet.has(id));

    const metricOrder = [...coreMetricIds, ...extraMetricIds];

    // IMPLEMENTATION MODE: Derive Signal Intelligence capability scores from Behavioral Metrics
    // Mapping: Signal Intelligence ID → Behavioral Metric IDs for averaging
    const deriveCapabilityScore = (capabilityId: string, metricResults: MetricResult[]): number | null => {
      const behavioralMetricMap: Record<string, string[]> = {
        'signal-awareness': ['question_quality', 'listening_responsiveness'],
        'signal-interpretation': ['value_framing', 'adaptability'],
        'making-it-matter': ['value_framing'],
        'customer-engagement-monitoring': ['customer_engagement_cues'],
        'objection-navigation': ['objection_handling'],
        'conversation-management': ['conversation_control_structure'],
        'adaptive-response': ['adaptability'],
        'commitment-generation': ['commitment_gaining'],
      };

      const metricIds = behavioralMetricMap[capabilityId];
      if (!metricIds) return null;

      const scores = metricIds
        .map(id => metricResults.find(mr => mr.id === id)?.overall_score)
        .filter((s): s is number => typeof s === 'number' && !isNaN(s));

      if (scores.length === 0) return null;

      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      return Math.max(0, Math.min(5, Math.round(avg * 10) / 10)); // Clamp [0,5], round to 1 decimal
    };

    const metricResultsMap = new Map(
      (metricResults || []).map(mr => [mr.id, mr])
    );
    
    console.log('[CRITICAL DEBUG - DIALOG] metricResultsMap:', metricResultsMap);

    const items: Array<{
      key: string;
      metricId?: string;
      name: string;
      score: number | null;
      feedbackText: string;
      observedBehaviors?: number;
      totalOpportunities?: number;
      calculationNote?: string;
      metricResult?: MetricResult;
    }> = [
      {
        key: "eq:aggregate",
        metricId: undefined,
        name: "Signal Intelligence Score (Aggregate)",
        score: aggregateScore,
        feedbackText: feedback.overallSummary || "Overall session summary.",
      },
      ...metricOrder.map((metricId) => {
        const detail = byId.get(metricId);
        
        // IMPLEMENTATION MODE: Derive score from Behavioral Metrics
        const derivedScore = deriveCapabilityScore(metricId, metricResults || []);
        const metricResult = metricResultsMap.get(metricId);
        
        // PROMPT #21: UI Metric Score Resolution (Display-Only)
        // Canonical priority order:
        // 1. metricResult.overall_score (Signal Intelligence)
        // 2. detail.score (legacy eqScores)
        // 3. fallback to 0 only if truly no data
        
        // DEBUG: Log metric resolution
        if (metricId === 'question_quality') {
          console.log('[PROMPT #21 DEBUG] Question Quality Resolution:', {
            metricId,
            metricResult,
            overall_score: metricResult?.overall_score,
            detail,
            detailScore: detail?.score,
          });
        }
        
        // IMPLEMENTATION MODE: Priority order for score resolution
        // 1. derivedScore (computed from Behavioral Metrics)
        // 2. metricResult.overall_score (if available)
        // 3. detail.score (legacy)
        // 4. null (not 0)
        const resolvedScore =
          derivedScore ??
          metricResult?.overall_score ??
          (typeof detail?.score === "number" ? detail.score : null);
        
        const displayScore = resolvedScore;
        
        // DEBUG: Log final display score
        if (metricId === 'question_quality') {
          console.log('[PROMPT #21 DEBUG] Final Display Score:', displayScore);
        }
        
        return {
          key: `eq:${metricId}`,
          metricId,
          name: getMetricName(metricId),
          score: displayScore,
          feedbackText:
            typeof detail?.feedback === "string" && detail.feedback.trim()
              ? detail.feedback
              : "Click to see the rubric definition, scoring method, observable indicators, and key coaching tip.",
          observedBehaviors: detail?.observedBehaviors,
          totalOpportunities: detail?.totalOpportunities,
          calculationNote: detail?.calculationNote,
          metricResult,
        };
      }),
    ];

    return items;
  }, [enabledExtras, feedback]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2" data-testid="text-feedback-title">
                <Award className="h-5 w-5 text-primary" />
                Role-Play Performance Analysis
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detailed feedback for your role-play session.
              </DialogDescription>
              {scenarioTitle && <p className="text-sm text-muted-foreground mt-1">{scenarioTitle}</p>}
            </div>

            <Badge
              variant="outline"
              className={`${getPerformanceBadgeColor(feedback.performanceLevel)} capitalize`}
              data-testid="badge-performance-level"
            >
              {feedback.performanceLevel.replace("-", " ")}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <ScoreRing score={normalizeToFive(feedback.overallScore)} />
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="font-semibold text-lg">Overall Assessment</h3>
                <p className="text-muted-foreground" data-testid="text-overall-summary">
                  {feedback.overallSummary}
                </p>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="eq" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="eq" className="flex items-center gap-2" data-testid="tab-eq-metrics">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Behavioral Metrics</span>
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center gap-2" data-testid="tab-sales-skills">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Sales Skills</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="flex items-center gap-2" data-testid="tab-examples">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span className="hidden sm:inline">Examples</span>
                </TabsTrigger>
                <TabsTrigger value="growth" className="flex items-center gap-2" data-testid="tab-growth">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Growth</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="eq" className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Layer 1 — Signal Intelligence:</strong> Demonstrated capabilities measured through observable behaviors. Click any metric to see definition, calculation, indicators, and session-specific breakdown.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metricItems.map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <MetricScoreCard
                        name={item.name}
                        score={item.score}
                        feedback={item.feedbackText}
                        metricId={item.metricId}
                        observedBehaviors={item.observedBehaviors}
                        totalOpportunities={item.totalOpportunities}
                        calculationNote={item.calculationNote}
                        icon={Brain}
                        detectedCues={detectedCues}
                        metricResult={item.metricResult}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sales" className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Traditional sales competency rubrics. Click any skill to see the session-specific breakdown (when provided).
                </p>

                {feedback.salesSkillScores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {feedback.salesSkillScores.map((skill, idx) => (
                      <motion.div
                        key={skill.skillId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <MetricScoreCard
                          name={skill.skillName}
                          score={normalizeToFive(skill.score)}
                          feedback={skill.feedback}
                          // NOTE: sales skills do not map to eqMetrics; pass metricId undefined to avoid incorrect rubric lookups
                          metricId={undefined}
                          observedBehaviors={skill.observedBehaviors}
                          totalOpportunities={skill.totalOpportunities}
                          calculationNote={skill.calculationNote}
                          icon={Briefcase}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Briefcase className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Sales skills assessment available for longer conversations</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="examples" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Specific moments from your conversation with analysis of what worked well or could improve.
                </p>

                {(() => {
                  const out: Array<{ quote: string; analysis: string; isPositive: boolean }> = [];

                  const seeded = Array.isArray(feedback.specificExamples) ? feedback.specificExamples : [];
                  for (const ex of seeded) {
                    if (!ex || typeof ex.quote !== "string" || typeof ex.analysis !== "string") continue;
                    out.push({
                      quote: ex.quote,
                      analysis: ex.analysis,
                      isPositive: Boolean(ex.isPositive),
                    });
                  }

                  if (out.length === 0) {
                    const strength =
                      Array.isArray(feedback.topStrengths) && feedback.topStrengths.length
                        ? String(feedback.topStrengths[0])
                        : "Maintained professional, constructive communication.";
                    const improvement =
                      Array.isArray(feedback.priorityImprovements) && feedback.priorityImprovements.length
                        ? String(feedback.priorityImprovements[0])
                        : "Add a discovery question before presenting your solution.";

                    out.push({ quote: strength, analysis: "What Worked", isPositive: true });
                    out.push({ quote: improvement, analysis: "What Could Improve", isPositive: false });
                  }

                  const hasWorked = out.some((x) => x.isPositive);
                  const hasImprove = out.some((x) => !x.isPositive);

                  if (!hasWorked || !hasImprove) {
                    return (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <MessageSquareQuote className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No specific examples were provided for this session.</p>
                      </div>
                    );
                  }

                  return (
                    <>
                      {out.map((example, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                        >
                          <Card className={example.isPositive ? "border-green-500/30" : "border-orange-500/30"}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-1.5 rounded-full ${
                                    example.isPositive ? "bg-green-500/10" : "bg-orange-500/10"
                                  }`}
                                >
                                  {example.isPositive ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                  )}
                                </div>

                                <div className="flex-1 space-y-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      example.isPositive
                                        ? "border-green-500/30 text-green-600"
                                        : "border-orange-500/30 text-orange-600"
                                    }
                                  >
                                    {example.isPositive ? "What Worked" : "What Could Improve"}
                                  </Badge>

                                  <blockquote className="text-sm italic border-l-2 border-muted-foreground/30 pl-3">
                                    "{example.quote}"
                                  </blockquote>

                                  {example.analysis && (
                                    <p className="text-sm text-muted-foreground">{example.analysis}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </>
                  );
                })()}
              </TabsContent>

              <TabsContent value="growth" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Top Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {(feedback.topStrengths ?? []).map((strength, idx) => (
                          <li key={idx} className="text-sm">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-2"
                            >
                              <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </motion.div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        Priority Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {(feedback.priorityImprovements ?? []).map((improvement, idx) => (
                          <li key={idx} className="text-sm">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-2"
                            >
                              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span>{improvement}</span>
                            </motion.div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      Recommended Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {(feedback.nextSteps ?? []).map((step, idx) => (
                        <li key={idx} className="text-sm">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/30 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-feedback">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>

          {onStartNew && (
            <Button onClick={onStartNew} data-testid="button-start-new-scenario">
              Start New Scenario
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
