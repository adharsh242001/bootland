# SoleAI

SoleAI is an interactive AI shoe-design experience built with React, Vite, Express, Socket.IO, and Google's Gemini models. It is designed for event-style installations where one screen guides a guest through a co-design flow while another screen shows a live projection gallery of finalized designs.

## What The App Does

The app walks a user through a short creative journey:

1. Start from an attract screen.
2. Pick a design mood such as `Cyberpunk`, `Botanical`, or `Oceanic`.
3. Choose a shoe type.
4. Refine the design with an AI co-designer, material selection, and palette controls.
5. Generate three AI-rendered variations.
6. Finalize one design and push it to a live projection feed.
7. Open a share page to download or share the finished design.

## Core Features

- AI co-designer chat powered by Gemini chat responses.
- AI image generation for three draft shoe concepts per session.
- Real-time projection view using Socket.IO.
- Shareable design pages at `/share/:id`.
- QR-code based handoff on the finalize screen.
- Lightweight Express API bundled with the frontend app.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Express
- Socket.IO
- Google GenAI SDK
- Motion

## Project Structure

```text
.
|-- server.ts                 # Express + Socket.IO server and dev entrypoint
|-- src/
|   |-- App.tsx               # Main app flow and route switching
|   |-- services/gemini.ts    # Gemini chat + image generation helpers
|   |-- components/           # Experience screens and UI pieces
|   |-- types.ts              # Shared app types
|-- vite.config.ts            # Vite config and env exposure
|-- .env.example              # Example environment variables
```

## Routes

- `/` - main interactive shoe design flow
- `/projection` - live event projection / gallery screen
- `/share/:id` - share page for a finalized design

## API Endpoints

The Express server exposes a few simple endpoints:

- `POST /api/finalize` - stores a finalized design in memory and broadcasts it to projection clients
- `GET /api/design/:id` - returns one finalized design
- `GET /api/designs` - returns the recent design feed

## Local Development

### Prerequisites

- Node.js 18+ recommended
- A valid `GEMINI_API_KEY`

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file and add your Gemini key:

```bash
copy .env.example .env.local
```

Then set:

```env
GEMINI_API_KEY=your_key_here
```

3. Start the app:

```bash
npm run dev
```

The custom server starts on `http://localhost:3000`.

## Available Scripts

- `npm run dev` - starts the Express server with Vite middleware
- `npm run build` - builds the frontend with Vite
- `npm run preview` - previews the production frontend bundle
- `npm run lint` - runs TypeScript type-checking
- `npm run clean` - removes `dist` using `rm -rf` currently

## How Environment Variables Work

This project uses `GEMINI_API_KEY` in two places:

- In `server.ts`, `dotenv` loads local environment variables for the Node process.
- In `vite.config.ts`, the same key is injected into the frontend as `process.env.GEMINI_API_KEY`.

That means the browser-side app directly calls Gemini from the client code in `src/services/gemini.ts`.

## Current Behavior And Limitations

- Finalized designs are stored only in memory, so restarting the server clears the gallery and share pages.
- The server keeps only the 50 most recent designs.
- The `clean` script uses `rm -rf`, which is Unix-style and may fail in a default Windows shell.
- The repository includes `better-sqlite3`, but the current code path does not persist designs to SQLite yet.
- The share and projection experience assumes the app is served from a single origin.

## Production Notes

In production mode, `server.ts` serves the built `dist` folder and falls back to `index.html` for SPA routes. A typical production flow is:

Build with:

```bash
npm run build
```

Then start the server with `NODE_ENV=production` using the correct syntax for your shell or process manager.

## Design Flow Overview

- `src/App.tsx` controls the full multi-step journey.
- `src/components/CoDesignerChat.tsx` manages the AI-assisted customization interface.
- `src/components/FinalizeScreen.tsx` creates the QR-based share handoff.
- `src/components/ProjectionView.tsx` listens for live updates and rotates between the latest design and the gallery view.

## Future Improvements

- Persist finalized designs in SQLite or another database.
- Move Gemini calls server-side so API keys are not exposed to the browser bundle.
- Add error states and retry guidance for failed generation requests.
- Add tests for the server endpoints and the multi-step flow.
