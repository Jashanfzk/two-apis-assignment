# Global News Translator

A Node.js web app that uses two APIs:
- NewsAPI: search recent English articles
- Google Translate API: translate an article summary to a chosen language

## Setup
1. Create a `.env` file (see `.env.sample`).
2. Install dependencies: `npm install`
3. Run in dev: `npm run dev` then open `http://localhost:3000`

## Environment variables
- `PORT` (optional, default 3000)
- `NEWS_API_KEY` (required)
- `GOOGLE_API_KEY` (required)

## Scripts
- `npm run dev`: start with nodemon
- `npm start`: start normally
