# Deployment Guide - TeleBot Pro

This guide will help you deploy TeleBot Pro to GitHub and Vercel for production use.

## 📋 Pre-deployment Checklist

- [ ] PostgreSQL database (recommended: [Neon](https://neon.tech))
- [ ] Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- [ ] GitHub account
- [ ] Vercel account (free tier available)

## 🚀 GitHub Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `telebot-pro` or your preferred name
3. Make it public or private as needed
4. **Don't** initialize with README (we have one already)

### 2. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: TeleBot Pro - AI-powered Telegram bot management platform"

# Add your GitHub repository as origin
git remote add origin https://github.com/yourusername/telebot-pro.git

# Push to GitHub
git push -u origin main
```

## 🌐 Vercel Deployment

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click **"New Project"**
4. Import your `telebot-pro` repository
5. Vercel will auto-detect the framework (Vite)

### Step 2: Configure Build Settings

Vercel should automatically detect these settings:
- **Framework Preset**: Vite
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, set them manually.

### Step 3: Environment Variables

In the Vercel dashboard, add these environment variables:

**Required Variables:**
```
DATABASE_URL=your-neon-database-connection-string
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
```

**Optional Variables:**
```
OPENAI_API_KEY=your-openai-key-if-using-openai
SESSION_SECRET=random-string-for-sessions
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your application
3. You'll get a URL like `https://telebot-pro.vercel.app`

## 🗄️ Database Setup (Neon)

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project
4. Create database named `telebot_pro`
5. Copy the connection string

### 2. Database Migration

After deployment, you'll need to set up the database schema:

```bash
# Clone the repository locally
git clone https://github.com/yourusername/telebot-pro.git
cd telebot-pro

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npm run db:push
```

## 🔑 API Keys Setup

### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create new project or select existing
3. Navigate to "Get API Key"
4. Create API key
5. Copy and add to Vercel environment variables

### Telegram Bot Tokens

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` to create a new bot
3. Get the bot token
4. Add bots through the dashboard after deployment

## 🚀 Post-Deployment Steps

### 1. Verify Deployment

1. Visit your Vercel URL
2. Check that the dashboard loads
3. Verify database connection
4. Test AI integration

### 2. Add Your First Bot

1. Get bot token from @BotFather
2. Click "Add Bot" in the dashboard
3. Enter bot token and configure
4. Set up webhook (automatically handled)

### 3. Test Auto-Responses

1. Send a message to your bot on Telegram
2. Check that AI responses work
3. Set up keyword auto-responders
4. Test campaign broadcasts

## 🔧 Custom Domain (Optional)

### 1. Add Domain in Vercel

1. Go to your project in Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Update Environment Variables

If using custom domain, update:
```
APP_URL=https://yourdomain.com
```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor deployment metrics
3. Track performance and errors

### Application Monitoring

The dashboard includes:
- Bot status monitoring
- Message analytics
- AI response metrics
- Subscriber growth tracking

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files to Git
- Use strong, random session secrets
- Rotate API keys regularly
- Use HTTPS in production (Vercel provides this)

### Database Security

- Use connection pooling
- Enable SSL connections
- Regularly backup your database
- Monitor for unusual activity

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (requires 18+)
- Verify all dependencies are listed
- Check for TypeScript errors

**Database Connection:**
- Verify DATABASE_URL format
- Check database credentials
- Ensure database is accessible

**API Issues:**
- Verify API keys are correct
- Check API quotas and limits
- Monitor error logs in Vercel

### Debugging

```bash
# Check Vercel function logs
vercel logs

# Local development debugging
npm run dev
```

## 📈 Scaling

### Database Scaling

- Neon automatically scales with usage
- Monitor connection limits
- Consider read replicas for high traffic

### Vercel Scaling

- Automatic scaling included
- Monitor function execution time
- Upgrade plan if needed for higher limits

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Vercel automatically deploys the changes
```

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Neon Documentation](https://neon.tech/docs)
3. Open an issue on the GitHub repository
4. Check deployment logs for specific errors

---

**🎉 Congratulations! Your TeleBot Pro platform is now live and ready to manage AI-powered Telegram bots at scale.**