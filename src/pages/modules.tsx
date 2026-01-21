import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoachingContent, type CoachingContent as LibCoachingContent } from "@/lib/coaching-content";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { apiRequest } from "@/lib/queryClient";
import { normalizeAIResponse } from "@/lib/normalizeAIResponse";
import { getPracticeQuestions, type PracticeQuestion } from "@/lib/modulePracticeQuestions";

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

// Use the type from coaching-content library
type CoachingGuidance = LibCoachingContent;

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<CoachingModule | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [coachingGuidance, setCoachingGuidance] = useState<CoachingGuidance | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAICoachingModal, setShowAICoachingModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [aiCoachingModule, setAICoachingModule] = useState<CoachingModule | null>(null);
  const [practiceModule, setPracticeModule] = useState<CoachingModule | null>(null);

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
    setCoachingGuidance(null);

    // Create AbortController with 12-second timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 12000);

    try {
      const prompt = `You are a pharma sales coaching expert. Generate coaching guidance for the module: "${module.title}"

Module Category: ${categoryLabels[module.category] || module.category}
Description: ${module.description}

Provide structured coaching guidance in this format:

1. Coaching Focus (1 sentence): What is the core skill or mindset to develop?
2. Why It Matters (2-3 sentences): Why is this critical for pharma sales success?
3. Next Action (1-2 bullet points): Immediate steps to practice this skill
4. Key Practices (3-5 bullet points): Specific techniques and approaches
5. Sample Line (20 seconds): A specific phrase or question they can use in their next conversation

Be specific to pharma sales context (HCPs, clinical data, formulary decisions, etc.)`;

      const response = await apiRequest("POST", "/api/chat/send", {
        message: prompt,
        content: "Generate coaching guidance"
      }, { signal: abortController.signal });

      const rawText = await response.text();
      
      if (response.ok) {
        const normalized = normalizeAIResponse(rawText);
        
        let aiMessage = normalized.text;
        if (normalized.json) {
          const messages = normalized.json.messages;
          if (Array.isArray(messages) && messages.length > 0) {
            aiMessage = messages[messages.length - 1]?.content || normalized.text;
          }
        }

        const guidanceNormalized = normalizeAIResponse(aiMessage);
        
        // Try to parse structured JSON response
        if (guidanceNormalized.json && guidanceNormalized.json.focus) {
          setCoachingGuidance({
            focus: guidanceNormalized.json.focus || '',
            whyItMatters: guidanceNormalized.json.whyItMatters || '',
            nextAction: guidanceNormalized.json.nextAction || '',
            keyPractices: Array.isArray(guidanceNormalized.json.keyPractices) ? guidanceNormalized.json.keyPractices : [],
            commonChallenges: Array.isArray(guidanceNormalized.json.commonChallenges) ? guidanceNormalized.json.commonChallenges : [],
            developmentTips: Array.isArray(guidanceNormalized.json.developmentTips) ? guidanceNormalized.json.developmentTips : []
          });
          return;
        }
        
        // If AI returned prose, use it as-is
        if (aiMessage && aiMessage.trim().length > 50) {
          setCoachingGuidance({
            focus: `AI Coaching for ${module.title}`,
            whyItMatters: aiMessage,
            nextAction: "Apply these insights in your next customer interaction.",
            keyPractices: [],
            commonChallenges: [],
            developmentTips: []
          });
          return;
        }
      }
      
      throw new Error('AI response invalid or unavailable');
      
    } catch (err) {
      console.warn('[MODULES] AI generation failed, using static content:', err);
      const content = getCoachingContent(module.id);
      
      if (content) {
        setCoachingGuidance(content);
      } else {
        // Deterministic fallback using module info
        setCoachingGuidance({
          focus: `${module.title} Coaching`,
          whyItMatters: `${module.description} This skill is essential for building trust with healthcare professionals and driving meaningful clinical conversations that lead to better patient outcomes.`,
          nextAction: "Practice this skill in your next customer interaction and document what worked well.",
          keyPractices: [
            'Focus on active listening and understanding customer needs',
            'Use open-ended questions to uncover deeper insights',
            'Connect clinical evidence to real-world patient scenarios',
            'Build relationships based on trust and ongoing value'
          ],
          commonChallenges: [
            'Talking too much instead of listening',
            'Focusing on product features instead of customer needs',
            'Not following up consistently after initial conversations'
          ],
          developmentTips: [
            'Role-play difficult scenarios with colleagues',
            'Seek feedback from managers and peers regularly',
            'Study best practices from top performers in your organization'
          ]
        });
      }
    } finally {
      clearTimeout(timeoutId);
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

                {/* Force rebuild - Jan 20 2026 10:52 PM */}
                <Button
                  onClick={() => {
                    console.log('[MODULES] Button clicked! selectedModule:', selectedModule?.title);
                    console.log('[MODULES] isGenerating:', isGenerating);
                    console.log('[MODULES] coachingGuidance:', coachingGuidance);
                    if (selectedModule) {
                      console.log('[MODULES] Calling generateCoachingGuidance...');
                      generateCoachingGuidance(selectedModule);
                    } else {
                      console.error('[MODULES] ERROR: selectedModule is null!');
                    }
                  }}
                  disabled={isGenerating}
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

                    {coachingGuidance.keyPractices && coachingGuidance.keyPractices.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          Key Practices
                        </h4>
                        <ul className="space-y-1 pl-6">
                          {coachingGuidance.keyPractices.map((practice, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {coachingGuidance.commonChallenges && coachingGuidance.commonChallenges.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Common Challenges
                        </h4>
                        <ul className="space-y-1 pl-6">
                          {coachingGuidance.commonChallenges.map((challenge, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {coachingGuidance.developmentTips && coachingGuidance.developmentTips.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Development Tips
                        </h4>
                        <ul className="space-y-1 pl-6">
                          {coachingGuidance.developmentTips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
