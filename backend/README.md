# Trading Bot Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values.
3. Run in development:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Scripts
- `npm run dev` — Start dev server with hot reload
- `npm run build` — Compile TypeScript to JS
- `npm start` — Run compiled server
- `npm run lint` — Lint code

## Project Structure
- `src/models` — Mongoose models
- `src/routes` — Express routes
- `src/controllers` — Route controllers
- `src/middleware` — Express middleware
- `src/utils` — Utility functions

## Environment Variables
See `.env.example` for required variables. 