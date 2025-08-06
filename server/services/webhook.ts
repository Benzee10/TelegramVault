import { storage } from "../storage";
import { telegramService } from "./telegram";
import { aiService } from "./ai";

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: any;
  inline_query?: any;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

class WebhookService {
  async processUpdate(botId: string, update: TelegramUpdate): Promise<void> {
    try {
      const bot = await storage.getBot(botId);
      if (!bot || !bot.isActive) {
        console.log(`Bot ${botId} not found or inactive`);
        return;
      }

      if (update.message) {
        await this.processMessage(bot, update.message);
      }

      if (update.callback_query) {
        await this.processCallbackQuery(bot, update.callback_query);
      }
    } catch (error) {
      console.error('Error processing webhook update:', error);
    }
  }

  private async processMessage(bot: any, message: TelegramMessage): Promise<void> {
    const telegramId = message.from.id.toString();
    
    // Find or create subscriber
    let subscriber = await storage.getSubscriberByTelegramId(bot.id, telegramId);
    
    if (!subscriber) {
      // New subscriber - create with opt-in
      subscriber = await storage.createSubscriber({
        botId: bot.id,
        telegramId,
        firstName: message.from.first_name,
        lastName: message.from.last_name,
        username: message.from.username,
        languageCode: message.from.language_code,
        optedIn: true,
        optedInAt: new Date(),
        isActive: true,
      });

      // Send welcome message
      await telegramService.sendMessage(
        bot.token,
        telegramId,
        "Welcome! You've been subscribed to our updates. Reply 'STOP' anytime to unsubscribe."
      );
    } else {
      // Update last interaction
      await storage.updateSubscriber(subscriber.id, {
        lastInteraction: new Date(),
      });
    }

    // Store the incoming message
    await storage.createMessage({
      botId: bot.id,
      subscriberId: subscriber.id,
      telegramMessageId: message.message_id.toString(),
      direction: 'inbound',
      content: message.text || '[Non-text message]',
      messageType: 'text',
      status: 'received',
    });

    // Process auto-responders
    await this.processAutoResponders(bot, subscriber, message);
  }

  private async processAutoResponders(bot: any, subscriber: any, message: TelegramMessage): Promise<void> {
    if (!message.text) return;

    const text = message.text.toLowerCase().trim();
    
    // Handle unsubscribe
    if (text === 'stop' || text === 'unsubscribe') {
      await storage.updateSubscriber(subscriber.id, {
        isActive: false,
        optedIn: false,
      });
      
      await telegramService.sendMessage(
        bot.token,
        subscriber.telegramId,
        "You've been unsubscribed successfully. Thanks for using our service!"
      );
      return;
    }

    // Handle resubscribe
    if (text === 'start' || text === 'subscribe') {
      if (!subscriber.isActive) {
        await storage.updateSubscriber(subscriber.id, {
          isActive: true,
          optedIn: true,
          optedInAt: new Date(),
        });
        
        await telegramService.sendMessage(
          bot.token,
          subscriber.telegramId,
          "Welcome back! You've been resubscribed to our updates."
        );
      }
      return;
    }

    // Get auto-responders for this bot
    const autoResponders = await storage.getAutoRespondersByBotId(bot.id);
    let respondedWithAutoResponder = false;
    
    // Check for keyword-based auto-responders first
    for (const responder of autoResponders) {
      if (!responder.isActive) continue;
      
      const trigger = responder.trigger.toLowerCase();
      
      // Simple keyword matching
      if (text.includes(trigger) || text === trigger) {
        await telegramService.sendMessage(
          bot.token,
          subscriber.telegramId,
          responder.response
        );
        
        // Store the outbound message
        await storage.createMessage({
          botId: bot.id,
          subscriberId: subscriber.id,
          direction: 'outbound',
          content: responder.response,
          messageType: 'text',
          status: 'sent',
        });
        
        respondedWithAutoResponder = true;
        break; // Only respond to first matching trigger
      }
    }

    // If no auto-responder matched, try AI-powered response
    if (!respondedWithAutoResponder) {
      await this.handleAiAutoResponse(bot, subscriber, message);
    }
  }

  private async handleAiAutoResponse(bot: any, subscriber: any, message: TelegramMessage): Promise<void> {
    try {
      // Get recent conversation context
      const recentMessages = await storage.getMessagesByBotId(bot.id, 5);
      const contextMessages = recentMessages
        .filter(msg => msg.subscriberId === subscriber.id)
        .map(msg => `${msg.direction}: ${msg.content}`)
        .reverse();

      const subscriberName = subscriber.firstName || subscriber.username || 'there';
      
      const aiResponse = await aiService.generateAutoResponse(
        message.text || '',
        {
          botName: bot.name,
          subscriberName,
          previousMessages: contextMessages,
          botPurpose: bot.description || 'Customer support and engagement'
        }
      );

      // Send AI-generated response
      await telegramService.sendMessage(
        bot.token,
        subscriber.telegramId,
        aiResponse
      );

      // Store the AI response
      await storage.createMessage({
        botId: bot.id,
        subscriberId: subscriber.id,
        direction: 'outbound',
        content: aiResponse,
        messageType: 'text',
        status: 'sent',
        metadata: { generatedBy: 'ai', model: 'gemini' }
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback to a simple acknowledgment
      const fallbackResponse = "Thanks for your message! We've received it and will get back to you soon.";
      
      await telegramService.sendMessage(
        bot.token,
        subscriber.telegramId,
        fallbackResponse
      );

      await storage.createMessage({
        botId: bot.id,
        subscriberId: subscriber.id,
        direction: 'outbound',
        content: fallbackResponse,
        messageType: 'text',
        status: 'sent',
        metadata: { generatedBy: 'fallback' }
      });
    }
  }

  private async processCallbackQuery(bot: any, callbackQuery: any): Promise<void> {
    // Handle inline keyboard button presses
    console.log('Callback query received:', callbackQuery);
  }
}

export const webhookService = new WebhookService();
