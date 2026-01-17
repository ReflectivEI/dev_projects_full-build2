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
} from "@/lib/data";
import { SignalIntelligencePanel, type ObservableSignal } from "@/components/signal-intelligence-panel";
import { RoleplayFeedbackDialog } from "@/components/roleplay-feedback-dialog";
import type { Scenario } from "@shared/schema";
import { scoreConversation, type MetricResult, type Transcript } from "@/lib/signal-intelligence/scoring";

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
  const [showAllScenarios, setShowAllScenarios] = useState(false);

  const [sessionSignals, setSessionSignals] = useState<SignalIntelligenceCapability[]>([]);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackScenarioTitle, setFeedbackScenarioTitle] = useState("");
  const [metricResults, setMetricResults] = useState<MetricResult[]>([]);
  const [feedbackData, setFeedbackData] = useState<ComprehensiveFeedback | null>(null);
  const [roleplayEndError, setRoleplayEndError] = useState<string | null>(null);

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
    if (showAllScenarios || !selectedDiseaseState) return scenarios;
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
    onSuccess: (data) => {
      const newSignals = extractSignals(data);
      if (newSignals.length) {
        setSessionSignals((prev) =>
          dedupeByStableKey(cap50([...prev, ...newSignals]))
        );
      }
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    },
  });

  const endScenarioMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/roleplay/end");
      if (!res.ok) throw new Error("end_failed");
      return res.json();
    },
    onSuccess: (data) => {
      // Execute scoring on transcript
      const transcript: Transcript = messages.map((msg) => ({
        speaker: msg.role === 'user' ? 'rep' : 'customer',
        text: msg.content,
      }));
      const scoredMetrics = scoreConversation(transcript);
      setMetricResults(scoredMetrics);

      const feedback = mapToComprehensiveFeedback(data, scoredMetrics);
      setFeedbackScenarioTitle(
        data?.scenario?.title || selectedScenario?.title || "Role-Play Session"
      );
      setFeedbackData(feedback);
      setShowFeedbackDialog(true);
      setRoleplayEndError(null);
    },
    onError: () => setRoleplayEndError("Unable to end role-play."),
  });

  const handleReset = () => {
    setSelectedScenario(null);
    setSelectedDiseaseState("");
    setSelectedSpecialty("");
    setSessionSignals([]);
    setFeedbackData(null);
    setMetricResults([]);
    setShowFeedbackDialog(false);
    endCalledForSessionRef.current.clear();
    queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
  };

  /* -----------------------------
     Render
  ------------------------------ */

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
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
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Select a Scenario</CardTitle>
              <CardDescription>Choose a structured practice scenario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedScenario?.id ?? ""}
                onValueChange={(v) =>
                  setSelectedScenario(filteredScenarios.find((s) => s.id === v) ?? null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a scenario…" />
                </SelectTrigger>
                <SelectContent>
                  {filteredScenarios.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedScenario && (
                <Button
                  onClick={() => startScenarioMutation.mutate(selectedScenario)}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Role-Play
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((m) => (
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
                    </div>
                  </div>
                ))}
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
                <Button onClick={() => sendResponseMutation.mutate(input)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => endScenarioMutation.mutate()}
              >
                End Role-Play & Review
              </Button>

              {roleplayEndError && (
                <div className="text-sm text-destructive">{roleplayEndError}</div>
              )}
            </div>
          </div>

          <Card className="w-80 hidden xl:flex flex-col">
            <CardContent className="flex-1 pt-6">
              <SignalIntelligencePanel
                signals={sessionSignals}
                hasActivity={sessionSignals.length > 0}
                isLoading={sendResponseMutation.isPending}
                compact
                metricResults={metricResults}
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
      />
    </div>
  );
}
