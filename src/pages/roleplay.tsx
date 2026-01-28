/* =========================================================
   ROLEPLAY.TSX — FULL DROP-IN REPLACEMENT (DEPLOY-SAFE)
   Signal Intelligence only (no emotional intelligence scoring)
   ========================================================= */

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Play, Send, RotateCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  scenarios,
  diseaseStates,
  specialtiesByDiseaseState,
  allSpecialties,
  hcpCategories,
  influenceDrivers,
} from "@/lib/data";
import { SignalIntelligencePanel, type SignalIntelligenceCapability } from "@/components/signal-intelligence-panel";
import { RoleplayFeedbackDialog } from "@/components/roleplay-feedback-dialog";
import type { Scenario } from "@shared/schema";
import { scoreConversation, type MetricResult, type Transcript } from "@/lib/signal-intelligence/scoring";
import { 
  detectObservableCues, 
  detectRepMetrics,
  generateCueDescription,
  generateRepFeedback,
  type ObservableCue,
  type RepMetricCue 
} from "@/lib/observable-cues";
import { generateHCPBehavioralDescription, formatBehavioralDescriptionForUI } from "@/lib/hcp-behavioral-state";
import { evaluateRepResponse } from "@/lib/rep-response-evaluator";
import { InlineRepMetricEvaluation } from "@/components/rep-metric-evaluation";
import { CueBadgeGroup } from "@/components/CueBadge";
import { Eye, EyeOff } from "lucide-react";

/* -----------------------------
   Types
------------------------------ */

type RoleplayMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface SessionPayload {
  session: any | null;
  messages: RoleplayMessage[];
  signals: SignalIntelligenceCapability[];
}

/**
 * IMPORTANT:
 * RoleplayFeedbackDialog expects the *full* ComprehensiveFeedback shape.
 * We therefore normalize into that exact structure with safe defaults.
 */
interface ComprehensiveFeedback {
  overallScore: number;
  performanceLevel: "exceptional" | "strong" | "developing" | "emerging" | "needs-focus";
  eqScores: any[];
  salesSkillScores: any[];
  topStrengths: string[];
  priorityImprovements: string[];
  specificExamples: Array<{ quote: string; analysis: string; isPositive: boolean }>;
  nextSteps: string[];
  overallSummary: string;
}

/* -----------------------------
   Helpers
------------------------------ */

function cap50<T>(items: T[]): T[] {
  return Array.isArray(items) ? items.slice(-50) : [];
}

function stableSignalKey(signal: any): string {
  return `${signal?.type ?? ""}|${signal?.timestamp ?? ""}|${signal?.evidence ?? signal?.signal ?? ""}`;
}

function dedupeByStableKey<T>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = stableSignalKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function extractSignals(payload: any): SignalIntelligenceCapability[] {
  const s = payload?.signals ?? payload?.session?.signals;
  return Array.isArray(s) ? s : [];
}

function mapWorkerMessages(
  messages?: Array<{ id?: string; role?: string; content?: string }>
): RoleplayMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages.map((m, i) => ({
    id: String(m?.id ?? `msg-${i}`),
    role: m?.role === "user" ? "user" : "assistant",
    content: m?.content ?? "",
  }));
}

/**
 * CRITICAL NORMALIZER
 * Guarantees RoleplayFeedbackDialog will not crash.
 */
function mapToComprehensiveFeedback(raw: any, metricResults?: MetricResult[]): ComprehensiveFeedback {
  const root = raw?.analysis ?? raw ?? {};

  // Compute aggregate score from MetricResult[]
  let computedOverallScore = 3;
  if (metricResults && metricResults.length > 0) {
    const applicableScores = metricResults
      .filter(m => !m.not_applicable && m.overall_score !== null)
      .map(m => m.overall_score!);
    if (applicableScores.length > 0) {
      const sum = applicableScores.reduce((acc, s) => acc + s, 0);
      computedOverallScore = Math.round((sum / applicableScores.length) * 10) / 10;
    }
  }

  // Map MetricResult[] to eqScores format
  const eqScores = metricResults && metricResults.length > 0
    ? metricResults.map(m => ({
        metricId: m.id,
        score: m.overall_score ?? 3,
        feedback: '',
        observedBehaviors: undefined,
        totalOpportunities: undefined,
        calculationNote: m.not_applicable ? 'Not applicable to this conversation' : undefined,
      }))
    : (Array.isArray(root.eqScores) ? root.eqScores : []);

  return {
    overallScore: metricResults && metricResults.length > 0 ? computedOverallScore : (typeof root.overallScore === "number" ? root.overallScore : 3),
    performanceLevel:
      root.performanceLevel ??
      "developing",

    eqScores,
    salesSkillScores: Array.isArray(root.salesSkillScores) ? root.salesSkillScores : [],

    topStrengths:
      Array.isArray(root.topStrengths) && root.topStrengths.length
        ? root.topStrengths.map(String)
        : ["Maintained professional, compliant communication"],

    priorityImprovements:
      Array.isArray(root.priorityImprovements) && root.priorityImprovements.length
        ? root.priorityImprovements.map(String)
        : ["Add a clarifying question before presenting data"],

    specificExamples:
      Array.isArray(root.specificExamples) && root.specificExamples.length
        ? root.specificExamples.map((e: any) => ({
            quote: String(e.quote ?? ""),
            analysis: String(e.analysis ?? ""),
            isPositive: Boolean(e.isPositive),
          }))
        : [],

    nextSteps:
      Array.isArray(root.nextSteps) && root.nextSteps.length
        ? root.nextSteps.map(String)
        : ["Practice reflecting constraints before proposing next steps"],

    overallSummary:
      String(
        root.overallSummary ??
          root.summary ??
          "Session complete. Review your observable signals and options."
      ),
  };
}

/* -----------------------------
   Constants
------------------------------ */

const difficultyColors: Record<string, string> = {
  beginner: "bg-chart-4 text-white",
  intermediate: "bg-chart-2 text-white",
  advanced: "bg-destructive text-destructive-foreground",
};

const diseaseToCategories: Record<string, string[]> = {
  hiv: ["hiv"],
  oncology: ["oncology"],
  cardiology: ["cardiology"],
  neurology: ["neurology"],
  vaccines: ["vaccines", "covid"],
  "general-medicine": ["hiv", "oncology", "cardiology", "vaccines", "neurology"],
};

/* =========================================================
   Page
   ========================================================= */

export default function RolePlayPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState("");

  const [selectedDiseaseState, setSelectedDiseaseState] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedHcpCategory, setSelectedHcpCategory] = useState("");
  const [selectedInfluenceDriver, setSelectedInfluenceDriver] = useState("");

  const [sessionSignals, setSessionSignals] = useState<SignalIntelligenceCapability[]>([]);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackScenarioTitle, setFeedbackScenarioTitle] = useState("");
  const [metricResults, setMetricResults] = useState<MetricResult[]>([]);
  const [feedbackData, setFeedbackData] = useState<ComprehensiveFeedback | null>(null);
  const [roleplayEndError, setRoleplayEndError] = useState<string | null>(null);
  const [showCues, setShowCues] = useState(true);
  const [allDetectedCues, setAllDetectedCues] = useState<ObservableCue[]>([]);

  const queryClient = useQueryClient();
  const endCalledForSessionRef = useRef<Set<string>>(new Set());

  const availableSpecialties = selectedDiseaseState
    ? specialtiesByDiseaseState[selectedDiseaseState] || allSpecialties
    : allSpecialties;

  useEffect(() => {
    if (selectedSpecialty && !availableSpecialties.includes(selectedSpecialty)) {
      setSelectedSpecialty("");
    }
  }, [selectedSpecialty, availableSpecialties]);

  const filteredScenarios = (() => {
    if (!selectedDiseaseState) return scenarios;
    const cats = diseaseToCategories[selectedDiseaseState];
    if (!cats) return scenarios;
    return scenarios.filter((s) => cats.includes(s.category));
  })();

  const { data: roleplayData } = useQuery<SessionPayload>({
    queryKey: ["/api/roleplay/session"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/roleplay/session");
      const json = await res.json();
      return {
        session: json?.session ?? null,
        messages: mapWorkerMessages(json?.session?.messages),
        signals: extractSignals(json),
      };
    },
    staleTime: 5000,
  });

  const messages = roleplayData?.messages ?? [];
  const isActive = messages.length > 0;

  useEffect(() => {
    if (roleplayData?.signals?.length) {
      setSessionSignals((prev) =>
        dedupeByStableKey(cap50([...prev, ...roleplayData.signals]))
      );
    }
  }, [roleplayData?.signals]);

  const startScenarioMutation = useMutation({
    mutationFn: async (scenario: Scenario) => {
      const res = await apiRequest("POST", "/api/roleplay/start", {
        scenarioId: scenario.id,
        scenario,
        context: { diseaseState: selectedDiseaseState, specialty: selectedSpecialty },
      });
      return res.json();
    },
    onSuccess: () => {
      setSessionSignals([]);
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    },
  });

  const sendResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/roleplay/respond", { message: content });
      return res.json();
    },
    onSuccess: async (data) => {
      const newSignals = extractSignals(data);
      if (newSignals.length) {
        setSessionSignals((prev) =>
          dedupeByStableKey(cap50([...prev, ...newSignals]))
        );
      }
      
      // PROMPT #23: Invalidate and wait for refetch before scoring
      await queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
      await queryClient.refetchQueries({ queryKey: ["/api/roleplay/session"] });

      // PROMPT #23: Get fresh messages after refetch
      const freshData = queryClient.getQueryData<SessionPayload>(["/api/roleplay/session"]);
      const currentMessages = freshData?.messages ?? [];
      
      console.log('[LIVE SCORING DEBUG] Current messages count:', currentMessages.length);
      
      if (currentMessages.length >= 2) { // Need at least 1 exchange to score
        const transcript: Transcript = currentMessages.map((msg) => ({
          speaker: msg.role === 'user' ? 'rep' : 'customer',
          text: msg.content,
        }));
        const liveScores = scoreConversation(transcript);
        setMetricResults(liveScores);
        console.log('[LIVE SCORING] Updated metrics during conversation:', liveScores.length);
        console.log('[LIVE SCORING] Scores:', liveScores.map(m => ({ id: m.id, score: m.overall_score, notApplicable: m.not_applicable })));
      }
    },
  });

  // Handler for sending messages (clears input after send)
  const handleSendMessage = () => {
    if (!input.trim() || sendResponseMutation.isPending) return;
    sendResponseMutation.mutate(input.trim());
    setInput("");
  };

  const endScenarioMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/roleplay/end");
      if (!res.ok) throw new Error("end_failed");
      return res.json();
    },
    onSuccess: async (data) => {
      // PROMPT #24: Wait for final refetch before scoring (same pattern as sendResponse)
      await queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
      await queryClient.refetchQueries({ queryKey: ["/api/roleplay/session"] });
      
      // Get fresh messages after refetch
      const freshData = queryClient.getQueryData<SessionPayload>(["/api/roleplay/session"]);
      const finalMessages = freshData?.messages ?? [];
      
      console.log('[END SESSION DEBUG] Final messages count:', finalMessages.length);
      
      // PROMPT #21: Worker Response Contract Adapter
      // Cloudflare Worker returns: { coach: { metricResults: {...}, overall: N } }
      // Node/Express returns: { analysis: { eqMetrics: {...}, overallScore: N } }
      // Normalize to the expected contract before processing
      console.log('[WORKER ADAPTER] Raw response:', data);
      
      let normalizedData = data;
      if (data?.coach && !data?.analysis) {
        console.log('[WORKER ADAPTER] Detected Worker response, normalizing...');
        normalizedData = {
          ...data,
          analysis: {
            overallScore: data.coach.overall ?? 3,
            eqMetrics: data.coach.metricResults ?? {},
            strengths: data.coach.strengths ?? [],
            improvements: data.coach.improvements ?? [],
            recommendations: data.coach.recommendations ?? [],
          }
        };
        console.log('[WORKER ADAPTER] Normalized data:', normalizedData);
      }
      
      // PROMPT #21: Use Worker's metricResults instead of client-side scoring
      // Priority: Worker scores > Client-side fallback
      let scoredMetrics: MetricResult[];
      
      if (data?.coach?.metricResults && Array.isArray(data.coach.metricResults)) {
        console.log('[WORKER SCORES] Using Cloudflare Worker metricResults:', data.coach.metricResults);
        scoredMetrics = data.coach.metricResults;
      } else {
        // PROMPT #24: Use fresh messages for fallback scoring
        console.log('[FALLBACK] Worker metricResults not available, using client-side scoring');
        const transcript: Transcript = finalMessages.map((msg) => ({
          speaker: msg.role === 'user' ? 'rep' : 'customer',
          text: msg.content,
        }));
        scoredMetrics = scoreConversation(transcript);
      }
      
      console.log('[CRITICAL DEBUG] Scored Metrics:', scoredMetrics);
      console.log('[CRITICAL DEBUG] Scored Metrics length:', scoredMetrics.length);
      console.log('[CRITICAL DEBUG] Transcript length:', finalMessages.length);
      console.log('[CRITICAL DEBUG] Transcript:', finalMessages.map(m => ({ role: m.role, content: m.content.substring(0, 100) })));
      scoredMetrics.forEach(m => {
        console.log(`[CRITICAL DEBUG] Metric ${m.id}:`, {
          overall_score: m.overall_score,
          not_applicable: m.not_applicable,
          components: m.components.map(c => ({
            name: c.component,
            applicable: c.applicable,
            score: c.score,
            rationale: c.rationale
          }))
        });
      });
      
      // Additional diagnostic: Check if all scores are 3.0
      const allScoresAre3 = scoredMetrics.every(m => m.overall_score === 3.0 || m.overall_score === null);
      if (allScoresAre3) {
        console.error('[CRITICAL BUG] All scores are 3.0! This indicates scoring logic failure.');
        console.error('[CRITICAL BUG] Worker response:', data);
        console.error('[CRITICAL BUG] Fallback scoring used?', !data?.coach?.metricResults);
      }
      
      setMetricResults(scoredMetrics);

      // PROMPT #22: Save scores to localStorage for EI Metrics page
      const { saveRoleplayScores } = await import('@/lib/signal-intelligence/score-storage');
      
      // Canonical ID mapping: METRICS_SPEC IDs → Signal Intelligence capability IDs
      const ID_MAPPING: Record<string, string> = {
        'question_quality': 'signal-awareness',
        'listening_responsiveness': 'signal-interpretation',
        'making_it_matter': 'making-it-matter',
        'customer_engagement_signals': 'customer-engagement-monitoring',
        'conversation_control_structure': 'conversation-management',
        'adaptability': 'adaptive-response',
        'commitment_gaining': 'commitment-generation',
        'objection_navigation': 'objection-navigation'
      };
      
      const scoresMap: Record<string, number> = {};
      scoredMetrics.forEach(m => {
        const canonicalId = ID_MAPPING[m.id] || m.id;
        console.log(`[SCORE_STORAGE] Processing metric ${m.id} → ${canonicalId}:`, {
          overall_score: m.overall_score,
          not_applicable: m.not_applicable,
          willSave: m.overall_score !== null && !m.not_applicable
        });
        if (m.overall_score !== null && !m.not_applicable) {
          scoresMap[canonicalId] = m.overall_score;
        }
      });
      console.log('[SCORE_STORAGE] Scores to save:', scoresMap);
      console.log('[SCORE_STORAGE] Number of scores:', Object.keys(scoresMap).length);
      saveRoleplayScores(scoresMap);
      console.log('[SCORE_STORAGE] Saved to localStorage successfully');
      
      // Verify what was saved
      const savedData = localStorage.getItem('reflectivai-roleplay-scores');
      console.log('[SCORE_STORAGE] Verification - localStorage content:', savedData);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('[SCORE_STORAGE] Verification - parsed scores:', parsed.scores);
      }

      // PROMPT #24: Collect all detected cues from fresh messages
      const allCues: ObservableCue[] = [];
      finalMessages.forEach(msg => {
        if (msg.role === 'user') {
          const cues = detectObservableCues(msg.content, msg.role);
          allCues.push(...cues);
        }
      });
      setAllDetectedCues(allCues);

      const feedback = mapToComprehensiveFeedback(normalizedData, scoredMetrics);
      
      console.log('[CRITICAL DEBUG] Mapped Feedback:', feedback);
      console.log('[CRITICAL DEBUG] Feedback eqScores:', feedback.eqScores);
      
      setFeedbackScenarioTitle(
        data?.scenario?.title || selectedScenario?.title || "Role-Play Session"
      );
      setFeedbackData(feedback);
      setShowFeedbackDialog(true);
      setRoleplayEndError(null);
    },
    onError: () => setRoleplayEndError("Unable to end role-play."),
  });

  const handleReset = async () => {
    // Clear backend session first
    try {
      await apiRequest("POST", "/api/roleplay/end");
    } catch (error) {
      console.warn("Reset: Failed to end session on backend", error);
    }
    
    // Clear all local state
    setSelectedScenario(null);
    setSelectedDiseaseState("");
    setSelectedSpecialty("");
    setSelectedHcpCategory("");
    setSelectedInfluenceDriver("");
    setSessionSignals([]);
    setFeedbackData(null);
    setMetricResults([]);
    setAllDetectedCues([]);
    setShowFeedbackDialog(false);
    setInput("");
    endCalledForSessionRef.current.clear();
    
    // Force refetch to get empty session
    await queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    await queryClient.refetchQueries({ queryKey: ["/api/roleplay/session"] });
  };

  /* -----------------------------
     Render
  ------------------------------ */

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-chart-2 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Role-Play Simulator</h1>
            <p className="text-sm text-muted-foreground">
              Practice with Signal Intelligence feedback
            </p>
          </div>
        </div>
        {isActive && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {!isActive ? (
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filter Controls - Matching AI Coach Page */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedDiseaseState} onValueChange={setSelectedDiseaseState}>
                <SelectTrigger>
                  <SelectValue placeholder="Disease State" />
                </SelectTrigger>
                <SelectContent>
                  {diseaseStates.map((disease) => (
                    <SelectItem key={disease.id} value={disease.id}>
                      {disease.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedHcpCategory} onValueChange={setSelectedHcpCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="HCP Category" />
                </SelectTrigger>
                <SelectContent>
                  {hcpCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedInfluenceDriver} onValueChange={setSelectedInfluenceDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Influence Driver" />
                </SelectTrigger>
                <SelectContent>
                  {influenceDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scenario Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-base leading-tight">{scenario.title}</CardTitle>
                      {scenario.difficulty && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize shrink-0">
                          {scenario.difficulty}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Stakeholder</p>
                      <p className="text-sm">{scenario.stakeholder}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Objective</p>
                      <p className="text-sm line-clamp-2">{scenario.objective}</p>
                    </div>
                    {scenario.challenges && scenario.challenges.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Key Challenges</p>
                        <ul className="text-xs space-y-1">
                          {scenario.challenges.slice(0, 2).map((challenge, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span className="line-clamp-1">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button
                      className="w-full mt-auto"
                      size="sm"
                      onClick={() => startScenarioMutation.mutate(scenario)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Scenario
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredScenarios.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No scenarios match your filters. Try adjusting your selection.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((m, idx) => {
                  const cues = showCues ? detectObservableCues(m.content) : [];
                  
                  // Generate rich HCP behavioral description
                  const hcpBehavioralDesc = showCues && m.role === 'assistant' && cues.length > 0
                    ? generateHCPBehavioralDescription(cues, m.content)
                    : null;
                  
                  // For user messages, evaluate rep response
                  const prevHcpMessage = idx > 0 && messages[idx - 1].role === 'assistant' 
                    ? messages[idx - 1].content 
                    : undefined;
                  
                  // Build transcript for scoring
                  const transcript = messages.slice(0, idx + 1).map((msg) => ({
                    speaker: msg.role === 'user' ? 'rep' as const : 'customer' as const,
                    text: msg.content,
                  }));
                  
                  const repEvaluation = showCues && m.role === 'user'
                    ? evaluateRepResponse(m.content, prevHcpMessage, transcript)
                    : [];

                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-chart-2 text-white"
                        }`}
                      >
                        {m.role === "user" ? "You" : <Users className="h-4 w-4" />}
                      </div>
                      <div className="max-w-[80%]">
                        <div
                          className={`p-3 rounded-lg ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                        
                        {/* HCP Behavioral Cues Description */}
                        {cueDescription && (
                          <div className="mt-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                              Observable Behavior:
                            </p>
                            <p className="text-xs text-amber-800 dark:text-amber-200 italic">
                              {cueDescription}
                            </p>
                          </div>
                        )}

                        {/* Cue Badges */}
                        {cues.length > 0 && (
                          <div className="mt-2">
                            <CueBadgeGroup cues={cues} />
                          </div>
                        )}

                        {/* Rep Metrics Badges */}
                        {repMetrics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {repMetrics.map((metric) => (
                              <span
                                key={metric.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                              >
                                ✓ {metric.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Rep Performance Feedback */}
                        {repFeedback && (
                          <div className="mt-2 p-2 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                              Quick Feedback:
                            </p>
                            <div className="text-xs text-blue-800 dark:text-blue-200 whitespace-pre-line">
                              {repFeedback}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t space-y-2">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendResponseMutation.mutate(input);
                      setInput("");
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={sendResponseMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => endScenarioMutation.mutate()}
                >
                  End Role-Play & Review
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCues(!showCues)}
                  title={showCues ? "Hide observable cues" : "Show observable cues"}
                >
                  {showCues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>

              {roleplayEndError && (
                <div className="text-sm text-destructive">{roleplayEndError}</div>
              )}
            </div>
          </div>

          <Card className="w-full md:w-80 flex flex-col md:max-h-full max-h-96">
            <CardContent className="flex-1 pt-6">
              <SignalIntelligencePanel
                signals={sessionSignals}
                hasActivity={sessionSignals.length > 0}
                isLoading={sendResponseMutation.isPending}
                compact
                metricResults={metricResults}
                detectedCues={allDetectedCues}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <RoleplayFeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        feedback={feedbackData}
        scenarioTitle={feedbackScenarioTitle}
        onStartNew={handleReset}
        detectedCues={allDetectedCues}
        metricResults={metricResults}
      />
    </div>
  );
}
