# Swasth Supply - B2B Marketplace for Street Food Vendors

## Overview

Swasth Supply is a B2B marketplace application that connects street food vendors with suppliers in India. The platform enables vendors to discover and order raw materials, ingredients, and supplies from verified local suppliers, while providing suppliers with a digital platform to reach customers and manage their business operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for warm, accessible colors
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Auth for user authentication and session management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework (minimal API for file uploads only)
- **Language**: TypeScript for type safety across the stack
- **Database**: Firebase Firestore for all data storage and real-time synchronization
- **Authentication**: Firebase Auth for user management and session handling
- **API Design**: Direct Firebase SDK integration with minimal REST endpoints

### Development Architecture
- **Monorepo Structure**: Unified codebase with shared types and utilities
- **Hot Reload**: Vite middleware integration for seamless development experience
- **Type Safety**: Shared TypeScript definitions between client and server
- **Code Organization**: Feature-based folder structure with clear separation of concerns

## Key Components

### Authentication System
- **Firebase Integration**: Complete auth flow with email/password registration
- **User Types**: Vendor and supplier role-based authentication
- **Profile Management**: Extended user profiles stored in Firestore
- **Session Persistence**: Automatic login state management

### Database Schema
- **Users Table**: Stores user profiles, business information, and verification status
- **Products Table**: Supplier inventory with categories, pricing, and stock levels
- **Orders Table**: Order management with status tracking and delivery information
- **Reviews Table**: Rating and feedback system for suppliers

### UI Components
- **Design System**: Consistent component library with accessible defaults
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **Interactive Elements**: Modal dialogs, dropdowns, and form components
- **Data Display**: Tables, cards, and lists for presenting business information

### Business Logic
- **Supplier Search**: Location-based filtering and category browsing
- **Order Management**: Cart functionality and order status tracking
- **Product Management**: Inventory control for suppliers
- **Communication**: Built-in chat support system

## Data Flow

### Authentication Flow
1. User selects role (vendor/supplier) and creates account via Firebase
2. Additional profile information stored in Firestore
3. User session maintained across browser refreshes
4. Role-based dashboard routing

### Order Flow
1. Vendors browse suppliers by location and category
2. Products added to cart with quantity selection
3. Order submission creates database record
4. Real-time status updates through supplier dashboard
5. Delivery tracking and completion confirmation

### Data Synchronization
- **Client-Server**: React Query handles API communication and caching
- **Real-time Updates**: Firebase Firestore for live data synchronization
- **Optimistic Updates**: Immediate UI feedback with server reconciliation

## External Dependencies

### Firebase Services
- **Authentication**: User registration, login, and session management
- **Firestore**: Real-time database for user profiles and dynamic data
- **Configuration**: Environment-based Firebase project setup

### Database Infrastructure  
- **Firebase Firestore**: Real-time NoSQL database for all product data storage and user profiles
- **PostgreSQL**: Available but not actively used (migrated from PostgreSQL to Firebase)
- **Real-time Updates**: Firestore provides live data synchronization across clients
- **Image Storage**: Local uploads directory with Express.js middleware for serving product images

### UI Libraries
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide Icons**: Consistent icon library throughout the application
- **Class Variance Authority**: Type-safe component variant management

### Development Tools
- **ESBuild**: Fast TypeScript compilation for production
- **Replit Integration**: Development environment optimizations
- **Error Handling**: Runtime error overlays for development

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild compiles TypeScript server code to `dist/index.js`
- **Static Serving**: Express serves frontend assets in production mode
- **Environment Variables**: Database URL and Firebase configuration via environment

### Development Workflow
- **Hot Reload**: Vite middleware provides instant feedback during development
- **Database Sync**: `npm run db:push` synchronizes schema changes
- **Type Checking**: TypeScript compiler validates code integrity
- **Unified Scripts**: Single command development with `npm run dev`

### Database Management
- **Schema Evolution**: Drizzle migrations in `./migrations` directory
- **Type Generation**: Automatic TypeScript types from database schema
- **Connection Management**: Environment-based database URL configuration