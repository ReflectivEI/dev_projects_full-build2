/**
 * Shared schema types for the application
 */

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  diseaseState?: string;
  specialty?: string;
  hcpCategory?: string;
  influenceDriver?: string;
  objectives?: string[];
  challenges?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CoachingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
  objectives?: string[];
  content?: any;
}

export interface EQFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  principles?: any[];
  techniques?: any[];
}

export interface HeuristicTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  principles?: any[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  content?: any;
}

export interface SQLQuery {
  id: string;
  title: string;
  description: string;
  query: string;
  category?: string;
}
