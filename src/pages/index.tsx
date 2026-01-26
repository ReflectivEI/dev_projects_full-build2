import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Target, TrendingUp, Users } from 'lucide-react';

/**
 * Home page component
 *
 * Displays the main landing page for ReflectivAI Healthcare Professional Training Platform.
 * The layout (header/footer) is handled by RootLayout in App.tsx.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master Healthcare Professional Engagement
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Practice real-world conversations with AI-powered HCP personas. Build confidence, refine your approach, and improve outcomes.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/roleplay">
                <Button size="lg" className="text-lg">
                  Start Training
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why ReflectivAI?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Realistic Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Practice with AI-powered HCP personas that respond authentically to your approach.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Observable Cues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Detect behavioral signals like time pressure, skepticism, and evidence requests in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your active listening, empathy, objection handling, and value articulation skills.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>40+ Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Train across multiple disease states, specialties, and HCP categories.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Skills?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join healthcare professionals who are mastering HCP engagement through AI-powered training.
            </p>
            <Link to="/roleplay">
              <Button size="lg" className="text-lg">
                Begin Your First Session
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}