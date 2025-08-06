interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

class TelegramService {
  private async makeRequest<T>(
    token: string,
    method: string,
    data?: any
  ): Promise<TelegramApiResponse<T>> {
    const url = `https://api.telegram.org/bot${token}/${method}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return await response.json();
  }

  async validateBotToken(token: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<TelegramBotInfo>(token, 'getMe');
      return response.ok && response.result.is_bot;
    } catch (error) {
      console.error('Error validating bot token:', error);
      return false;
    }
  }

  async getBotInfo(token: string): Promise<TelegramBotInfo> {
    const response = await this.makeRequest<TelegramBotInfo>(token, 'getMe');
    if (!response.ok) {
      throw new Error(`Failed to get bot info: ${response.description}`);
    }
    return response.result;
  }

  async setWebhook(token: string, url: string): Promise<boolean> {
    const response = await this.makeRequest<boolean>(token, 'setWebhook', {
      url,
      allowed_updates: ['message', 'callback_query', 'inline_query'],
    });
    
    if (!response.ok) {
      console.error('Failed to set webhook:', response.description);
      return false;
    }
    
    return true;
  }

  async sendMessage(token: string, chatId: string, text: string, options?: any): Promise<any> {
    const response = await this.makeRequest(token, 'sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.description}`);
    }
    
    return response.result;
  }

  async sendBulkMessages(
    token: string,
    recipients: string[],
    text: string,
    options?: any
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    // Implement rate limiting - Telegram allows 30 messages per second
    const BATCH_SIZE = 30;
    const DELAY_MS = 1000;
    
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (chatId) => {
          try {
            await this.sendMessage(token, chatId, text, options);
            success++;
          } catch (error) {
            console.error(`Failed to send message to ${chatId}:`, error);
            failed++;
          }
        })
      );
      
      // Wait before next batch if not the last batch
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }
    
    return { success, failed };
  }
}

export const telegramService = new TelegramService();
