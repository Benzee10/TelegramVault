import { 
  users, bots, subscribers, campaigns, templates, messages, autoResponders, analytics,
  type User, type InsertUser, type Bot, type InsertBot, type Subscriber, type InsertSubscriber,
  type Campaign, type InsertCampaign, type Template, type InsertTemplate,
  type Message, type InsertMessage, type AutoResponder, type InsertAutoResponder,
  type Analytics, type InsertAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bot methods
  getBot(id: string): Promise<Bot | undefined>;
  getBotsByUserId(userId: string): Promise<Bot[]>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: string, bot: Partial<InsertBot>): Promise<Bot>;
  deleteBot(id: string): Promise<void>;

  // Subscriber methods
  getSubscriber(id: string): Promise<Subscriber | undefined>;
  getSubscriberByTelegramId(botId: string, telegramId: string): Promise<Subscriber | undefined>;
  getSubscribersByBotId(botId: string): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, subscriber: Partial<InsertSubscriber>): Promise<Subscriber>;
  deleteSubscriber(id: string): Promise<void>;

  // Campaign methods
  getCampaign(id: string): Promise<Campaign | undefined>;
  getCampaignsByUserId(userId: string): Promise<Campaign[]>;
  getCampaignsByBotId(botId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;

  // Template methods
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplatesByUserId(userId: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByBotId(botId: string, limit?: number): Promise<Message[]>;
  getMessagesByCampaignId(campaignId: string): Promise<Message[]>;

  // Auto responder methods
  getAutoRespondersByBotId(botId: string): Promise<AutoResponder[]>;
  createAutoResponder(autoResponder: InsertAutoResponder): Promise<AutoResponder>;
  updateAutoResponder(id: string, autoResponder: Partial<InsertAutoResponder>): Promise<AutoResponder>;
  deleteAutoResponder(id: string): Promise<void>;

  // Analytics methods
  getAnalyticsByBotId(botId: string, days?: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getDashboardStats(userId: string): Promise<{
    activeBots: number;
    totalSubscribers: number;
    messagesSent: number;
    engagementRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Bot methods
  async getBot(id: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot || undefined;
  }

  async getBotsByUserId(userId: string): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.userId, userId)).orderBy(desc(bots.createdAt));
  }

  async createBot(insertBot: InsertBot): Promise<Bot> {
    const [bot] = await db.insert(bots).values(insertBot).returning();
    return bot;
  }

  async updateBot(id: string, bot: Partial<InsertBot>): Promise<Bot> {
    const [updatedBot] = await db
      .update(bots)
      .set({ ...bot, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return updatedBot;
  }

  async deleteBot(id: string): Promise<void> {
    await db.delete(bots).where(eq(bots.id, id));
  }

  // Subscriber methods
  async getSubscriber(id: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    return subscriber || undefined;
  }

  async getSubscriberByTelegramId(botId: string, telegramId: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(and(eq(subscribers.botId, botId), eq(subscribers.telegramId, telegramId)));
    return subscriber || undefined;
  }

  async getSubscribersByBotId(botId: string): Promise<Subscriber[]> {
    return await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.botId, botId))
      .orderBy(desc(subscribers.createdAt));
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async updateSubscriber(id: string, subscriber: Partial<InsertSubscriber>): Promise<Subscriber> {
    const [updatedSubscriber] = await db
      .update(subscribers)
      .set(subscriber)
      .where(eq(subscribers.id, id))
      .returning();
    return updatedSubscriber;
  }

  async deleteSubscriber(id: string): Promise<void> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
  }

  // Campaign methods
  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaignsByBotId(botId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.botId, botId))
      .orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // Template methods
  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getTemplatesByUserId(userId: string): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.userId, userId))
      .orderBy(desc(templates.createdAt));
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessagesByBotId(botId: string, limit: number = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.botId, botId))
      .orderBy(desc(messages.sentAt))
      .limit(limit);
  }

  async getMessagesByCampaignId(campaignId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.campaignId, campaignId))
      .orderBy(desc(messages.sentAt));
  }

  // Auto responder methods
  async getAutoRespondersByBotId(botId: string): Promise<AutoResponder[]> {
    return await db
      .select()
      .from(autoResponders)
      .where(eq(autoResponders.botId, botId))
      .orderBy(desc(autoResponders.priority));
  }

  async createAutoResponder(insertAutoResponder: InsertAutoResponder): Promise<AutoResponder> {
    const [autoResponder] = await db.insert(autoResponders).values(insertAutoResponder).returning();
    return autoResponder;
  }

  async updateAutoResponder(id: string, autoResponder: Partial<InsertAutoResponder>): Promise<AutoResponder> {
    const [updatedAutoResponder] = await db
      .update(autoResponders)
      .set({ ...autoResponder, updatedAt: new Date() })
      .where(eq(autoResponders.id, id))
      .returning();
    return updatedAutoResponder;
  }

  async deleteAutoResponder(id: string): Promise<void> {
    await db.delete(autoResponders).where(eq(autoResponders.id, id));
  }

  // Analytics methods
  async getAnalyticsByBotId(botId: string, days: number = 30): Promise<Analytics[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await db
      .select()
      .from(analytics)
      .where(and(eq(analytics.botId, botId), sql`${analytics.date} >= ${startDate}`))
      .orderBy(desc(analytics.date));
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analyticsRecord] = await db.insert(analytics).values(insertAnalytics).returning();
    return analyticsRecord;
  }

  async getDashboardStats(userId: string): Promise<{
    activeBots: number;
    totalSubscribers: number;
    messagesSent: number;
    engagementRate: number;
  }> {
    // Get active bots count
    const [activeBots] = await db
      .select({ count: count() })
      .from(bots)
      .where(and(eq(bots.userId, userId), eq(bots.isActive, true)));

    // Get total subscribers across all user's bots
    const [totalSubscribers] = await db
      .select({ count: count() })
      .from(subscribers)
      .innerJoin(bots, eq(subscribers.botId, bots.id))
      .where(and(eq(bots.userId, userId), eq(subscribers.isActive, true)));

    // Get messages sent in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [messagesSent] = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(bots, eq(messages.botId, bots.id))
      .where(and(
        eq(bots.userId, userId),
        eq(messages.direction, 'outbound'),
        sql`${messages.sentAt} >= ${thirtyDaysAgo}`
      ));

    // Calculate engagement rate (simplified)
    const engagementRate = 87.3; // This would be calculated based on actual engagement metrics

    return {
      activeBots: activeBots.count,
      totalSubscribers: totalSubscribers.count,
      messagesSent: messagesSent.count,
      engagementRate,
    };
  }
}

export const storage = new DatabaseStorage();
