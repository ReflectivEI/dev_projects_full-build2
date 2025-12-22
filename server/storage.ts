import type { 
  Message, 
  InsertMessage, 
  SQLQuery, 
  InsertSQLQuery,
  ConversationAnalysis 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Chat messages
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
  
  // SQL queries
  getSqlQueries(): Promise<SQLQuery[]>;
  addSqlQuery(query: InsertSQLQuery): Promise<SQLQuery>;
  
  // Roleplay sessions
  getRoleplaySession(): Promise<{ messages: Message[]; scenarioId?: string; scenario?: any; analysis?: ConversationAnalysis; context?: any } | null>;
  startRoleplaySession(scenarioId: string, scenario: any, context?: any): Promise<void>;
  addRoleplayMessage(message: InsertMessage): Promise<Message>;
  endRoleplaySession(): Promise<ConversationAnalysis>;
  clearRoleplaySession(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Message[] = [];
  private sqlQueries: SQLQuery[] = [];
  private roleplaySession: {
    messages: Message[];
    scenarioId?: string;
    scenario?: any;
    analysis?: ConversationAnalysis;
    context?: any;
  } | null = null;

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      ...insertMessage,
      id: randomUUID(),
    };
    this.messages.push(message);
    return message;
  }

  async clearMessages(): Promise<void> {
    this.messages = [];
  }

  async getSqlQueries(): Promise<SQLQuery[]> {
    return this.sqlQueries.slice().reverse();
  }

  async addSqlQuery(insertQuery: InsertSQLQuery): Promise<SQLQuery> {
    const query: SQLQuery = {
      ...insertQuery,
      id: randomUUID(),
    };
    this.sqlQueries.push(query);
    return query;
  }

  async getRoleplaySession() {
    return this.roleplaySession;
  }

  async startRoleplaySession(scenarioId: string, scenario: any, context?: any): Promise<void> {
    this.roleplaySession = {
      messages: [],
      scenarioId,
      scenario,
      context,
    };
  }

  async addRoleplayMessage(insertMessage: InsertMessage): Promise<Message> {
    if (!this.roleplaySession) {
      throw new Error("No active roleplay session");
    }
    const message: Message = {
      ...insertMessage,
      id: randomUUID(),
    };
    this.roleplaySession.messages.push(message);
    return message;
  }

  async endRoleplaySession(): Promise<ConversationAnalysis> {
    if (!this.roleplaySession) {
      throw new Error("No active roleplay session");
    }
    
    const analysis: ConversationAnalysis = {
      id: randomUUID(),
      sessionId: randomUUID(),
      overallScore: 75,
      eqMetrics: {
        empathy: 72,
        activeListening: 78,
        rapport: 70,
        communicationAdaptation: 80,
      },
      strengths: [
        "Good use of open-ended questions",
        "Demonstrated active listening",
        "Appropriate clinical knowledge"
      ],
      improvements: [
        "Could acknowledge concerns more directly",
        "Try to mirror stakeholder communication style"
      ],
      recommendations: [
        "Practice the Feel-Felt-Found technique",
        "Review communication style adaptation strategies"
      ],
    };
    
    this.roleplaySession.analysis = analysis;
    return analysis;
  }

  async clearRoleplaySession(): Promise<void> {
    this.roleplaySession = null;
  }
}

export const storage = new MemStorage();
