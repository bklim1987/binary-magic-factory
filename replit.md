# Binary Magic Factory

## Overview
An educational web application that teaches binary number concepts through an interactive game-like interface. Users complete Phase 1 by "lighting up the bits" to unlock magic cards.

## Project Structure
This is a frontend-only React application built with:
- React 18 with TypeScript
- Vite for development and building
- TailwindCSS for styling
- shadcn/ui component library
- React Router for navigation
- TanStack Query for data fetching

## Key Directories
- `src/` - Main source code
  - `components/` - React components including shadcn/ui components
  - `pages/` - Page components (Index, NotFound)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
- `public/` - Static assets

## Running the Project
The development server runs on port 5000:
```bash
npm run dev
```

## Building for Production
```bash
npm run build
```
Output is in the `dist/` directory.

## Recent Changes
- 2025-12-22: Imported from Lovable to Replit environment
  - Updated Vite config to use port 5000 and allow all hosts for Replit proxy
  - Configured static deployment