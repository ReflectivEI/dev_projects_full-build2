import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CapabilityReview() {
  const newInterface = `export interface SignalCapability {
  id: string;                    // e.g., "signal-awareness"
  name: string;                  // e.g., "Signal Awareness"
  behavioralMetric: string;      // e.g., "Question Quality"
  description: string;           // Full capability description
  showsUpWhen: string;          // Observable behavior pattern
  conversationExamples: string[]; // List of specific examples
  icon: string;                  // Lucide icon name
  color: string;                 // HSL color value
  category: string;              // Grouping category
}`;

  const capabilities = [
    {
      id: 'signal-awareness',
      name: 'Signal Awareness',
      behavioralMetric: 'Question Quality',
      description: 'Notice relevant customer cues and use those cues to shape purposeful, well-sequenced questions.',
      showsUpWhen: 'Often shows up when a seller notices relevant customer cues and uses them to shape their next question.',
      examples: [
        'Purposeful, customer-centered questioning',
        'Questions build on previous responses',
        'Avoids premature solution-pushing',
        'Demonstrates curiosity about customer context',
      ],
      icon: 'Target',
      color: 'hsl(210, 100%, 50%)',
      category: 'awareness',
    },
    {
      id: 'signal-interpretation',
      name: 'Signal Interpretation',
      behavioralMetric: 'Listening & Responsiveness',
      description: 'Make sense of what a customer is communicating and adjust responses as new information emerges.',
      showsUpWhen: 'Often shows up when a seller reflects what they are hearing and adapts their response accordingly.',
      examples: [
        'Accurate paraphrasing of customer statements',
        'Acknowledges before responding',
        'Adjusts based on customer feedback',
        'Demonstrates active listening',
      ],
      icon: 'Ear',
      color: 'hsl(160, 100%, 40%)',
      category: 'interpretation',
    },
    {
      id: 'value-connection',
      name: 'Value Connection',
      behavioralMetric: 'Value Framing',
      description: 'Link discussion to what matters to the customer by translating priorities into outcome-based value.',
      showsUpWhen: 'Often shows up when a seller connects back to outcomes or priorities the customer has already expressed.',
      examples: [
        'Outcome-focused language',
        'Links features to customer goals',
        'References earlier stated priorities',
        'Translates technical details to business value',
      ],
      icon: 'TrendingUp',
      color: 'hsl(280, 100%, 50%)',
      category: 'value',
    },
    {
      id: 'customer-engagement-monitoring',
      name: 'Customer Engagement Monitoring',
      behavioralMetric: 'Customer Engagement Cues',
      description: 'Notice and track changes in customer engagement, including participation, energy, and forward-looking behavior.',
      showsUpWhen: 'Often shows up when a seller notices changes in participation, energy, or forward-looking questions.',
      examples: [
        'Notices shifts in customer talk-time',
        'Responds to changes in energy level',
        'Recognizes buying signals',
        'Tracks engagement patterns',
      ],
      icon: 'Activity',
      color: 'hsl(30, 100%, 50%)',
      category: 'engagement',
    },
    {
      id: 'objection-navigation',
      name: 'Objection Navigation',
      behavioralMetric: 'Objection Handling',
      description: 'Respond to resistance calmly by acknowledging concerns and exploring what is behind them.',
      showsUpWhen: 'Often shows up when a seller acknowledges a concern before exploring it.',
      examples: [
        'Calm, non-defensive response to objections',
        'Acknowledges concern first',
        'Explores root cause of resistance',
        'Avoids immediate counter-arguments',
      ],
      icon: 'Shield',
      color: 'hsl(0, 100%, 50%)',
      category: 'objection',
    },
    {
      id: 'conversation-management',
      name: 'Conversation Management',
      behavioralMetric: 'Conversation Control & Structure',
      description: 'Guide a conversation with purpose through structure, transitions, and shared understanding.',
      showsUpWhen: 'Often shows up when a seller summarizes, transitions, or clarifies next steps.',
      examples: [
        'Clear purpose-setting at start',
        'Smooth transitions between topics',
        'Summarizes for alignment',
        'Manages time effectively',
      ],
      icon: 'Map',
      color: 'hsl(200, 100%, 45%)',
      category: 'management',
    },
    {
      id: 'adaptive-response',
      name: 'Adaptive Response',
      behavioralMetric: 'Adaptability',
      description: 'Adjust tone, depth, pacing, or approach in response to changing customer signals.',
      showsUpWhen: 'Often shows up when a seller shifts their approach as signals change.',
      examples: [
        'Adjusts tone based on customer mood',
        'Varies depth based on technical expertise',
        'Changes pacing when needed',
        'Shifts from technical to strategic',
      ],
      icon: 'Zap',
      color: 'hsl(45, 100%, 50%)',
      category: 'adaptation',
    },
    {
      id: 'commitment-generation',
      name: 'Commitment Generation',
      behavioralMetric: 'Commitment Gaining',
      description: 'Secure clear, voluntary next actions while preserving autonomy.',
      showsUpWhen: 'Often shows up when a seller checks readiness and aligns on next steps.',
      examples: [
        'Secures voluntary next actions',
        'Checks readiness before asking',
        'Confirms mutual understanding',
        'Preserves customer autonomy',
      ],
      icon: 'CheckSquare',
      color: 'hsl(120, 100%, 40%)',
      category: 'commitment',
    },
  ];

  const oldMetrics = [
    'Empathy Accuracy',
    'Clarity & Alignment',
    'Compliance',
    'Discovery Depth',
    'Objection Handling',
    'Confidence',
    'Active Listening',
    'Adaptive Communication',
    'Action Insight',
    'Resilience',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-2 border-yellow-400 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Signal Intelligence Capabilities - Review Required
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Platform Repository: <code className="bg-gray-100 px-2 py-1 rounded">ReflectivEI/dev_projects_full-build2</code>
                </p>
                <p className="text-gray-600">
                  Branch: <code className="bg-gray-100 px-2 py-1 rounded">signal-intelligence-implementation-20260112</code>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-red-600">❌ REMOVING (10 metrics)</span>
                </h3>
                <ul className="space-y-1">
                  {oldMetrics.map((metric) => (
                    <li key={metric} className="text-sm text-gray-700 line-through">
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-green-600">✅ ADDING (8 capabilities)</span>
                </h3>
                <ul className="space-y-1">
                  {capabilities.map((cap) => (
                    <li key={cap.id} className="text-sm text-gray-700 font-medium">
                      {cap.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TypeScript Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">📋 New TypeScript Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {newInterface}
            </pre>
          </CardContent>
        </Card>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {capabilities.map((capability, index) => (
            <Card key={capability.id} className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2" style={{ backgroundColor: capability.color }}>
                      {index + 1} of 8
                    </Badge>
                    <CardTitle className="text-xl">{capability.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Behavioral Metric: <span className="font-semibold">{capability.behavioralMetric}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Description:</h4>
                  <p className="text-sm text-gray-700">{capability.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Shows Up When:</h4>
                  <p className="text-sm text-gray-700">{capability.showsUpWhen}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Conversation Examples:</h4>
                  <ul className="space-y-1">
                    {capability.examples.map((example, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: <code className="bg-gray-100 px-1 rounded">{capability.id}</code></span>
                    <span>Icon: <code className="bg-gray-100 px-1 rounded">{capability.icon}</code></span>
                    <span>Category: <code className="bg-gray-100 px-1 rounded">{capability.category}</code></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approval Section */}
        <Card className="border-4 border-green-500 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-2xl flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              Your Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Please Confirm:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Interface structure is correct</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>8 capabilities match marketing site definitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Descriptions and examples are accurate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Ready to apply changes to <code className="bg-gray-100 px-2 py-1 rounded">client/src/lib/data.ts</code></span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Once Approved, I Will:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Apply interface and array changes to platform repository</li>
                  <li>Run TypeScript type check</li>
                  <li>Commit with detailed message</li>
                  <li>Push to branch: <code className="bg-white px-1 rounded">signal-intelligence-implementation-20260112</code></li>
                  <li>Proceed to Phase 2 (UI component updates)</li>
                </ol>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-500">
                <p className="text-center text-xl font-bold text-gray-900">
                  Type <span className="text-green-600">"APPROVED"</span> to proceed with implementation
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Or provide feedback for adjustments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
