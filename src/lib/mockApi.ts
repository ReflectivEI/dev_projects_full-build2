// Mock API for GitHub Pages deployment (no backend available)
// This provides mock responses for all API endpoints

export const MOCK_API_ENABLED = true; // Set to false when Cloudflare Worker is deployed

interface MockResponse {
  status: number;
  data: any;
  headers?: Record<string, string>;
}

let mockSessionId = 'mock-session-' + Math.random().toString(36).substring(7);

export function getMockSessionId(): string {
  return mockSessionId;
}

export async function mockApiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<MockResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Parse the URL to get the endpoint
  const path = url.replace(/^https?:\/\/[^\/]+/, '');

  // Route to appropriate mock handler
  if (path === '/api/status' || path === '/status') {
    return {
      status: 200,
      data: {
        openaiConfigured: false,
        message: 'Demo Mode - Using mock data (GitHub Pages deployment)'
      },
      headers: { 'x-session-id': mockSessionId }
    };
  }

  if (path === '/api/health' || path === '/health') {
    return {
      status: 200,
      data: { status: 'ok', mode: 'mock' },
      headers: { 'x-session-id': mockSessionId }
    };
  }

  if (path === '/api/dashboard/insights' || path === '/dashboard/insights') {
    return {
      status: 200,
      data: {
        totalSessions: 42,
        avgEQScore: 78,
        improvementRate: 15,
        topSkills: ['Active Listening', 'Empathy', 'Rapport Building']
      },
      headers: { 'x-session-id': mockSessionId }
    };
  }

  if (path.includes('/api/chat') || path.includes('/chat')) {
    if (method === 'POST') {
      return {
        status: 200,
        data: {
          userMessage: { role: 'user', content: (data as any)?.message || '' },
          aiMessage: {
            role: 'assistant',
            content: 'This is a mock response. Deploy the Cloudflare Worker for full AI functionality.'
          }
        },
        headers: { 'x-session-id': mockSessionId }
      };
    }
  }

  if (path.includes('/api/roleplay') || path.includes('/roleplay')) {
    if (path.includes('/start')) {
      return {
        status: 200,
        data: {
          message: 'Mock roleplay started. Deploy the Cloudflare Worker for full functionality.',
          hcpProfile: {
            name: 'Dr. Mock',
            specialty: 'Demo Mode',
            mood: 'neutral'
          }
        },
        headers: { 'x-session-id': mockSessionId }
      };
    }
  }

  // Default mock response for unknown endpoints
  return {
    status: 200,
    data: { message: 'Mock API response', mode: 'demo' },
    headers: { 'x-session-id': mockSessionId }
  };
}

export function isMockApiEnabled(): boolean {
  return MOCK_API_ENABLED && typeof window !== 'undefined' && window.location.hostname.includes('github.io');
}
