# Environmental Game Project

## Overview

This is a 3D environmental awareness game built with React Three Fiber and Express.js. The game teaches players about environmental conservation through interactive gameplay, mini-games, and quizzes. Players navigate a 3D world collecting items, sorting recyclables, and learning about sustainability topics like climate change and renewable energy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Component-based UI using React 18 with TypeScript for type safety
- **3D Rendering**: React Three Fiber for WebGL-based 3D graphics with Three.js integration
- **State Management**: Zustand stores for game state, audio management, and UI state
- **Styling**: Tailwind CSS with custom design system and Radix UI components
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Database Layer**: Drizzle ORM configured for PostgreSQL with schema-first approach
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Development Tools**: Hot module replacement and runtime error overlay for development experience

### Game Architecture
- **3D World System**: Modular component system for terrain, environment objects, and player movement
- **Game Loop**: Frame-based updates using React Three Fiber's useFrame hook
- **Physics & Interaction**: Simple collision detection and keyboard controls for player movement
- **Educational Content**: Mini-games for recycling sorting and energy conservation quizzes

### State Management
- **Game State Store**: Centralized game phase management (menu/playing/ended), scoring, inventory, and level progression
- **Audio Store**: Sound effect and background music management with mute functionality
- **Persistent Storage**: Local storage integration for user preferences

### UI System
- **Component Library**: Radix UI primitives with custom styling using class-variance-authority
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode**: Theme system with CSS custom properties

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database queries and migrations

### 3D Graphics & Animation
- **Three.js**: 3D graphics engine via React Three Fiber
- **React Three Drei**: Helper components for common 3D patterns
- **React Three Postprocessing**: Visual effects and post-processing pipeline
- **GLSL Shaders**: Custom shader support for visual effects

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Fontsource**: Self-hosted Inter font

### Development Tools
- **Vite**: Build tool with React plugin and TypeScript support
- **ESBuild**: Fast JavaScript bundler for server builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Runtime error overlay and development helpers

### Data Fetching & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and state management
- **Zod**: Schema validation for type-safe data parsing

### Audio & Media
- **Web Audio API**: Browser-native audio playback
- **Asset Loading**: Support for GLTF/GLB 3D models and audio files (MP3, OGG, WAV)

### Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Express Session**: Server-side session management

The application uses a monorepo structure with shared schema definitions between client and server, enabling type-safe communication and consistent data models across the full stack.