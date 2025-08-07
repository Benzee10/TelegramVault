# Overview

This is a comprehensive Telegram bot marketing automation platform called "TeleBot Pro" that enables users to manage multiple Telegram bots, subscribers, messaging campaigns, and templates through a modern web interface. The platform is designed to help businesses and marketers automate their Telegram marketing efforts while maintaining compliance and scalability.

**Status**: ✅ Production-ready and configured for GitHub/Vercel deployment

## Recent Updates (January 2025)
- ✅ Integrated Google Gemini API for AI-powered auto-responses
- ✅ Built comprehensive auto-responder management system
- ✅ Created AI content generator for campaigns and templates
- ✅ Added intelligent conversation context awareness
- ✅ Implemented bot detail pages with advanced management
- ✅ Configured for GitHub repository and Vercel deployment
- ✅ Added comprehensive documentation and deployment guides
- ✅ Migrated successfully from Replit Agent to Replit environment
- ✅ Fixed Vercel deployment configuration (runtime version specification)
- ✅ Verified build process and database schema deployment
- ✅ Updated server structure for better serverless compatibility
- ✅ Created proper PostgreSQL database with schema deployment

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:
- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod schema validation
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
The backend follows a modular Express.js architecture:
- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js with structured route handling
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Services**: Separated concerns with dedicated services for Telegram API, webhooks, and scheduling
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Validation**: Zod schemas shared between frontend and backend

## Database Design
Uses PostgreSQL with a well-structured relational schema:
- **Users**: Authentication and plan management
- **Bots**: Telegram bot configurations and tokens
- **Subscribers**: Bot subscriber data with opt-in tracking
- **Campaigns**: Marketing campaign management with scheduling
- **Templates**: Reusable message templates with categorization
- **Messages**: Message history and delivery tracking
- **Analytics**: Performance metrics and engagement data
- **Auto Responders**: Automated response configurations

## Key Design Patterns
- **Shared Schema**: Common TypeScript types and Zod validators in `/shared` directory
- **Service Layer**: Business logic abstracted into dedicated service classes
- **Repository Pattern**: Database operations centralized in storage layer
- **Middleware Pipeline**: Express middleware for logging, validation, and error handling
- **Real-time Updates**: Webhook handling for live Telegram interactions

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless for scalable data storage
- **Session Store**: PostgreSQL-based session management
- **Build & Development**: Vite with React plugin and TypeScript support

## Telegram Integration
- **Telegram Bot API**: Direct HTTP API integration for bot management
- **Webhook Processing**: Real-time message and interaction handling
- **Bot Token Validation**: Secure token verification and bot info retrieval

## UI & Styling
- **shadcn/ui**: Complete component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Comprehensive icon library for consistent iconography

## Development Tools
- **Replit Integration**: Development environment support with runtime error overlay
- **TypeScript**: Full type safety across frontend, backend, and shared code
- **ESBuild**: Fast bundling for production server builds
- **Drizzle Kit**: Database migration and schema management tools