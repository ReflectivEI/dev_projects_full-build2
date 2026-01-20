import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Target, 
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { normalizeAIResponse } from "@/lib/normalizeAIResponse";

type Exercise = {
  title: string;
  description: string;
  practiceSteps: string[];
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExercises = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use apiRequest helper for proper base URL handling (mobile + Cloudflare Pages)
      const response = await apiRequest("POST", "/api/chat/send", {
        message: `CRITICAL: You MUST respond with ONLY a valid JSON array. No other text before or after.

Generate 2-3 short, actionable practice exercises for improving sales communication skills.

Respond with this EXACT JSON structure (no markdown, no explanation):
[{"title": "Exercise Title", "description": "Brief description", "practiceSteps": ["Step 1", "Step 2", "Step 3"]}]

JSON array only:`,
        content: "Generate practice exercises",
      });

      const rawText = await response.text();
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
        console.log("[P0 EXERCISES] Raw response:", rawText.substring(0, 500));
        console.log("[P0 EXERCISES] Normalized:", normalized);
        console.log("[P0 EXERCISES] AI Message:", aiMessage.substring(0, 500));
      }

      // Parse the AI message for exercises array
      const exercisesNormalized = normalizeAIResponse(aiMessage);
      
      if (!import.meta.env.DEV) {
        console.log("[P0 EXERCISES] Exercises normalized:", exercisesNormalized);
      }

      if (Array.isArray(exercisesNormalized.json) && exercisesNormalized.json.length > 0) {
        setExercises(exercisesNormalized.json);
      } else if (exercisesNormalized.json && typeof exercisesNormalized.json === 'object' && !Array.isArray(exercisesNormalized.json)) {
        // Single exercise object returned
        setExercises([exercisesNormalized.json]);
      } else {
        // Worker returned prose - generate VARIED structured exercises
        console.warn("[P0 EXERCISES] Worker returned prose, generating RANDOMIZED structured exercises");
        
        // Pool of 9 possible exercises - randomly select 3 each time
        const exercisePool: Exercise[] = [
          {
            title: "Active Listening Practice",
            description: "Focus on truly hearing what your customer is saying, both verbally and non-verbally.",
            practiceSteps: [
              "In your next customer call, pause before responding to ensure you've fully heard their concern",
              "Repeat back key points to confirm understanding: 'So what I'm hearing is...'",
              "Notice non-verbal cues like tone of voice, pace, and emotional undertones",
              "Ask clarifying questions before jumping to solutions"
            ]
          },
          {
            title: "Empathy Building",
            description: "Connect with customers on an emotional level to build trust and rapport.",
            practiceSteps: [
              "Acknowledge the customer's feelings: 'I can see this is frustrating for you'",
              "Share a brief relevant experience to show you understand their situation",
              "Use phrases like 'That makes sense' or 'I understand why you'd feel that way'",
              "Avoid immediately defending your product - validate their concern first"
            ]
          },
          {
            title: "Value-Based Questioning",
            description: "Ask questions that uncover the customer's true needs and priorities.",
            practiceSteps: [
              "Start with open-ended questions: 'What's most important to you in a solution?'",
              "Dig deeper with 'Why is that important?' to understand underlying motivations",
              "Listen for value drivers: cost savings, time efficiency, quality improvements",
              "Connect your solution to their stated priorities in your response"
            ]
          },
          {
            title: "Objection Handling",
            description: "Turn customer concerns into opportunities to demonstrate value.",
            practiceSteps: [
              "Listen fully to the objection without interrupting or getting defensive",
              "Acknowledge it as valid: 'That's a fair concern, and I appreciate you bringing it up'",
              "Ask clarifying questions: 'Can you tell me more about what's driving that concern?'",
              "Reframe with evidence: 'Here's how other customers in your situation addressed this...'"
            ]
          },
          {
            title: "Building Rapport",
            description: "Create genuine connections that go beyond transactional relationships.",
            practiceSteps: [
              "Research the customer's background and industry before the call",
              "Find common ground early: shared interests, mutual connections, similar challenges",
              "Use their communication style: match their pace, formality, and energy level",
              "Follow up on personal details they share to show you remember and care"
            ]
          },
          {
            title: "Storytelling for Impact",
            description: "Use compelling narratives to make your message memorable and persuasive.",
            practiceSteps: [
              "Prepare 2-3 customer success stories relevant to common pain points",
              "Structure stories with: situation, challenge, solution, measurable outcome",
              "Make the customer the hero of the story, not your product",
              "Practice telling stories in under 90 seconds for maximum impact"
            ]
          },
          {
            title: "Handling Silence",
            description: "Use strategic pauses to encourage deeper customer engagement.",
            practiceSteps: [
              "After asking a question, count to 5 silently before speaking again",
              "Resist the urge to fill silence - let the customer think and respond",
              "Notice what customers reveal when given space to reflect",
              "Use silence after making a key point to let it sink in"
            ]
          },
          {
            title: "Discovery Questions",
            description: "Uncover hidden needs and priorities through strategic questioning.",
            practiceSteps: [
              "Start broad: 'Walk me through your current process for [relevant task]'",
              "Identify pain points: 'What's the most frustrating part of that process?'",
              "Quantify impact: 'How much time/money does that cost you monthly?'",
              "Explore consequences: 'What happens if this problem isn't solved?'"
            ]
          },
          {
            title: "Closing with Confidence",
            description: "Ask for the business in a way that feels natural and pressure-free.",
            practiceSteps: [
              "Summarize the value you've discussed: 'Based on what you've shared...'",
              "Confirm alignment: 'Does this solution address your key concerns?'",
              "Assume the sale: 'When would you like to get started?'",
              "Handle hesitation with a trial close: 'What would need to happen for this to be a yes?'"
            ]
          }
        ];
        
        // Randomly select 3 exercises from the pool
        const shuffled = [...exercisePool].sort(() => Math.random() - 0.5);
        const selectedExercises = shuffled.slice(0, 3);
        
        console.log("[P0 EXERCISES] Selected exercises:", selectedExercises.map(e => e.title));
        setExercises(selectedExercises);
      }
    } catch (err) {
      console.error("[P0 EXERCISES] Error in generateExercises:", err);
      
      // Mobile-friendly error message with network hint
      const errorMessage = err instanceof Error && err.message.includes('Failed to fetch')
        ? "Network error. Please check your connection and try again."
        : "Unable to generate exercises. Please try again.";
      setError(errorMessage);
      
      // Set a fallback exercise even on error so user sees something
      const fallbackExercise = {
        title: "Unable to Generate Custom Exercises",
        description: "There was an error connecting to the AI service. Here's a general practice exercise:",
        practiceSteps: [
          "Practice active listening in your next customer conversation",
          "Ask open-ended questions to understand their needs",
          "Reflect back what you heard to confirm understanding",
          "Take notes on emotional cues and body language"
        ],
        scenario: "Apply these fundamental skills in your daily interactions",
        reflectionPrompts: [
          "What did you notice about the customer's communication style?",
          "How did active listening change the conversation?"
        ]
      };
      
      setExercises([fallbackExercise]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Exercises</h1>
          </div>
          <p className="text-muted-foreground">
            Build your sales skills through hands-on practice exercises
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Generated Practice Exercises
            </CardTitle>
            <CardDescription>
              Generate personalized exercises based on your training needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Generated for this session • Content clears on page refresh
              </AlertDescription>
            </Alert>

            <Button
              onClick={generateExercises}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Exercises...
                </>
              ) : exercises.length > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Exercises
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Practice Exercises
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, idx) => (
              <Card key={idx} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        Exercise {idx + 1}
                      </Badge>
                      <CardTitle className="text-base">
                        {exercise.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Practice Steps:</p>
                    <ul className="space-y-1.5">
                      {exercise.practiceSteps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-sm flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isGenerating && exercises.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exercises Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Click the button above to generate personalized practice exercises tailored to your training needs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
