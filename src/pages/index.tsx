import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Brain, MessageSquare, Loader2, Sparkles } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to ReflectivAI! I\'m your AI coach here to help you develop your emotional intelligence and sales skills. How can I assist you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Cloudflare Worker directly
      const workerUrl = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';
      
      console.log('[ReflectivAI] Calling worker:', workerUrl);
      
      const response = await fetch(`${workerUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: sessionId,
          mode: 'sales-coach',
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || data.message || 'I apologize, but I encountered an error. Please try again.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ReflectivAI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your AI-Powered Emotional Intelligence Coach
          </p>
        </div>

        {/* Chat Card */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Coach Chat
              <Badge variant="secondary" className="ml-auto">
                <Sparkles className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground border'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3 border">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 bg-muted/30">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="lg"
                  className="px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Emotional Intelligence</h3>
            <p className="text-sm text-muted-foreground">Develop self-awareness and empathy</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Sales Coaching</h3>
            <p className="text-sm text-muted-foreground">Practice conversations and objection handling</p>
          </Card>
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Real-time Feedback</h3>
            <p className="text-sm text-muted-foreground">Get instant insights and suggestions</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
