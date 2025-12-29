import { ArrowRight, CheckCircle2, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const competencies = [
    {
      name: 'Clarity',
      description: 'Precise, unambiguous communication that builds understanding',
      position: 'top-0 left-1/2 -translate-x-1/2',
    },
    {
      name: 'Alignment',
      description: 'Purpose-driven messaging that connects to stakeholder goals',
      position: 'top-1/4 right-0',
    },
    {
      name: 'Responsiveness',
      description: 'Active listening and adaptive engagement',
      position: 'bottom-1/4 right-0',
    },
    {
      name: 'Balance',
      description: 'Strategic equilibrium between advocacy and inquiry',
      position: 'bottom-0 left-1/2 -translate-x-1/2',
    },
    {
      name: 'Adaptability',
      description: 'Flexible approach based on real-time situational awareness',
      position: 'bottom-1/4 left-0',
    },
    {
      name: 'Outcome Orientation',
      description: 'Focus on measurable progress toward defined objectives',
      position: 'top-1/4 left-0',
    },
  ];

  const workflows = [
    {
      step: '01',
      title: 'Practice High-Stakes Scenarios',
      description:
        'Engage in realistic role-play simulations designed for life sciences sales conversations. Navigate objections, compliance concerns, and stakeholder dynamics in a safe environment.',
      image: 'https://media.gettyimages.com/id/1449778892/photo/concept-e-learning-education-man-using-laptop-with-online-education-icon-on-virtual-screen.jpg?b=1&s=2048x2048&w=0&k=20&c=-u4tGIkP9-dzGRCi53AgO8XNC_bmJHZYOnun4UoODxs=',
    },
    {
      step: '02',
      title: 'AI Analysis & Pattern Recognition',
      description:
        'Signal Intelligence™ evaluates your conversation across six core competencies. The system identifies communication patterns that strengthen or weaken credibility, trust, and access.',
      image: 'https://media.gettyimages.com/id/2188611235/photo/close-up-of-woman-analyzing-business-data-on-tablet-in-modern-office-space.jpg?b=1&s=2048x2048&w=0&k=20&c=IVDWZn2Hu4vOGj8x6oaalt-4VXkLpyGJClLpoqJJKL0=',
    },
    {
      step: '03',
      title: 'Structured Coaching Feedback',
      description:
        'Receive competency scores and coaching cards that highlight specific moments where your communication decisions impacted the outcome. No prescriptive scripts—just insight into what worked and why.',
      image: 'https://media.gettyimages.com/id/2195278308/photo/analyst-to-analyze-data-shows-a-dashboard-chart-for-business-data-analysis-and-metrics.jpg?b=1&s=2048x2048&w=0&k=20&c=HvWn9w-TzriscyCIBA3yjt50qtbQdE-pzDfYQPYFIF4=',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Built on Behavioral Science
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Master High-Stakes Conversations
              <span className="block text-accent mt-2">Through AI-Powered Practice</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              ReflectivAi uses Signal Intelligence™ to help life sciences sales reps practice
              critical conversations, analyze communication patterns, and build the skills that
              protect credibility, trust, and access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8">
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by life sciences sales teams at leading pharmaceutical and biotech companies
            </p>
          </div>
        </div>
      </section>

      {/* Signal Intelligence Framework */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Signal Intelligence™ Framework</h2>
            <p className="text-lg text-muted-foreground">
              Six core competencies that define effective communication in high-stakes life sciences
              sales conversations. Each interaction is analyzed across these dimensions to reveal
              patterns that impact outcomes.
            </p>
          </div>

          {/* Circular Framework Visualization */}
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-square max-w-3xl mx-auto">
              {/* Center Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Signal Intelligence™</div>
                    <div className="text-sm text-muted-foreground px-6">
                      Behavioral science-backed competency framework
                    </div>
                  </div>
                </div>
              </div>

              {/* Competency Nodes */}
              {competencies.map((competency, index) => (
                <div
                  key={competency.name}
                  className={`absolute ${competency.position} w-56`}
                >
                  <Card className="p-6 bg-card hover:bg-accent/5 transition-colors border-2 hover:border-accent">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{competency.name}</h3>
                        <p className="text-sm text-muted-foreground">{competency.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              {/* Connecting Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: -1 }}
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>

          {/* Framework Description */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <p className="text-muted-foreground">
              Signal Intelligence™ combines conversational intelligence research, behavioral
              psychology, and social dynamics theory. The result: practical skills that help you
              read situations accurately and respond in ways that preserve trust and credibility.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How ReflectivAi Works</h2>
            <p className="text-lg text-muted-foreground">
              A structured practice and coaching system that turns simulated conversations into
              actionable competency development.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-24">
            {workflows.map((workflow, index) => (
              <div
                key={workflow.step}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold font-mono mb-4">
                    STEP {workflow.step}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{workflow.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {workflow.description}
                  </p>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
                    <img
                      src={workflow.image}
                      alt={workflow.title}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Reps and Managers</h2>
            <p className="text-lg text-muted-foreground">
              ReflectivAi serves the entire sales enablement ecosystem with role-specific value.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:border-accent transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Sales Reps</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Practice high-stakes conversations in a safe, judgment-free environment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Receive structured feedback on specific communication patterns
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Build competency scores that track improvement over time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Develop skills that protect credibility and access in the field
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-2 hover:border-accent transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Sales Managers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Identify team-wide competency gaps with aggregated analytics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Deliver targeted coaching based on objective performance data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Track skill development progress across the entire team
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Build a culture of continuous improvement and practice
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Start Building Skills Today
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Sales Conversations?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join life sciences sales teams using ReflectivAi to practice, analyze, and improve
              their high-stakes communication skills. No scripts. No judgment. Just structured
              coaching powered by behavioral science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/methodology">Explore Signal Intelligence™</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
