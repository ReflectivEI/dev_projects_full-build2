/* =========================================================
   ROLEPLAY.TSX — FULL DROP-IN REPLACEMENT (CORRECTED)
   Signal Intelligence only (no EI scoring)
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

/* -----------------------------
   Types (Signal-only, no EI)
------------------------------ */

type RoleplayMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface SessionPayload {
  session: any | null;
  messages: RoleplayMessage[];
  signals: ObservableSignal[];
}

/**
 * Minimal feedback shape to keep RoleplayFeedbackDialog happy without
 * over-assuming server schema. We map when possible; otherwise provide fallbacks.
 */
interface RoleplayFeedback {
  summary: string;
  strengths: string[];
  opportunities: string[];
  examples: Array<{ quote: string; analysis: string }>;
}

/* -----------------------------
   Helpers
------------------------------ */

function cap50<T>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return items.slice(-50);
}

function stableSignalKey(signal: any): string {
  const type = signal?.type ?? "";
  const timestamp = signal?.timestamp ?? "";
  const evidence = signal?.evidence ?? signal?.signal ?? "";
  return `${type}|${timestamp}|${evidence}`;
}

function dedupeByStableKey<T>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = stableSignalKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function extractSignals(payload: any): ObservableSignal[] {
  const signals = payload?.signals ?? payload?.session?.signals ?? [];
  return Array.isArray(signals) ? signals : [];
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

function mapToRoleplayFeedback(raw: any): RoleplayFeedback {
  const root = raw?.analysis ?? raw ?? {};

  // Best-effort extraction with safe fallbacks.
  const summary =
    String(
      root?.summary ??
        root?.overallSummary ??
        root?.reflection ??
        "Session complete. Review signals, strengths, and opportunities."
    ) || "Session complete.";

  const strengthsArr =
    (Array.isArray(root?.strengths) && root.strengths) ||
    (Array.isArray(root?.topStrengths) && root.topStrengths) ||
    [];

  const opportunitiesArr =
    (Array.isArray(root?.opportunities) && root.opportunities) ||
    (Array.isArray(root?.priorityImprovements) && root.priorityImprovements) ||
    (Array.isArray(root?.improvements) && root.improvements) ||
    [];

  const examplesArr =
    (Array.isArray(root?.examples) && root.examples) ||
    (Array.isArray(root?.specificExamples) && root.specificExamples) ||
    [];

  const strengths = strengthsArr.map((s: any) => String(s)).filter(Boolean);
  const opportunities = opportunitiesArr.map((s: any) => String(s)).filter(Boolean);

  const examples = examplesArr
    .map((ex: any) => ({
      quote: String(ex?.quote ?? ""),
      analysis: String(ex?.analysis ?? ex?.feedback ?? ""),
    }))
    .filter((x: any) => x.quote && x.analysis);

  // Defensive defaults to avoid empty UI
  const finalStrengths =
    strengths.length > 0
      ? strengths
      : [
          "Maintained professional communication throughout the session",
          "Engaged with the stakeholder and responded to prompts",
        ];

  const finalOpportunities =
    opportunities.length > 0
      ? opportunities
      : [
          "Ask 1–2 clarifying questions before presenting information",
          "Reflect back the stakeholder’s stated constraints before pivoting",
        ];

  return {
    summary,
    strengths: finalStrengths,
    opportunities: finalOpportunities,
    examples,
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
  prep: ["hiv"],
  oncology: ["oncology"],
  cardiology: ["cardiology"],
  neurology: ["neurology"],
  "infectious-disease": ["hiv", "vaccines", "covid"],
  endocrinology: ["cardiology"],
  respiratory: ["immunology"],
  hepatology: ["hiv", "immunology"],
  vaccines: ["vaccines", "covid"],
  "general-medicine": [
    "hiv",
    "oncology",
    "cardiology",
    "vaccines",
    "covid",
    "neurology",
    "immunology",
    "rare-disease",
  ],
};

const specialtyToCategories: Record<string, string[]> = {
  "Family Medicine": ["hiv", "cardiology", "vaccines", "covid"],
  "Infectious Diseases": ["hiv", "covid", "vaccines", "immunology"],
  "Hem/Onc": ["oncology"],
  "Medical Oncology": ["oncology"],
  "Surgical Oncology": ["oncology"],
  "Radiation Oncology": ["oncology"],
  Pediatrics: ["vaccines", "covid"],
  "Internal Medicine": ["cardiology", "covid", "hiv"],
  Hepatology: ["hiv", "immunology"],
  Gastroenterology: ["immunology"],
  Pulmonology: ["immunology"],
  Endocrinology: ["cardiology"],
  Neurology: ["neurology"],
  Cardiology: ["cardiology"],
  Psychiatry: ["neurology"],
  "Pain Medicine": ["neurology"],
  "Allergy/Immunology": ["immunology"],
};

/* =========================================================
   Page
   ========================================================= */

export default function RolePlayPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [input, setInput] = useState("");

  // 2-dropdown state (Disease + Specialty). Keep only what is actually rendered/used here.
  const [selectedDiseaseState, setSelectedDiseaseState] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const [showAllScenarios, setShowAllScenarios] = useState(false);

  // Session state (signals only)
  const [sessionSignals, setSessionSignals] = useState<ObservableSignal[]>([]);

  // Feedback dialog
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackScenarioTitle, setFeedbackScenarioTitle] = useState<string>("");
  const [feedbackData, setFeedbackData] = useState<RoleplayFeedback | null>(null);
  const [roleplayEndError, setRoleplayEndError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Derived label badges
  const selectedDisease = diseaseStates.find((d) => d.id === selectedDiseaseState);

  // Available specialties based on disease
  const availableSpecialties = selectedDiseaseState
    ? specialtiesByDiseaseState[selectedDiseaseState] || allSpecialties
    : allSpecialties;

  // Clear specialty if no longer valid
  useEffect(() => {
    if (selectedSpecialty && !availableSpecialties.includes(selectedSpecialty)) {
      setSelectedSpecialty("");
    }
  }, [selectedDiseaseState, availableSpecialties, selectedSpecialty]);

  // Filter scenarios
  const filteredScenarios = (() => {
    if (showAllScenarios || !selectedDiseaseState) return scenarios;

    const categories = diseaseToCategories[selectedDiseaseState];
    if (!categories) return scenarios;

    let filtered = scenarios.filter((s) => categories.includes(s.category));

    if (selectedSpecialty && specialtyToCategories[selectedSpecialty]) {
      const specialtyCategories = specialtyToCategories[selectedSpecialty];
      filtered = filtered.filter((s) => specialtyCategories.includes(s.category));
    }

    return filtered;
  })();

  const hasActiveFilters = Boolean(selectedDiseaseState) || Boolean(selectedSpecialty);
  const isFiltered = hasActiveFilters && !showAllScenarios && filteredScenarios.length !== scenarios.length;

  // Clear selected scenario if no longer in filtered list
  useEffect(() => {
    if (selectedScenario && !filteredScenarios.find((s) => s.id === selectedScenario.id)) {
      setSelectedScenario(null);
    }
  }, [filteredScenarios, selectedScenario]);

  // Roleplay context (send only what's available here)
  const roleplayContext = {
    diseaseState: selectedDiseaseState,
    specialty: selectedSpecialty,
  };

  const { data: roleplayData } = useQuery<SessionPayload>({
    queryKey: ["/api/roleplay/session"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/roleplay/session");
      const data = await response.json();

      const signals = extractSignals(data);
      return {
        session: data?.session ?? null,
        messages: mapWorkerMessages(data?.session?.messages),
        signals,
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  const messages = roleplayData?.messages || [];
  const isActive = messages.length > 0;

  // Hydrate sessionSignals from server on load/refresh
  useEffect(() => {
    const serverSignals = roleplayData?.signals;
    if (Array.isArray(serverSignals) && serverSignals.length > 0) {
      setSessionSignals((prev) => {
        // Merge (server + local) and dedupe
        const combined = [...prev, ...serverSignals];
        return dedupeByStableKey(cap50(combined));
      });
    }
  }, [roleplayData?.signals]);

  const roleplaySessionKey = isActive
    ? `${selectedScenario?.id ?? "unknown"}:${messages[0]?.id ?? "unknown"}`
    : null;

  const endCalledForSessionRef = useRef<Set<string>>(new Set());

  const startScenarioMutation = useMutation({
    mutationFn: async (scenario: Scenario) => {
      const response = await apiRequest("POST", "/api/roleplay/start", {
        scenarioId: scenario.id,
        difficulty: scenario.difficulty,
        scenario,
        context: roleplayContext,
      });
      return response.json();
    },
    onSuccess: () => {
      setSessionSignals([]);
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    },
  });

  const sendResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/roleplay/respond", { message: content });
      return response.json();
    },
    onSuccess: (data) => {
      const newSignals = extractSignals(data);
      if (newSignals.length > 0) {
        setSessionSignals((prev) => {
          const combined = [...prev, ...newSignals];
          return dedupeByStableKey(cap50(combined));
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    },
  });

  const endScenarioMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/roleplay/end");
      if (!response.ok) throw new Error("end_failed");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });

      const analysisRaw = data?.analysis ?? data;
      if (analysisRaw) {
        setFeedbackScenarioTitle(data?.scenario?.title || selectedScenario?.title || "Role-Play Session");
        setFeedbackData(mapToRoleplayFeedback(analysisRaw));
        setShowFeedbackDialog(true);
        setRoleplayEndError(null);
      } else {
        setRoleplayEndError("Unable to generate feedback.");
      }
    },
    onError: () => {
      setRoleplayEndError("Unable to end role-play.");
    },
  });

  const clearScenarioMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/roleplay/end");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
    },
  });

  const handleStart = () => {
    if (selectedScenario) startScenarioMutation.mutate(selectedScenario);
  };

  const handleSend = () => {
    if (!input.trim() || sendResponseMutation.isPending) return;
    sendResponseMutation.mutate(input);
    setInput("");
  };

  const handleReset = () => {
    if (isActive && roleplaySessionKey && !endCalledForSessionRef.current.has(roleplaySessionKey)) {
      endCalledForSessionRef.current.add(roleplaySessionKey);
      clearScenarioMutation.mutate();
    }

    setSelectedScenario(null);
    setSelectedDiseaseState("");
    setSelectedSpecialty("");
    setSessionSignals([]);
    setShowFeedbackDialog(false);
    setFeedbackData(null);
    setRoleplayEndError(null);
    queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-chart-2 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Role-Play Simulator</h1>
              <p className="text-sm text-muted-foreground">
                Practice pharma sales scenarios with Signal Intelligence feedback
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

        {!isActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Select value={selectedDiseaseState} onValueChange={setSelectedDiseaseState}>
              <SelectTrigger>
                <SelectValue placeholder="Disease State" />
              </SelectTrigger>
              <SelectContent>
                {diseaseStates.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecialties.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedDisease || selectedSpecialty) && (
              <div className="md:col-span-2 text-xs text-muted-foreground">
                {selectedDisease ? `Filtered by: ${selectedDisease.name}` : " "}
                {selectedSpecialty ? ` • ${selectedSpecialty}` : ""}
                {isFiltered ? ` • Showing ${filteredScenarios.length} scenarios` : ""}
              </div>
            )}

            {hasActiveFilters && (
              <div className="md:col-span-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllScenarios((v) => !v)}
                >
                  {showAllScenarios ? "Show Recommended" : "Show All"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {!isActive ? (
        <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Select a Scenario</CardTitle>
              <CardDescription>
                Choose a structured practice scenario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedScenario?.id || ""}
                onValueChange={(value) =>
                  setSelectedScenario(filteredScenarios.find((s) => s.id === value) || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={filteredScenarios.length > 0 ? "Choose a scenario..." : "No matching scenarios"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center gap-2">
                        <span>{scenario.title}</span>
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded ${difficultyColors[scenario.difficulty] ?? "bg-muted"}`}
                        >
                          {scenario.difficulty}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedScenario && (
                <Button
                  onClick={handleStart}
                  className="w-full"
                  disabled={startScenarioMutation.isPending}
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
          <div className="flex-1 flex flex-col min-w-0">
            {selectedScenario && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{selectedScenario.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedScenario.stakeholder}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[selectedScenario.difficulty] ?? "bg-muted"}`}>
                    {selectedScenario.difficulty}
                  </span>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-chart-2 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-xs font-medium">You</span>
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                      handleSend();
                    }
                  }}
                  placeholder="Your response…"
                  className="min-h-[60px] resize-none"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sendResponseMutation.isPending}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!roleplaySessionKey) return;
                  if (endCalledForSessionRef.current.has(roleplaySessionKey)) return;
                  endCalledForSessionRef.current.add(roleplaySessionKey);
                  setRoleplayEndError(null);
                  endScenarioMutation.mutate();
                }}
                disabled={
                  endScenarioMutation.isPending ||
                  (roleplaySessionKey ? endCalledForSessionRef.current.has(roleplaySessionKey) : false)
                }
              >
                End Role-Play & Review
              </Button>

              {roleplayEndError && (
                <div className="text-sm text-destructive">{roleplayEndError}</div>
              )}
            </div>
          </div>

          <Card className="w-80 flex-shrink-0 hidden xl:flex flex-col">
            <CardContent className="flex-1 pt-6 space-y-6">
              <SignalIntelligencePanel
                signals={sessionSignals}
                isLoading={sendResponseMutation.isPending}
                hasActivity={sessionSignals.length > 0}
                compact
              />
            </CardContent>
          </Card>
        </div>
      )}

      <RoleplayFeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        feedback={feedbackData as any}
        scenarioTitle={feedbackScenarioTitle}
        onStartNew={handleReset}
      />
    </div>
  );
}
