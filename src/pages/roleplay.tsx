import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { detectObservableCues } from '@/lib/observable-cues';
import { CueBadgeGroup } from '@/components/CueBadge';
import { User, Bot, Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cues?: ReturnType<typeof detectObservableCues>;
}

const SCENARIOS = [
  {
    id: 'busy-hcp',
    title: 'Busy HCP',
    description: 'Time-pressured physician with back-to-back appointments',
    initialMessage: "I appreciate you stopping by, but I only have a few minutes between patients. What's this about?",
  },
  {
    id: 'skeptical-hcp',
    title: 'Skeptical HCP',
    description: 'Evidence-focused physician who questions new treatments',
    initialMessage: "I've heard about this before. What makes your approach different from what's already available?",
  },
  {
    id: 'engaged-hcp',
    title: 'Engaged HCP',
    description: 'Curious physician actively seeking better treatment options',
    initialMessage: "I'm always interested in learning about new treatment options. Tell me more about the clinical evidence.",
  },
];

const HCP_RESPONSES = [
  "*sighs* I really don't have time for this right now. Can you send me some information?",
  "That's interesting, but I'm already comfortable with my current treatment protocol.",
  "I'd need to see more data before considering a change. What does the evidence show?",
  "*glances at clock* I have another patient waiting. Can we schedule a follow-up?",
  "I'm hesitant to try something new without more peer-reviewed studies.",
];

export default function RoleplayPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    const initialMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: scenario.initialMessage,
      cues: detectObservableCues(scenario.initialMessage),
    };

    setSelectedScenario(scenarioId);
    setMessages([initialMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate HCP response
    setTimeout(() => {
      const hcpResponse = HCP_RESPONSES[Math.floor(Math.random() * HCP_RESPONSES.length)];
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: hcpResponse,
        cues: detectObservableCues(hcpResponse),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setMessages([]);
    setInput('');
  };

  if (!selectedScenario) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">HCP Roleplay Simulator</h1>
            <p className="text-muted-foreground">
              Practice your communication skills with realistic HCP scenarios. Behavioral cues will appear below HCP messages to help you recognize and respond to signals.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SCENARIOS.map((scenario) => (
              <Card key={scenario.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => startScenario(scenario.id)}>
                <CardHeader>
                  <CardTitle>{scenario.title}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Scenario</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenario);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentScenario?.title}</h1>
            <p className="text-sm text-muted-foreground">{currentScenario?.description}</p>
          </div>
          <Button variant="outline" onClick={resetScenario}>
            End Scenario
          </Button>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.role === 'user' ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-secondary-foreground" />}
                    </div>
                    <div>
                      <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.cues && message.cues.length > 0 && (
                        <div className="mt-2">
                          <CueBadgeGroup cues={message.cues} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">HCP is responding...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="min-h-[80px]"
          />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon" className="h-[80px] w-[80px]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
