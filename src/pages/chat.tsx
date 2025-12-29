import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const conversationStarters = [
  {
    title: 'Practice Objection Handling',
    prompt: 'Help me practice handling common objections about pricing and value.',
  },
  {
    title: 'Improve Opening Statement',
    prompt: 'Review my opening statement and suggest improvements for better engagement.',
  },
  {
    title: 'Stakeholder Mapping',
    prompt: 'Help me identify key stakeholders and their influence drivers for my territory.',
  },
  {
    title: 'Call Planning',
    prompt: 'Guide me through planning my next high-stakes call with a KOL.',
  },
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if we're starting a roleplay scenario
  useEffect(() => {
    const scenarioId = searchParams.get('scenario');
    const scenarioTitle = searchParams.get('title');
    
    if (scenarioId && scenarioTitle) {
      // Initialize with scenario context
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Welcome to the roleplay scenario: "${decodeURIComponent(scenarioTitle)}". I'll be playing the role of the healthcare professional. Let's begin when you're ready. How would you like to start this conversation?`,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get scenario context if available
      const scenarioId = searchParams.get('scenario');
      const scenarioTitle = searchParams.get('title');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: input,
          scenarioId,
          scenarioTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  const handleStarterClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold">AI Coach</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Get personalized coaching and practice your sales skills with AI-powered feedback
            </p>
          </div>
        </div>
      </section>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-4 py-8 h-full">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Start a Conversation</h2>
                      <p className="text-muted-foreground">
                        Choose a conversation starter below or type your own message
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conversationStarters.map((starter, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                          onClick={() => handleStarterClick(starter.prompt)}
                        >
                          <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">{starter.title}</h3>
                            <p className="text-sm text-muted-foreground">{starter.prompt}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === 'user'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border pt-4">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                    className="min-h-[60px] max-h-[200px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="lg"
                    className="px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  AI Coach provides practice scenarios and feedback. Responses are generated by AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
