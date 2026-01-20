import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { normalizeAIResponse } from "@/lib/normalizeAIResponse";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Search,
  Users,
  FileText,
  Shield,
  CheckCircle,
  Brain,
  Target,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { coachingModules, eqFrameworks } from "@/lib/data";
import type { CoachingModule } from "@shared/schema";

const moduleIcons: Record<string, any> = {
  Search,
  Users,
  FileText,
  Shield,
  CheckCircle,
  Brain,
};

const categoryLabels: Record<string, string> = {
  discovery: "Discovery",
  stakeholder: "Stakeholder",
  clinical: "Clinical",
  objection: "Objection Handling",
  closing: "Closing",
  eq: "Signal Intelligence",
};

type CoachingGuidance = {
  focus: string;
  whyItMatters: string;
  nextAction: string;
  keyPractices?: string[];
  commonChallenges?: string[];
  developmentTips?: string[];
  fullText?: string;
};

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<CoachingModule | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [coachingGuidance, setCoachingGuidance] = useState<CoachingGuidance | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredModules = activeTab === "all"
    ? coachingModules
    : coachingModules.filter(m => m.category === activeTab);

  const getFrameworkDetails = (frameworkId: string) => {
    return eqFrameworks.find(f => f.id === frameworkId);
  };

  const generateCoachingGuidance = async (module: CoachingModule) => {
    console.log('[MODULES] generateCoachingGuidance called for module:', module.title);
    setIsGenerating(true);
    setError(null);
    setCoachingGuidance(null); // Clear previous guidance

    try {
      // Use apiRequest helper for proper base URL handling (mobile + Cloudflare Pages)
      const response = await apiRequest("POST", "/api/chat/send", {
          message: `CRITICAL: You MUST respond with ONLY valid JSON. No other text before or after.

Module: "${module.title}" - ${module.description}

Respond with this EXACT JSON structure (no markdown, no explanation):
{"focus": "one sentence coaching focus", "whyItMatters": "1-2 sentences why this matters", "nextAction": "one concrete action"}

JSON only:`,
          content: "Generate coaching guidance",
      });

      // P0 FIX: Read response body BEFORE checking status
      const rawText = await response.text();
      
      if (!import.meta.env.DEV) {
        console.log("[P0 MODULES] Response status:", response.status);
        console.log("[P0 MODULES] Response body:", rawText.substring(0, 500));
      }

      if (!response.ok) {
        throw new Error(`Worker returned ${response.status}: ${rawText.substring(0, 100)}`);
      }
      const normalized = normalizeAIResponse(rawText);
      
      // Extract AI message from response structure
      let aiMessage = normalized.text;
      if (normalized.json) {
        aiMessage = normalized.json.aiMessage?.content || 
                   normalized.json.messages?.find((m: any) => m.role === "assistant")?.content || 
                   normalized.text;
      }

      // P0 DIAGNOSTIC: Log what we received
      if (!import.meta.env.DEV) {
        console.log("[P0 MODULES] Raw response:", rawText.substring(0, 500));
        console.log("[P0 MODULES] AI Message:", aiMessage.substring(0, 500));
      }

      // Parse the AI message for coaching guidance
      const guidanceNormalized = normalizeAIResponse(aiMessage);
      
      if (!import.meta.env.DEV) {
        console.log("[P0 MODULES] Guidance normalized:", guidanceNormalized);
      }

      if (guidanceNormalized.json && typeof guidanceNormalized.json === 'object' && guidanceNormalized.json.focus) {
        setCoachingGuidance(guidanceNormalized.json);
      } else {
        // Worker returned prose - use as plain text guidance
        console.warn("[P0 MODULES] Worker returned prose, using as plain text");
        
        // Use the AI message directly as coaching guidance
        const guidanceText = aiMessage && aiMessage.trim().length > 0 
          ? aiMessage 
          : 'Unable to generate coaching guidance. Please try again.';
        
        setCoachingGuidance({
          focus: `Coaching Insights for ${module.title}`,
          whyItMatters: guidanceText.substring(0, 300) + (guidanceText.length > 300 ? '...' : ''),
          nextAction: 'Review the guidance above and apply it to your next customer interaction.',
          fullText: guidanceText
        });
      }
    } catch (err) {
      console.error("[P0 MODULES] Error in generateGuidance:", err);
      setError("Unable to generate coaching guidance. Please try again.");
      
      // Set a fallback guidance even on error
      setCoachingGuidance({
        focus: `Coaching Tips for ${module.title}`,
        whyItMatters: "There was an error connecting to the AI service. Here are some general coaching tips for this module: Focus on active listening and understanding customer needs. Practice the core skills regularly and seek feedback from colleagues.",
        nextAction: "Try regenerating the guidance, or proceed with the general tips above."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (selectedModule) {
    const IconComponent = moduleIcons[selectedModule.icon] || BookOpen;

    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              setSelectedModule(null);
              setCoachingGuidance(null);
              setError(null);
            }}
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Modules
          </Button>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{categoryLabels[selectedModule.category]}</Badge>
                    </div>
                    <CardTitle className="text-2xl">
                      {selectedModule.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedModule.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.frameworks.map((fw) => {
                    const framework = getFrameworkDetails(fw);
                    return (
                      <Badge key={fw} variant="secondary">
                        <Brain className="h-3 w-3 mr-1" />
                        {framework?.name || fw}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Coaching Guidance
                </CardTitle>
                <CardDescription>
                  Get personalized coaching recommendations for this module
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Generated for this session • Content clears on navigation
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => {
                    if (selectedModule) {
                      console.log('[MODULES] Regenerate button clicked, calling generateCoachingGuidance');
                      generateCoachingGuidance(selectedModule);
                    }
                  }}
                  disabled={isGenerating || !selectedModule}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      Generating Guidance...
                    </>
                  ) : coachingGuidance ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Guidance
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Generate Coaching Guidance
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {coachingGuidance && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Coaching Focus
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {coachingGuidance.focus}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Why It Matters
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {coachingGuidance.whyItMatters}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Next Action
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {coachingGuidance.nextAction}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Signal Intelligence Frameworks</CardTitle>
                <CardDescription>Understanding these frameworks will help you excel</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {selectedModule.frameworks.map((fw) => {
                    const framework = getFrameworkDetails(fw);
                    if (!framework) return null;
                    return (
                      <AccordionItem key={fw} value={fw}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            {framework.name}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-4">{framework.description}</p>
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Key Principles:</h5>
                            <ul className="space-y-1">
                              {framework.principles.map((p, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <Target className="h-3 w-3 mt-1 flex-shrink-0" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-bold">Coaching Modules</h1>
          <p className="text-muted-foreground">
            Build your pharma sales mastery with structured learning paths
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="stakeholder">Stakeholder</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="objection">Objection</TabsTrigger>
            <TabsTrigger value="closing">Closing</TabsTrigger>
            <TabsTrigger value="eq">Signal Intelligence</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const IconComponent = moduleIcons[module.icon] || BookOpen;
            return (
              <Card
                key={module.id}
                className="hover-elevate"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="mb-1">{categoryLabels[module.category]}</Badge>
                      <h3 className="font-semibold">{module.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(module);
                        // Auto-generate AI coaching when clicking AI Coaching button
                        setTimeout(() => generateCoachingGuidance(module), 100);
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Coaching
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(module);
                        // Don't auto-generate when viewing module details
                        setCoachingGuidance(null);
                      }}
                    >
                      View Module
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
