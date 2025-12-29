// Shared in-memory roleplay session store
// In a real app, this would be a database

export type RoleplayMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

export type RoleplaySession = {
  sessionId: string;
  scenarioId: string;
  difficulty: string;
  messages: RoleplayMessage[];
  hcpProfile: {
    name: string;
    specialty: string;
    personality: string;
    concerns: string[];
  };
  startTime: string;
  active: boolean;
};

export const roleplaySessions = new Map<string, RoleplaySession>();

// Initialize a new roleplay session
export function startRoleplaySession(
  sessionId: string,
  scenarioId: string,
  difficulty: string,
  initialMessage: string
): RoleplaySession {
  const session: RoleplaySession = {
    sessionId,
    scenarioId,
    difficulty,
    messages: [
      {
        id: 'hcp-initial',
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date().toISOString()
      }
    ],
    hcpProfile: {
      name: 'Dr. Sarah Mitchell',
      specialty: 'Cardiology',
      personality: 'Analytical and detail-oriented',
      concerns: ['Efficacy data', 'Patient safety', 'Cost-effectiveness']
    },
    startTime: new Date().toISOString(),
    active: true
  };
  
  roleplaySessions.set(sessionId, session);
  return session;
}

// Get active session
export function getActiveSession(sessionId: string): RoleplaySession | null {
  return roleplaySessions.get(sessionId) || null;
}

// Add message to session
export function addMessageToSession(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const session = roleplaySessions.get(sessionId);
  if (session) {
    session.messages.push({
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date().toISOString()
    });
  }
}

// End session
export function endRoleplaySession(sessionId: string): void {
  const session = roleplaySessions.get(sessionId);
  if (session) {
    session.active = false;
  }
}

// Clear session
export function clearRoleplaySession(sessionId: string): void {
  roleplaySessions.delete(sessionId);
}
