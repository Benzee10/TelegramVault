# TeleBot Pro - AI-Powered Telegram Bot Management Platform

A comprehensive, legitimate Telegram bot management platform that enables businesses to automate customer engagement through official Telegram Bot API integration with AI-powered responses using Google Gemini.

## 🚀 Features

### 🤖 AI-Powered Auto-Responses
- **Google Gemini Integration**: Intelligent, context-aware responses
- **Keyword Auto-Responders**: Set up trigger-based responses
- **Fallback AI Responses**: Smart responses when keywords don't match
- **Conversation Context**: AI remembers previous interactions

### 📊 Bot Management
- **Multi-Bot Support**: Manage multiple Telegram bots from one dashboard
- **Real-time Status**: Monitor bot health and activity
- **Subscriber Management**: Track and manage bot subscribers
- **Message Analytics**: Detailed engagement metrics

### 📢 Campaign Management
- **Broadcast Campaigns**: Send messages to all subscribers
- **AI Content Generation**: Create engaging campaign content with AI
- **Message Templates**: Reusable message templates
- **Scheduling**: Plan campaigns for optimal engagement

### 📈 Analytics & Insights
- **Performance Metrics**: Track message delivery and engagement
- **AI Response Analytics**: Monitor AI performance and user satisfaction
- **Subscriber Growth**: Track subscriber acquisition and retention
- **Revenue Analytics**: Monitor campaign effectiveness

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini API
- **Hosting**: Vercel (Frontend + Serverless Functions)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless)
- Google Gemini API key
- Telegram Bot Token(s) from [@BotFather](https://t.me/BotFather)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/telebot-pro.git
cd telebot-pro
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key-here"

# Optional: OpenAI API (if you want to use OpenAI instead)
OPENAI_API_KEY="your-openai-api-key-here"

# Node Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
npm run db:push
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) to view the application.

## 🌐 Deployment

### Deploy to Vercel

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the project settings

3. **Environment Variables**:
   Add these environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your-neon-database-url
   GEMINI_API_KEY=your-gemini-api-key
   NODE_ENV=production
   ```

4. **Deploy**: 
   Vercel will automatically deploy on every push to main branch

### Manual Deployment

```bash
# Build the project
npm run build

# The built files will be in the 'dist' directory
# Deploy the 'dist' directory to your preferred hosting service
```

## 🔧 Configuration

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing one
3. Generate an API key
4. Add it to your environment variables

#### Telegram Bot Token
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token
4. Add the bot through the dashboard

### Database Setup (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string
4. Add it as `DATABASE_URL` in environment variables

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── services/           # Business logic services
│   │   ├── ai.ts          # AI integration (Gemini)
│   │   ├── telegram.ts    # Telegram Bot API
│   │   └── webhook.ts     # Webhook handling
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema & validation
└── vercel.json            # Vercel deployment config
```

## 🔒 Security & Compliance

- **Legitimate Bot API Usage**: Uses official Telegram Bot API only
- **Opt-in Subscribers**: All subscribers must explicitly opt-in
- **Data Privacy**: GDPR compliant data handling
- **Rate Limiting**: Respects Telegram API rate limits
- **Secure Tokens**: Environment-based secret management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/yourusername/telebot-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/telebot-pro/discussions)

## 🙏 Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api) for the official bot framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com) for seamless deployment
- [Neon](https://neon.tech) for serverless PostgreSQL

---

**⚡ Built with modern web technologies for legitimate, compliant Telegram bot automation**