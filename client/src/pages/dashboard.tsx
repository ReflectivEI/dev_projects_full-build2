import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  BookOpen,
  Users,
  Brain,
  Clock,
  Target,
  ChevronRight,
  Search,
  FileText,
  Shield,
  CheckCircle,
  Sparkles,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import reflectivAILogo from "@assets/E2ABF40D-E679-443C-A1B7-6681EF25E7E7_1764541714586.png";
import { coachingModules, eqFrameworks } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

const moduleIcons: Record<string, any> = {
  Search,
  Users,
  FileText,
  Shield,
  CheckCircle,
  Brain,
};

type DashboardInsights = {
  dailyTip: string;
  focusArea: string;
  suggestedExercise: { title: string; description: string };
  motivationalQuote: string;
};

export default function Dashboard() {
  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = useQuery<DashboardInsights>({
    queryKey: ["/api/dashboard/insights"],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Welcome to ReflectivAI</h1>
          <p className="text-muted-foreground">
            Master emotional intelligence and sales excellence in Life Sciences
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Daily Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetchInsights()}
                data-testid="button-refresh-insights"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Personalized recommendations powered by AI</CardDescription>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Today's Tip</h4>
                      <p className="text-sm text-muted-foreground">{insights.dailyTip}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">Focus Area</h4>
                          <Badge variant="secondary" className="text-xs">{insights.focusArea}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>{insights.suggestedExercise.title}:</strong> {insights.suggestedExercise.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg border">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-chart-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium mb-1">Motivation</h4>
                        <p className="text-sm text-muted-foreground italic">"{insights.motivationalQuote}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to load insights. Click refresh to try again.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start your coaching journey</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/chat">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-4 flex items-start gap-4">
                    <img 
                      src={reflectivAILogo} 
                      alt="ReflectivAI Logo" 
                      className="h-12 w-12 rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold" data-testid="link-quick-ai-coach">AI Coach</h3>
                      <p className="text-sm text-muted-foreground">
                        Get personalized coaching and feedback
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/roleplay">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-md bg-chart-2 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold" data-testid="link-quick-roleplay">Role Play Simulator</h3>
                      <p className="text-sm text-muted-foreground">
                        Practice with pharma scenarios
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/exercises">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-md bg-chart-3 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold" data-testid="link-quick-exercises">Exercises</h3>
                      <p className="text-sm text-muted-foreground">
                        Build skills through hands-on practice
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/modules">
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-md bg-chart-4 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold" data-testid="link-quick-modules">Coaching Modules</h3>
                      <p className="text-sm text-muted-foreground">
                        Structured learning curriculum
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                EI Frameworks
              </CardTitle>
              <CardDescription>Core emotional intelligence skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {eqFrameworks.map((framework) => (
                <Link href="/frameworks" key={framework.id}>
                  <div className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer" data-testid={`link-framework-${framework.id}`}>
                    <div className={`h-2 w-2 rounded-full bg-${framework.color}`} />
                    <span className="text-sm font-medium flex-1">{framework.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div>
              <CardTitle>Coaching Modules</CardTitle>
              <CardDescription>Build your sales mastery skills</CardDescription>
            </div>
            <Link href="/modules">
              <Button variant="outline" size="sm" data-testid="button-view-all-modules">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coachingModules.slice(0, 6).map((module) => {
                const IconComponent = moduleIcons[module.icon] || BookOpen;
                return (
                  <Link href="/modules" key={module.id}>
                    <Card className="hover-elevate cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm" data-testid={`text-module-${module.id}`}>{module.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {module.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-1.5" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {module.frameworks.slice(0, 2).map((fw) => (
                            <Badge key={fw} variant="secondary" className="text-xs">
                              {fw.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
