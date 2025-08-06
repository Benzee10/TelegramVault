import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBotSchema, insertCampaignSchema, insertTemplateSchema } from "@shared/schema";
import { telegramService } from "./services/telegram";
import { webhookService } from "./services/webhook";
import { aiService } from "./services/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // For demo purposes, using a mock user ID
      const userId = "mock-user-id";
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Bot management routes
  app.get("/api/bots", async (req, res) => {
    try {
      const userId = "mock-user-id";
      const bots = await storage.getBotsByUserId(userId);
      
      // Enhance with subscriber counts
      const botsWithStats = await Promise.all(
        bots.map(async (bot) => {
          const subscribers = await storage.getSubscribersByBotId(bot.id);
          return {
            ...bot,
            subscriberCount: subscribers.filter(s => s.isActive).length,
            status: bot.isActive ? 'online' : 'offline'
          };
        })
      );
      
      res.json(botsWithStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bots" });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const botData = insertBotSchema.parse(req.body);
      const userId = "mock-user-id";
      
      // Validate bot token with Telegram
      const isValid = await telegramService.validateBotToken(botData.token);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid bot token" });
      }

      // Get bot info from Telegram
      const botInfo = await telegramService.getBotInfo(botData.token);
      
      const bot = await storage.createBot({
        ...botData,
        userId,
        username: botInfo.username,
        name: botInfo.first_name,
      });

      // Setup webhook
      const webhookUrl = `${process.env.WEBHOOK_URL || 'https://localhost:5000'}/api/webhook/${bot.id}`;
      await telegramService.setWebhook(botData.token, webhookUrl);
      await storage.updateBot(bot.id, { webhookUrl });

      res.json(bot);
    } catch (error) {
      console.error('Error creating bot:', error);
      res.status(500).json({ error: "Failed to create bot" });
    }
  });

  app.put("/api/bots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const botData = req.body;
      const bot = await storage.updateBot(id, botData);
      res.json(bot);
    } catch (error) {
      res.status(500).json({ error: "Failed to update bot" });
    }
  });

  app.delete("/api/bots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBot(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bot" });
    }
  });

  // Subscriber routes
  app.get("/api/bots/:botId/subscribers", async (req, res) => {
    try {
      const { botId } = req.params;
      const subscribers = await storage.getSubscribersByBotId(botId);
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const userId = "mock-user-id";
      const campaigns = await storage.getCampaignsByUserId(userId);
      
      // Enhance with additional data
      const campaignsWithStats = await Promise.all(
        campaigns.map(async (campaign) => {
          const bot = await storage.getBot(campaign.botId);
          const messages = await storage.getMessagesByCampaignId(campaign.id);
          
          return {
            ...campaign,
            botName: bot?.name || 'Unknown',
            messagesSent: messages.length,
            openRate: '87.3%', // This would be calculated from actual data
          };
        })
      );
      
      res.json(campaignsWithStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const userId = "mock-user-id";
      
      const campaign = await storage.createCampaign({
        ...campaignData,
        userId,
      });
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const userId = "mock-user-id";
      const templates = await storage.getTemplatesByUserId(userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const userId = "mock-user-id";
      
      const template = await storage.createTemplate({
        ...templateData,
        userId,
      });
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  // Webhook endpoint for Telegram updates
  app.post("/api/webhook/:botId", async (req, res) => {
    try {
      const { botId } = req.params;
      const update = req.body;
      
      await webhookService.processUpdate(botId, update);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // AI-powered content generation
  app.post("/api/ai/generate-campaign", async (req, res) => {
    try {
      const { prompt, tone = "friendly" } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      
      const content = await aiService.generateCampaignContent(prompt, tone);
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate campaign content" });
    }
  });

  app.post("/api/ai/improve-template", async (req, res) => {
    try {
      const { content, goals = ["engaging", "clear"] } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }
      
      const improvedContent = await aiService.improveTemplate(content, goals);
      res.json({ content: improvedContent });
    } catch (error) {
      res.status(500).json({ error: "Failed to improve template" });
    }
  });

  // Auto-responder management
  app.get("/api/bots/:botId/auto-responders", async (req, res) => {
    try {
      const { botId } = req.params;
      const autoResponders = await storage.getAutoRespondersByBotId(botId);
      res.json(autoResponders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch auto-responders" });
    }
  });

  app.post("/api/bots/:botId/auto-responders", async (req, res) => {
    try {
      const { botId } = req.params;
      const { trigger, response, priority = 0 } = req.body;
      
      const autoResponder = await storage.createAutoResponder({
        botId,
        trigger,
        response,
        priority,
        isActive: true,
        conditions: {}
      });
      
      res.json(autoResponder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create auto-responder" });
    }
  });

  // Recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = "mock-user-id";
      const bots = await storage.getBotsByUserId(userId);
      const activities = [];
      
      // Get recent messages across all bots
      for (const bot of bots.slice(0, 3)) {
        const messages = await storage.getMessagesByBotId(bot.id, 5);
        for (const message of messages) {
          activities.push({
            id: message.id,
            type: message.direction === 'inbound' ? 'new_subscriber' : 'message_sent',
            description: `Message ${message.direction} via ${bot.name}`,
            timestamp: message.sentAt,
            bot: bot.name,
          });
        }
      }
      
      // Sort by timestamp and limit
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(activities.slice(0, 10));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
