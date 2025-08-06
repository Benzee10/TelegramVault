import cron from 'node-cron';
import { storage } from '../storage';
import { telegramService } from './telegram';

class SchedulerService {
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();

  init(): void {
    // Check for scheduled campaigns every minute
    cron.schedule('* * * * *', () => {
      this.processPendingCampaigns();
    });

    // Generate daily analytics at midnight
    cron.schedule('0 0 * * *', () => {
      this.generateDailyAnalytics();
    });
  }

  private async processPendingCampaigns(): Promise<void> {
    try {
      const now = new Date();
      
      // This would typically fetch campaigns with status 'scheduled' and scheduledAt <= now
      // For simplicity, we'll implement the basic structure
      
      console.log('Checking for scheduled campaigns...');
      
      // In a real implementation, you would:
      // 1. Fetch scheduled campaigns due for sending
      // 2. Update campaign status to 'sending'
      // 3. Get subscribers for the bot
      // 4. Send messages in batches
      // 5. Update campaign status to 'completed'
      // 6. Store message records
      
    } catch (error) {
      console.error('Error processing pending campaigns:', error);
    }
  }

  private async generateDailyAnalytics(): Promise<void> {
    try {
      console.log('Generating daily analytics...');
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // This would generate analytics for all bots
      // For each bot:
      // 1. Count messages sent/received
      // 2. Count new subscribers
      // 3. Count unsubscribes
      // 4. Calculate engagement rate
      // 5. Store in analytics table
      
    } catch (error) {
      console.error('Error generating daily analytics:', error);
    }
  }

  async scheduleCampaign(campaignId: string, scheduledAt: Date): Promise<void> {
    const cronExpression = this.dateToCron(scheduledAt);
    
    const task = cron.schedule(cronExpression, async () => {
      await this.executeCampaign(campaignId);
      this.scheduledTasks.delete(campaignId);
    }, {
      scheduled: false
    });
    
    this.scheduledTasks.set(campaignId, task);
    task.start();
  }

  private async executeCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        console.error(`Campaign ${campaignId} not found`);
        return;
      }

      const bot = await storage.getBot(campaign.botId);
      if (!bot) {
        console.error(`Bot ${campaign.botId} not found`);
        return;
      }

      // Update campaign status
      await storage.updateCampaign(campaignId, { status: 'sending' });

      // Get active subscribers
      const subscribers = await storage.getSubscribersByBotId(campaign.botId);
      const activeSubscribers = subscribers.filter(s => s.isActive && s.optedIn);

      if (activeSubscribers.length === 0) {
        await storage.updateCampaign(campaignId, { status: 'completed' });
        return;
      }

      // Send messages
      const recipientIds = activeSubscribers.map(s => s.telegramId);
      const result = await telegramService.sendBulkMessages(
        bot.token,
        recipientIds,
        campaign.message
      );

      // Store message records
      for (const subscriber of activeSubscribers) {
        await storage.createMessage({
          botId: campaign.botId,
          subscriberId: subscriber.id,
          campaignId: campaignId,
          direction: 'outbound',
          content: campaign.message,
          messageType: 'text',
          status: 'sent',
        });
      }

      // Update campaign with results
      await storage.updateCampaign(campaignId, {
        status: 'completed',
        sentAt: new Date(),
        statistics: {
          sent: result.success,
          failed: result.failed,
          total: activeSubscribers.length,
        }
      });

    } catch (error) {
      console.error(`Error executing campaign ${campaignId}:`, error);
      await storage.updateCampaign(campaignId, { status: 'failed' });
    }
  }

  private dateToCron(date: Date): string {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    
    return `${minutes} ${hours} ${dayOfMonth} ${month} *`;
  }

  cancelScheduledCampaign(campaignId: string): void {
    const task = this.scheduledTasks.get(campaignId);
    if (task) {
      task.destroy();
      this.scheduledTasks.delete(campaignId);
    }
  }
}

export const schedulerService = new SchedulerService();
