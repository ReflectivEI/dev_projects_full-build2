import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getChatResponse, 
  translateToSql, 
  getRoleplayResponse, 
  analyzeConversation, 
  analyzeEQPerformance,
  isOpenAIConfigured,
  getKnowledgeAnswer,
  getFrameworkAdvice,
  generateModuleExercise,
  customizeHeuristic,
  getDashboardInsights,
  generateSessionSummary,
  generateTailoredScenarioContent,
  generateDailyFocus,
  generateCoachPrompts
} from "./openai";

// Scenario data is now passed from frontend - no server-side catalog needed

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // API key status endpoint
  app.get("/api/status", async (req, res) => {
    res.json({
      openaiConfigured: isOpenAIConfigured(),
      message: isOpenAIConfigured() 
        ? "AI features are fully enabled" 
        : "AI features are in demo mode. Add your OpenAI API key for full functionality."
    });
  });

  // Today's Focus endpoint
  app.get("/api/daily-focus", async (req, res) => {
    try {
      const focus = await generateDailyFocus();
      res.json(focus);
    } catch (error: any) {
      console.error("Daily focus error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Chat endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/send", async (req, res) => {
    try {
      const { content, context } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Add user message
      const userMessage = await storage.addMessage({
        role: "user",
        content,
        timestamp: Date.now(),
      });

      // Get all messages for context
      const allMessages = await storage.getMessages();
      const chatHistory = allMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Get AI response with optional context - now returns signals too
      const { content: aiContent, signals } = await getChatResponse(chatHistory, context);

      // Add AI response
      const aiMessage = await storage.addMessage({
        role: "assistant",
        content: aiContent,
        timestamp: Date.now(),
      });

      res.json({ userMessage, aiMessage, signals });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/clear", async (req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // FIX: Add missing /api/coach/prompts endpoint to restore conversation starters and suggested topics
  app.post("/api/coach/prompts", async (req, res) => {
    try {
      const { diseaseState, specialty, hcpCategory, influenceDriver } = req.body;
      const prompts = await generateCoachPrompts({
        diseaseState,
        specialty,
        hcpCategory,
        influenceDriver
      });
      res.json(prompts);
    } catch (error: any) {
      console.error("Coach prompts error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // SQL translation endpoints
  app.get("/api/sql/history", async (req, res) => {
    try {
      const queries = await storage.getSqlQueries();
      res.json(queries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sql/translate", async (req, res) => {
    try {
      const { naturalLanguage } = req.body;
      if (!naturalLanguage || typeof naturalLanguage !== "string") {
        return res.status(400).json({ error: "naturalLanguage is required" });
      }

      const { sql, explanation } = await translateToSql(naturalLanguage);

      const query = await storage.addSqlQuery({
        naturalLanguage,
        sqlQuery: sql,
        explanation,
        timestamp: Date.now(),
      });

      res.json(query);
    } catch (error: any) {
      console.error("SQL translation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Roleplay endpoints
  app.get("/api/roleplay/session", async (req, res) => {
    try {
      const session = await storage.getRoleplaySession();
      res.json(session || { messages: [] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/roleplay/start", async (req, res) => {
    try {
      const { scenarioId, scenario, context } = req.body;
      if (!scenarioId || !scenario) {
        return res.status(400).json({ error: "scenarioId and scenario are required" });
      }

      // Validate required scenario fields
      if (!scenario.title || !scenario.stakeholder || !scenario.context || 
          !scenario.objective || !Array.isArray(scenario.challenges)) {
        return res.status(400).json({ error: "Invalid scenario: missing required fields" });
      }

      // Store only validated fields
      const validatedScenario = {
        id: scenario.id,
        title: scenario.title,
        description: scenario.description || "",
        category: scenario.category || "general",
        stakeholder: scenario.stakeholder,
        objective: scenario.objective,
        context: scenario.context,
        challenges: scenario.challenges,
        keyMessages: scenario.keyMessages || [],
        impact: scenario.impact || [],
        suggestedPhrasing: scenario.suggestedPhrasing || [],
        difficulty: scenario.difficulty || "intermediate",
      };

      await storage.startRoleplaySession(scenarioId, validatedScenario, context);

      // Get initial stakeholder greeting with context
      const initialMessage = await getRoleplayResponse(validatedScenario, [], context);
      
      await storage.addRoleplayMessage({
        role: "assistant",
        content: initialMessage,
        timestamp: Date.now(),
      });

      const session = await storage.getRoleplaySession();
      res.json(session);
    } catch (error: any) {
      console.error("Roleplay start error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/roleplay/respond", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: "content is required" });
      }

      const session = await storage.getRoleplaySession();
      if (!session || !session.scenarioId) {
        return res.status(400).json({ error: "No active roleplay session" });
      }

      const scenario = session.scenario;
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found in session" });
      }

      // Add user message
      await storage.addRoleplayMessage({
        role: "user",
        content,
        timestamp: Date.now(),
      });

      // Get updated session with all messages
      const updatedSession = await storage.getRoleplaySession();
      const chatHistory = updatedSession?.messages.map(m => ({
        role: m.role,
        content: m.content,
      })) || [];

      // Get stakeholder response with stored context
      const stakeholderResponse = await getRoleplayResponse(scenario, chatHistory, updatedSession?.context);

      await storage.addRoleplayMessage({
        role: "assistant",
        content: stakeholderResponse,
        timestamp: Date.now(),
      });

      // Get live analysis
      const finalSession = await storage.getRoleplaySession();
      const allMessages = finalSession?.messages.map(m => ({
        role: m.role,
        content: m.content,
      })) || [];

      let analysis = null;
      if (allMessages.length >= 4) {
        analysis = await analyzeConversation(allMessages);
      }

      res.json({ 
        messages: finalSession?.messages || [],
        analysis 
      });
    } catch (error: any) {
      console.error("Roleplay respond error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/roleplay/end", async (req, res) => {
    try {
      const session = await storage.getRoleplaySession();
      if (!session) {
        return res.status(400).json({ error: "No active roleplay session" });
      }

      const messages = session.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Build scenario context for comprehensive analysis
      const scenarioContext = session.scenario ? {
        title: session.scenario.title,
        stakeholder: session.scenario.stakeholder,
        objective: session.scenario.objective,
        challenges: session.scenario.challenges,
      } : undefined;

      const analysis = await analyzeConversation(messages, scenarioContext);
      
      res.json({ 
        messages: session.messages,
        analysis,
        scenario: session.scenario
      });
    } catch (error: any) {
      console.error("Roleplay end error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // EQ-i 2.0 Live Analysis endpoint - Real-time EQ scoring during roleplay
  app.post("/api/roleplay/eq-analysis", async (req, res) => {
    try {
      const session = await storage.getRoleplaySession();
      if (!session) {
        return res.status(400).json({ error: "No active roleplay session" });
      }

      const messages = session.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Build scenario context for the analysis
      const scenarioContext = session.scenario ? {
        title: session.scenario.title,
        stakeholder: session.scenario.stakeholder,
        objective: session.scenario.objective,
        challenges: session.scenario.challenges,
      } : undefined;

      const analysis = await analyzeEQPerformance(messages, scenarioContext);
      
      res.json(analysis);
    } catch (error: any) {
      console.error("EQ analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate tailored scenario content based on context
  app.post("/api/roleplay/tailor", async (req, res) => {
    try {
      const { scenario, diseaseState, hcpProfile } = req.body;
      if (!scenario) {
        return res.status(400).json({ error: "scenario is required" });
      }

      const tailoredContent = await generateTailoredScenarioContent(
        scenario,
        diseaseState,
        hcpProfile
      );

      res.json(tailoredContent);
    } catch (error: any) {
      console.error("Tailored content error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Knowledge Base Q&A endpoint
  app.post("/api/knowledge/ask", async (req, res) => {
    try {
      const { question, articleContext } = req.body;
      if (!question) {
        return res.status(400).json({ error: "question is required" });
      }

      const result = await getKnowledgeAnswer(question, articleContext);
      res.json(result);
    } catch (error: any) {
      console.error("Knowledge Q&A error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Framework Advisor endpoint
  app.post("/api/frameworks/advice", async (req, res) => {
    try {
      const { frameworkId, frameworkName, situation } = req.body;
      if (!frameworkId || !frameworkName || !situation) {
        return res.status(400).json({ error: "frameworkId, frameworkName, and situation are required" });
      }

      const result = await getFrameworkAdvice(frameworkId, frameworkName, situation);
      res.json(result);
    } catch (error: any) {
      console.error("Framework advice error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Module Exercise Generator endpoint
  app.post("/api/modules/exercise", async (req, res) => {
    try {
      const { moduleTitle, moduleDescription, exerciseType } = req.body;
      if (!moduleTitle || !moduleDescription || !exerciseType) {
        return res.status(400).json({ error: "moduleTitle, moduleDescription, and exerciseType are required" });
      }

      const result = await generateModuleExercise(moduleTitle, moduleDescription, exerciseType);
      res.json(result);
    } catch (error: any) {
      console.error("Module exercise error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Heuristics Customizer endpoint
  app.post("/api/heuristics/customize", async (req, res) => {
    try {
      const { templateName, templatePattern, userSituation } = req.body;
      if (!templateName || !templatePattern || !userSituation) {
        return res.status(400).json({ error: "templateName, templatePattern, and userSituation are required" });
      }

      const result = await customizeHeuristic(templateName, templatePattern, userSituation);
      res.json(result);
    } catch (error: any) {
      console.error("Heuristics customization error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard Insights endpoint
  app.get("/api/dashboard/insights", async (req, res) => {
    try {
      const result = await getDashboardInsights();
      res.json(result);
    } catch (error: any) {
      console.error("Dashboard insights error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Session Summary endpoint - Generate key takeaways from coaching conversation
  app.post("/api/chat/summary", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      
      if (messages.length < 2) {
        return res.status(400).json({ error: "Not enough messages to generate a summary. Have a conversation first!" });
      }

      const formattedMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await generateSessionSummary(formattedMessages);
      res.json(result);
    } catch (error: any) {
      console.error("Session summary error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
