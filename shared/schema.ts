import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bots = pgTable("bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  token: text("token").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  webhookUrl: text("webhook_url"),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  telegramId: text("telegram_id").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  languageCode: text("language_code"),
  isActive: boolean("is_active").default(true),
  optedIn: boolean("opted_in").default(false),
  optedInAt: timestamp("opted_in_at"),
  lastInteraction: timestamp("last_interaction"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  message: text("message").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, sending, completed, cancelled
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  targetAudience: jsonb("target_audience").default({}),
  statistics: jsonb("statistics").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  category: text("category").default("general"),
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  subscriberId: varchar("subscriber_id").references(() => subscribers.id, { onDelete: "cascade" }),
  campaignId: varchar("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  telegramMessageId: text("telegram_message_id"),
  direction: text("direction").notNull(), // inbound, outbound
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // text, photo, video, document, etc.
  status: text("status").default("sent"), // sent, delivered, read, failed
  metadata: jsonb("metadata").default({}),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const autoResponders = pgTable("auto_responders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  trigger: text("trigger").notNull(), // keyword, command, or pattern
  response: text("response").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),
  conditions: jsonb("conditions").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: varchar("bot_id").notNull().references(() => bots.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  messagesSent: integer("messages_sent").default(0),
  messagesReceived: integer("messages_received").default(0),
  newSubscribers: integer("new_subscribers").default(0),
  unsubscribes: integer("unsubscribes").default(0),
  engagementRate: integer("engagement_rate").default(0), // stored as percentage * 100
  metadata: jsonb("metadata").default({}),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bots: many(bots),
  campaigns: many(campaigns),
  templates: many(templates),
}));

export const botsRelations = relations(bots, ({ one, many }) => ({
  user: one(users, { fields: [bots.userId], references: [users.id] }),
  subscribers: many(subscribers),
  campaigns: many(campaigns),
  messages: many(messages),
  autoResponders: many(autoResponders),
  analytics: many(analytics),
}));

export const subscribersRelations = relations(subscribers, ({ one, many }) => ({
  bot: one(bots, { fields: [subscribers.botId], references: [bots.id] }),
  messages: many(messages),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  bot: one(bots, { fields: [campaigns.botId], references: [bots.id] }),
  user: one(users, { fields: [campaigns.userId], references: [users.id] }),
  messages: many(messages),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(users, { fields: [templates.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  bot: one(bots, { fields: [messages.botId], references: [bots.id] }),
  subscriber: one(subscribers, { fields: [messages.subscriberId], references: [subscribers.id] }),
  campaign: one(campaigns, { fields: [messages.campaignId], references: [campaigns.id] }),
}));

export const autoRespondersRelations = relations(autoResponders, ({ one }) => ({
  bot: one(bots, { fields: [autoResponders.botId], references: [bots.id] }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  bot: one(bots, { fields: [analytics.botId], references: [bots.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBotSchema = createInsertSchema(bots).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTemplateSchema = createInsertSchema(templates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, sentAt: true });
export const insertAutoResponderSchema = createInsertSchema(autoResponders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type AutoResponder = typeof autoResponders.$inferSelect;
export type InsertAutoResponder = z.infer<typeof insertAutoResponderSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
