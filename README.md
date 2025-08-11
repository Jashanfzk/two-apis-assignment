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

## Endpoints (local)
- GET `/` → renders the home page (Pug)
- POST `/news` → body: `{ "query": "<topic>" }` → returns `{ articles: [...] }`
- GET `/api/translate?text=<text>&target=<lang>` → returns `{ translated: "..." }`

Notes
- Supported language codes used in the UI include: `hi`, `pa`, `fr`, `ar`, `es`, `zh`.
- API keys are required for NewsAPI and Google Translate; errors are handled with simple JSON messages.