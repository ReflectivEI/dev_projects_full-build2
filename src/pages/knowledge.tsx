import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { normalizeAIResponse } from "@/lib/normalizeAIResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Library,
  Search,
  ChevronRight,
  FileText,
  Shield,
  Beaker,
  Users,
  DollarSign,
  Scale,
  BookOpen,
  Sparkles,
  Send,
  MessageSquare,
} from "lucide-react";
import { knowledgeArticles } from "@/lib/data";
import type { KnowledgeArticle } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


const categoryIcons: Record<string, any> = {
  fda: Scale,
  "clinical-trials": Beaker,
  compliance: Shield,
  "hcp-engagement": Users,
  "market-access": DollarSign,
  pricing: DollarSign,
};

const categoryLabels: Record<string, string> = {
  fda: "FDA & Regulatory",
  "clinical-trials": "Clinical Trials",
  compliance: "Compliance",
  "hcp-engagement": "HCP Engagement",
  "market-access": "Market Access",
  pricing: "Pricing",
};

const PHARMA_DEFINITIONS: Record<string, { answer: string; relatedTopics: string[] }> = {
  "pi": {
    answer: "A Principal Investigator (PI) is a medical professional, typically a physician or researcher, who leads a clinical trial at a specific site. The PI is responsible for the overall conduct of the study, patient safety, data integrity, and regulatory compliance at their site.",
    relatedTopics: ["Clinical Trials", "Study Coordinator", "IRB Approval"]
  },
  "ind": {
    answer: "An Investigational New Drug (IND) application is a request for FDA authorization to administer an investigational drug to humans. It contains preclinical data, manufacturing information, clinical protocols, and investigator information.",
    relatedTopics: ["FDA Approval Process", "Clinical Trials", "Phase 1 Studies"]
  },
  "nda": {
    answer: "A New Drug Application (NDA) is the formal request to the FDA for approval to market a new drug in the United States. It includes all data from preclinical and clinical studies, manufacturing details, and proposed labeling.",
    relatedTopics: ["FDA Approval", "Drug Development", "Clinical Trials"]
  },
  "irb": {
    answer: "An Institutional Review Board (IRB) is an independent ethics committee that reviews and approves clinical research involving human subjects. The IRB ensures that the rights, safety, and welfare of research participants are protected.",
    relatedTopics: ["Clinical Trials", "Ethics", "Informed Consent"]
  },
  "gcp": {
    answer: "Good Clinical Practice (GCP) is an international ethical and scientific quality standard for designing, conducting, recording, and reporting clinical trials. GCP ensures the rights, safety, and well-being of trial subjects are protected.",
    relatedTopics: ["Clinical Trials", "Regulatory Compliance", "ICH Guidelines"]
  },
  "hcp": {
    answer: "A Healthcare Professional (HCP) is a licensed medical practitioner such as a physician, nurse practitioner, pharmacist, or other qualified healthcare provider who delivers medical care to patients.",
    relatedTopics: ["Medical Affairs", "Sales Strategy", "Clinical Education"]
  },
  "kol": {
    answer: "A Key Opinion Leader (KOL) is a respected healthcare professional or researcher who influences peers through expertise, publications, and presentations. KOLs play a critical role in shaping medical practice and treatment adoption.",
    relatedTopics: ["Medical Affairs", "Thought Leadership", "Advisory Boards"]
  },
  "adverse event": {
    answer: "An Adverse Event (AE) is any undesirable medical occurrence in a patient administered a pharmaceutical product, whether or not considered related to the treatment. AEs must be documented and reported according to regulatory requirements.",
    relatedTopics: ["Pharmacovigilance", "Safety Monitoring", "Clinical Trials"]
  },
  "informed consent": {
    answer: "Informed Consent is the process by which a patient or research subject voluntarily confirms their willingness to participate in a clinical trial or treatment, after being informed of all relevant aspects including risks, benefits, and alternatives.",
    relatedTopics: ["Clinical Trials", "Patient Rights", "IRB Requirements"]
  }
};

function getDefinitionFallback(question: string): { answer: string; relatedTopics: string[] } | null {
  const normalized = question.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(PHARMA_DEFINITIONS)) {
    if (normalized.includes(key) || normalized.includes(key.replace(/\s+/g, ''))) {
      return value;
    }
  }
  
  return null;
}

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<{ answer: string; relatedTopics: string[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskAi = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setAiAnswer(null); // Clear previous answer

    // Create AbortController with 12-second timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 12000);

    try {
      const contextInfo = selectedArticle 
        ? `Context: The user is reading about "${selectedArticle.title}" (${selectedArticle.summary})`
        : "Context: General pharma knowledge base question";

      // Use apiRequest helper for proper base URL handling (mobile + Cloudflare Pages)
      const response = await apiRequest("POST", "/api/chat/send", {
          message: `CRITICAL: You MUST respond with ONLY valid JSON. No other text before or after.

Question: "${aiQuestion}"

${contextInfo}

Respond with this EXACT JSON structure (no markdown, no explanation):
{"answer": "your 2-3 sentence answer here", "relatedTopics": ["topic1", "topic2", "topic3"]}

JSON only:`,
          content: "Answer knowledge base question",
      });

      // P0 FIX: Read response body BEFORE checking status
      // Worker may return useful error messages in non-200 responses
      const rawText = await response.text();
      
      if (!import.meta.env.DEV) {
        console.log("[P0 KNOWLEDGE] Response status:", response.status);
        console.log("[P0 KNOWLEDGE] Response body:", rawText.substring(0, 500));
      }

      if (!response.ok) {
        // Try to extract error message from Worker response
        try {
          const errorData = JSON.parse(rawText);
          const errorMsg = errorData.error || errorData.message || rawText;
          throw new Error(`Worker error (${response.status}): ${errorMsg}`);
        } catch {
          throw new Error(`Worker returned ${response.status}: ${rawText.substring(0, 100)}`);
        }
      }
      const normalized = normalizeAIResponse(rawText);
      
      // Extract AI message from response structure
      let aiMessage = normalized.text;
      if (normalized.json) {
        const messages = normalized.json.messages;
        if (Array.isArray(messages) && messages.length > 0) {
          aiMessage = messages[messages.length - 1]?.content || normalized.text;
        }
      }

      // P0 DIAGNOSTIC: Log normalized structure
      if (!import.meta.env.DEV) {
        console.log("[P0 KNOWLEDGE] Normalized:", normalized);
        console.log("[P0 KNOWLEDGE] AI Message:", aiMessage.substring(0, 500));
      }

      // Parse the AI message for answer object
      const answerNormalized = normalizeAIResponse(aiMessage);
      
      if (!import.meta.env.DEV) {
        console.log("[P0 KNOWLEDGE] Answer normalized:", answerNormalized);
      }

      if (answerNormalized.json && typeof answerNormalized.json === 'object' && answerNormalized.json.answer) {
        setAiAnswer({
          answer: answerNormalized.json.answer || '',
          relatedTopics: Array.isArray(answerNormalized.json.relatedTopics) ? answerNormalized.json.relatedTopics : []
        });
      } else {
        console.warn("[P0 KNOWLEDGE] Worker returned prose, using as plain text answer");
        
        const answerText = aiMessage && aiMessage.trim().length > 0 
          ? aiMessage 
          : answerNormalized.text || '';
        
        if (answerText.trim().length > 0) {
          setAiAnswer({
            answer: answerText,
            relatedTopics: []
          });
        } else {
          throw new Error('Empty AI response');
        }
      }
    } catch (err) {
      console.error("[P0 KNOWLEDGE] Error in handleAskAi:", err);
      
      // Check if request was aborted (timeout)
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      
      const definitionFallback = getDefinitionFallback(aiQuestion);
      
      if (definitionFallback) {
        console.log("[P0 KNOWLEDGE] Using definition fallback for:", aiQuestion);
        setAiAnswer(definitionFallback);
        setError(null);
      } else {
        // Deterministic fallback response
        const fallbackAnswer = selectedArticle
          ? `Based on the article "${selectedArticle.title}": ${selectedArticle.summary} Try refining your question to a specific term or concept.`
          : "Try refining your question to a specific term (e.g., endpoints, hazard ratio, confidence interval).";
        
        setAiAnswer({
          answer: fallbackAnswer,
          relatedTopics: []
        });
        setError(null); // Clear error to show fallback cleanly
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedArticle) {
    const IconComponent = categoryIcons[selectedArticle.category] || FileText;

    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              setSelectedArticle(null);
              setAiAnswer(null);
              setAiQuestion("");
              setError(null);
            }}
            data-testid="button-back-knowledge"
          >
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Knowledge Base
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <IconComponent className="h-3 w-3" />
                  {categoryLabels[selectedArticle.category]}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-3" data-testid="text-article-title">
                {selectedArticle.title}
              </h1>
              <p className="text-lg text-muted-foreground">{selectedArticle.summary}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedArticle.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6 prose prose-sm dark:prose-invert max-w-none">
                    {selectedArticle.content.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-lg font-medium mt-4 mb-2">
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith("- ")) {
                        const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
                        return (
                          <ul key={index} className="list-disc pl-5 space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className="text-muted-foreground">
                                {item.replace("- ", "")}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={index} className="text-muted-foreground mb-4">
                          {paragraph}
                        </p>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Ask AI About This Topic
                    </CardTitle>
                    <CardDescription>
                      Get AI-powered answers related to this article
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAskAi();
                          }
                        }}
                        placeholder="Ask a question about this topic..."
                        className="min-h-[80px] resize-none text-sm"
                        data-testid="input-ai-question"
                      />
                    </div>
                    <Button
                      onClick={handleAskAi}
                      disabled={!aiQuestion.trim() || isGenerating}
                      className="w-full"
                      data-testid="button-ask-ai"
                    >
                      {isGenerating ? (
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? "Thinking..." : "Ask AI"}
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-xs">{error}</AlertDescription>
                      </Alert>
                    )}

                    {aiAnswer && (
                      <div className="space-y-3 pt-3 border-t">
                        <Alert>
                          <AlertDescription className="text-xs">
                            Generated for this session. Content may clear on navigation.
                          </AlertDescription>
                        </Alert>
                        {aiAnswer.answer && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {aiAnswer.answer}
                            </div>
                          </div>
                        )}
                        {aiAnswer.relatedTopics && aiAnswer.relatedTopics.length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-2">Related Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {aiAnswer.relatedTopics.map((topic, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-chart-4 flex items-center justify-center">
              <Library className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-knowledge-title">Knowledge Base</h1>
              <p className="text-muted-foreground">
                Industry guides covering FDA regulations, clinical trials, and compliance
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-2">AI-Powered Q&A</p>
                  <div className="flex gap-2">
                    <Input
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAskAi();
                        }
                      }}
                      placeholder="Ask any question about pharma regulations, clinical trials, compliance..."
                      className="bg-background"
                      data-testid="input-global-ai-question"
                    />
                    <Button
                      onClick={handleAskAi}
                      disabled={!aiQuestion.trim() || isGenerating}
                      data-testid="button-global-ask-ai"
                    >
                      {isGenerating ? (
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                  )}
                  {aiAnswer && (
                    <div className="mt-4 p-3 bg-background rounded-lg border">
                      <Alert className="mb-3">
                        <AlertDescription className="text-xs">
                          Generated for this session. Content may clear on navigation.
                        </AlertDescription>
                      </Alert>
                      {aiAnswer.answer && (
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
                          {aiAnswer.answer}
                        </div>
                      )}
                      {aiAnswer.relatedTopics && aiAnswer.relatedTopics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {aiAnswer.relatedTopics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles, topics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              data-testid="input-search-knowledge"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all" data-testid="tab-all-articles">All</TabsTrigger>
              <TabsTrigger value="fda" data-testid="tab-fda">
                <Scale className="h-3 w-3 mr-1" />
                FDA
              </TabsTrigger>
              <TabsTrigger value="clinical-trials" data-testid="tab-clinical-trials">
                <Beaker className="h-3 w-3 mr-1" />
                Clinical Trials
              </TabsTrigger>
              <TabsTrigger value="compliance" data-testid="tab-compliance">
                <Shield className="h-3 w-3 mr-1" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="hcp-engagement" data-testid="tab-hcp-engagement">
                <Users className="h-3 w-3 mr-1" />
                HCP
              </TabsTrigger>
              <TabsTrigger value="market-access" data-testid="tab-market-access">
                <DollarSign className="h-3 w-3 mr-1" />
                Market Access
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => {
                const IconComponent = categoryIcons[article.category] || FileText;
                return (
                  <Card
                    key={article.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                    data-testid={`card-article-${article.id}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="mb-2">
                            {categoryLabels[article.category]}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
