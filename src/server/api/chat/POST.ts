import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default async function handler(req: Request, res: Response) {
  try {
    const { messages } = req.body as { messages: Message[] };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // System prompt for ReflectivAI coach
    const systemPrompt: Message = {
      role: 'system',
      content: `You are ReflectivAI, an expert AI coach specializing in emotional intelligence (EI) and sales coaching. Your role is to:

1. Help users develop their emotional intelligence through:
   - Self-awareness exercises
   - Empathy building
   - Emotional regulation techniques
   - Social skills development

2. Provide sales coaching including:
   - Objection handling strategies
   - Conversation practice
   - Relationship building techniques
   - Persuasion and influence skills

3. Offer real-time feedback and actionable insights

4. Be supportive, encouraging, and professional

5. Ask thoughtful questions to help users reflect on their experiences

Respond in a warm, coaching tone. Keep responses concise but insightful (2-4 paragraphs). Use specific examples when helpful.`
    };

    const fullMessages = [systemPrompt, ...messages];

    // Try to use OpenAI if API key is available
    const openaiKey = getSecret('OPENAI_API_KEY');
    
    if (openaiKey) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
          return res.json({ message: aiMessage });
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
        // Fall through to mock responses
      }
    }

    // Fallback to intelligent mock responses
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const response = generateCoachResponse(lastUserMessage);

    res.json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      message: 'I apologize, but I encountered an error. Please try again.' 
    });
  }
}

function generateCoachResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Emotional Intelligence topics
  if (lowerMessage.includes('emotion') || lowerMessage.includes('feeling') || lowerMessage.includes('empathy')) {
    return `Great question about emotional intelligence! Understanding and managing emotions is crucial for both personal and professional success.

Emotional intelligence involves four key areas: self-awareness (recognizing your emotions), self-management (controlling your reactions), social awareness (understanding others' emotions), and relationship management (building strong connections).

What specific aspect of emotional intelligence would you like to explore? Are you looking to improve self-awareness, handle difficult emotions, or better understand others?`;
  }

  // Sales coaching
  if (lowerMessage.includes('sales') || lowerMessage.includes('objection') || lowerMessage.includes('customer') || lowerMessage.includes('client')) {
    return `Excellent! Sales success is deeply connected to emotional intelligence. The best salespeople are those who can read the room, build genuine rapport, and handle objections with empathy.

When facing objections, remember the LAER framework: Listen actively, Acknowledge their concern, Explore the underlying issue, and Respond with value. This shows you respect their perspective while addressing their needs.

Would you like to practice handling a specific objection, or explore techniques for building stronger client relationships?`;
  }

  // Stress or difficult situations
  if (lowerMessage.includes('stress') || lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('struggle')) {
    return `I hear you - dealing with challenging situations requires both emotional awareness and practical strategies.

When you're feeling stressed, try the STOP technique: Stop what you're doing, Take a breath, Observe your thoughts and feelings without judgment, and Proceed with intention. This creates space between stimulus and response.

What's the specific situation you're facing? Understanding the context will help me provide more targeted guidance.`;
  }

  // Communication
  if (lowerMessage.includes('communicate') || lowerMessage.includes('conversation') || lowerMessage.includes('talk')) {
    return `Communication is at the heart of emotional intelligence! Effective communication isn't just about what you say, but how you say it and how well you listen.

Key principles include: active listening (truly hearing, not just waiting to speak), asking open-ended questions, using "I" statements to express feelings, and being mindful of non-verbal cues.

What communication challenge are you currently facing? I'd love to help you work through it.`;
  }

  // Practice or roleplay
  if (lowerMessage.includes('practice') || lowerMessage.includes('roleplay') || lowerMessage.includes('scenario')) {
    return `Practice is essential for developing these skills! I'd be happy to help you practice through roleplay scenarios.

We can work on: sales conversations, difficult discussions with colleagues, handling objections, giving feedback, or any other interpersonal situation you'd like to improve.

What scenario would you like to practice? Give me some context about the situation and who you'll be interacting with.`;
  }

  // Default coaching response
  return `Thank you for sharing that with me. I'm here to help you develop your emotional intelligence and professional skills.

I can assist you with:
• Emotional intelligence development (self-awareness, empathy, emotional regulation)
• Sales coaching and objection handling
• Communication skills and difficult conversations
• Stress management and resilience building
• Practice scenarios and roleplay

What would be most helpful for you right now? Feel free to share a specific situation or challenge you're facing.`;
}
