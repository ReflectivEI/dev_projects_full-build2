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

      // Parse the AI message for exercises array
      const exercisesNormalized = normalizeAIResponse(aiMessage);
      
      if (Array.isArray(exercisesNormalized.json) && exercisesNormalized.json.length > 0) {
        setExercises(exercisesNormalized.json);
      } else {
        throw new Error("Could not parse exercises from response");
      }
    } catch (err) {
      console.error("Exercise generation error:", err);
      // Mobile-friendly error message with network hint
      const errorMessage = err instanceof Error && err.message.includes('Failed to fetch')
        ? "Network error. Please check your connection and try again."
        : "Unable to generate exercises. Please try again.";
      setError(errorMessage);
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
