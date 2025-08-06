import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ConversationContext {
  botName: string;
  subscriberName: string;
  previousMessages?: string[];
  botPurpose?: string;
}

class AiService {
  async generateAutoResponse(
    incomingMessage: string,
    context: ConversationContext
  ): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        // Fallback to simple responses if no API key
        return this.getSimpleResponse(incomingMessage);
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const userMessage = this.buildUserMessage(incomingMessage, context);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }
        ],
      });

      return response.text || this.getSimpleResponse(incomingMessage);
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getSimpleResponse(incomingMessage);
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    return `You are ${context.botName}, a helpful and friendly Telegram bot assistant. 
    
Your role:
- Provide helpful, accurate, and engaging responses
- Be conversational but professional
- Keep responses concise (1-3 sentences max)
- Show personality while being respectful
- If asked about services or products, provide helpful information
- Always prioritize user privacy and data protection

Bot Purpose: ${context.botPurpose || 'General customer support and engagement'}

Guidelines:
- Be warm and welcoming to new subscribers
- Provide clear, actionable information
- If you don't know something, be honest about it
- Encourage engagement but respect user preferences
- Never ask for sensitive personal information
- Always offer ways users can get more help if needed

Remember: You're representing a legitimate business that respects user consent and privacy.`;
  }

  private buildUserMessage(incomingMessage: string, context: ConversationContext): string {
    let message = `User ${context.subscriberName} sent: "${incomingMessage}"`;
    
    if (context.previousMessages && context.previousMessages.length > 0) {
      message += `\n\nRecent conversation context:\n${context.previousMessages.join('\n')}`;
    }
    
    message += '\n\nPlease provide a helpful, engaging response:';
    return message;
  }

  private getSimpleResponse(incomingMessage: string): string {
    const message = incomingMessage.toLowerCase().trim();
    
    // Simple keyword-based responses as fallback
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! What specific question can I assist you with?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! Feel free to reach out if you need anything else.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Thanks for reaching out. How can I assist you today?";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! Have a great day, and don't hesitate to contact us if you need anything.";
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return "For pricing information, please let me know what specific service you're interested in and I'll be happy to help!";
    }
    
    if (message.includes('hours') || message.includes('open')) {
      return "Our support team is available to help you. What would you like to know?";
    }
    
    // Default response
    return "Thanks for your message! I understand you're reaching out about this topic. How can I best assist you?";
  }

  async generateCampaignContent(
    prompt: string,
    tone: 'professional' | 'friendly' | 'promotional' = 'friendly'
  ): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return "Your campaign message content would go here. Please add a Gemini API key for AI-generated content.";
      }

      const systemPrompt = this.buildCampaignSystemPrompt(tone);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nCreate content for: ${prompt}` }] }
        ],
      });

      return response.text || "Your campaign message content would go here.";
    } catch (error) {
      console.error('Error generating campaign content:', error);
      return "Your campaign message content would go here.";
    }
  }

  private buildCampaignSystemPrompt(tone: string): string {
    return `You are a marketing content creator for Telegram bot campaigns. Create engaging, compliant message content.

Tone: ${tone}

Guidelines:
- Keep messages concise (under 300 characters for Telegram)
- Include a clear call-to-action when appropriate  
- Ensure content is engaging and valuable
- Respect user privacy and consent
- Avoid spam-like language
- Make content conversational and authentic
- Include emoji sparingly for engagement
- Ensure messages comply with marketing best practices

Remember: All recipients have opted in to receive these messages. Focus on providing value.`;
  }

  async improveTemplate(originalContent: string, improvementGoals: string[]): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return originalContent;
      }

      const goals = improvementGoals.join(', ');
      const prompt = `Improve this message template to be more ${goals}:\n\n"${originalContent}"\n\nProvide an improved version that maintains the core message but enhances: ${goals}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
      });

      return response.text || originalContent;
    } catch (error) {
      console.error('Error improving template:', error);
      return originalContent;
    }
  }
}

export const aiService = new AiService();