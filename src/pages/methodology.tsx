import { ArrowLeft, Brain, Target, Users, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MethodologyPage() {
  const competencies = [
    {
      name: 'Clarity',
      icon: Target,
      definition: 'Precise, unambiguous communication that builds understanding',
      description:
        'Clarity is the foundation of effective communication in high-stakes conversations. It involves articulating complex scientific concepts in ways that are accessible without being reductive, using concrete language that minimizes misinterpretation, and structuring information to support comprehension.',
      signals: [
        'Specific, concrete language rather than vague generalizations',
        'Structured information flow that builds understanding progressively',
        'Explicit connections between concepts and stakeholder priorities',
        'Proactive clarification of potentially ambiguous terms',
      ],
      research:
        'Grounded in conversational intelligence research and clarity theory from organizational communication studies.',
    },
    {
      name: 'Alignment',
      icon: Users,
      definition: 'Purpose-driven messaging that connects to stakeholder goals',
      description:
        'Alignment ensures that every element of the conversation serves a clear purpose that resonates with stakeholder objectives. It requires understanding the stakeholder\'s context, priorities, and constraints, then framing information in ways that demonstrate relevance to their specific situation.',
      signals: [
        'Explicit connections between product features and stakeholder outcomes',
        'Recognition of stakeholder priorities and constraints',
        'Purpose-driven questions that advance mutual understanding',
        'Framing that demonstrates awareness of organizational context',
      ],
      research:
        'Based on strategic communication theory and stakeholder engagement research from healthcare communication.',
    },
    {
      name: 'Responsiveness',
      icon: TrendingUp,
      definition: 'Active listening and adaptive engagement',
      description:
        'Responsiveness is the ability to recognize and adapt to verbal and non-verbal cues in real-time. It involves active listening, pattern recognition, and the flexibility to adjust approach based on stakeholder reactions, questions, and concerns as they emerge.',
      signals: [
        'Direct acknowledgment of stakeholder questions and concerns',
        'Adaptive pacing based on stakeholder engagement signals',
        'Recognition and response to implicit concerns or hesitations',
        'Willingness to adjust approach when initial framing doesn\'t resonate',
      ],
      research:
        'Informed by active listening research and adaptive communication frameworks from interpersonal communication studies.',
    },
    {
      name: 'Balance',
      icon: Brain,
      definition: 'Strategic equilibrium between advocacy and inquiry',
      description:
        'Balance involves maintaining productive tension between presenting information (advocacy) and seeking understanding (inquiry). Effective communicators know when to provide information, when to ask questions, and how to create space for dialogue rather than monologue.',
      signals: [
        'Strategic use of questions to understand stakeholder perspective',
        'Appropriate ratio of speaking to listening',
        'Space for stakeholder input and collaborative problem-solving',
        'Avoidance of one-sided information delivery',
      ],
      research:
        'Rooted in dialogue theory and advocacy-inquiry balance research from organizational learning and negotiation studies.',
    },
    {
      name: 'Adaptability',
      icon: TrendingUp,
      definition: 'Flexible approach based on real-time situational awareness',
      description:
        'Adaptability is the capacity to recognize when the current approach isn\'t working and adjust strategy accordingly. It requires situational awareness, pattern recognition, and the confidence to deviate from planned approaches when the situation demands it.',
      signals: [
        'Recognition of when initial approach isn\'t resonating',
        'Willingness to change direction based on stakeholder feedback',
        'Flexible use of different communication strategies',
        'Recovery from misunderstandings or communication breakdowns',
      ],
      research:
        'Based on adaptive expertise research and situational awareness frameworks from cognitive psychology.',
    },
    {
      name: 'Outcome Orientation',
      icon: CheckCircle2,
      definition: 'Focus on measurable progress toward defined objectives',
      description:
        'Outcome orientation ensures that conversations drive toward specific, measurable progress. It involves defining clear objectives, recognizing when progress is being made, and steering conversations back on track when they drift from productive territory.',
      signals: [
        'Clear articulation of conversation objectives',
        'Recognition of progress toward defined goals',
        'Strategic redirection when conversations become unproductive',
        'Concrete next steps and commitments',
      ],
      research:
        'Informed by goal-setting theory and outcome-focused communication research from organizational psychology.',
    },
  ];

  const principles = [
    {
      title: 'No Prescriptive Scripts',
      description:
        'Signal Intelligence™ doesn\'t tell you what to say. Instead, it helps you understand the patterns in how you communicate and their impact on outcomes. The goal is to develop adaptive expertise, not memorize responses.',
    },
    {
      title: 'Behavioral Science Foundation',
      description:
        'Every competency is grounded in peer-reviewed research from fields including conversational intelligence, organizational communication, cognitive psychology, and healthcare communication.',
    },
    {
      title: 'Pattern Recognition Over Perfection',
      description:
        'The framework identifies communication patterns that consistently correlate with positive or negative outcomes. It\'s about recognizing tendencies and making intentional adjustments, not achieving perfect scores.',
    },
    {
      title: 'Context-Aware Analysis',
      description:
        'Signal Intelligence™ evaluates communication in context. What works in one situation may not work in another. The system considers stakeholder type, conversation stage, and situational dynamics.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              Research-Backed Framework
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Signal Intelligence™ Methodology
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A behavioral science-backed framework for analyzing and developing communication
              competencies in high-stakes life sciences sales conversations. Built on peer-reviewed
              research from conversational intelligence, organizational communication, and cognitive
              psychology.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Six Core Competencies</h2>
            <p className="text-lg text-muted-foreground">
              Signal Intelligence™ evaluates communication across six dimensions that research shows
              consistently correlate with successful outcomes in complex stakeholder conversations.
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {competencies.map((competency, index) => {
              const Icon = competency.icon;
              return (
                <Card
                  key={competency.name}
                  className="p-8 lg:p-12 border-2 hover:border-accent/50 transition-colors"
                >
                  <div className="grid lg:grid-cols-[auto,1fr] gap-8">
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="h-8 w-8 text-accent" />
                      </div>
                      <div className="text-4xl font-bold font-mono text-muted-foreground">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-3xl font-bold mb-2">{competency.name}</h3>
                      <p className="text-lg text-accent mb-6">{competency.definition}</p>
                      <p className="text-muted-foreground mb-8 leading-relaxed">
                        {competency.description}
                      </p>

                      <div className="mb-8">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                          Key Signals
                        </h4>
                        <ul className="space-y-3">
                          {competency.signals.map((signal, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Research Foundation:</strong> {competency.research}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Principles</h2>
            <p className="text-lg text-muted-foreground">
              Signal Intelligence™ is built on fundamental principles that distinguish it from
              traditional sales training approaches.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {principles.map((principle) => (
              <Card key={principle.title} className="p-8 border-2">
                <h3 className="text-xl font-bold mb-4">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It's Applied */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Signal Intelligence™ Works in Practice</h2>
            <p className="text-lg text-muted-foreground">
              The framework translates research into actionable coaching through a structured
              analysis and feedback system.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-8 border-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-bold font-mono text-accent">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Conversation Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI evaluates role-play conversations across all six competencies, identifying
                    specific moments where communication patterns strengthen or weaken credibility,
                    trust, and access.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-bold font-mono text-accent">
                  02
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Competency Scoring</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Each competency receives a score based on the presence and quality of key
                    signals. Scores are not grades—they're diagnostic tools that reveal patterns and
                    development opportunities.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-bold font-mono text-accent">
                  03
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Coaching Cards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Specific moments from the conversation are highlighted with coaching insights
                    that explain what happened, why it mattered, and how different approaches might
                    have changed the outcome.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 font-bold font-mono text-accent">
                  04
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pattern Recognition</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Over time, the system identifies recurring patterns in communication style,
                    helping reps understand their natural tendencies and where focused development
                    will have the greatest impact.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent/5 border-y border-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Experience Signal Intelligence™ in Action
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              See how the framework translates into practical coaching that helps life sciences
              sales reps develop the skills that protect credibility, trust, and access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/">
                  Request a Demo
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/">Learn More About ReflectivAi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
