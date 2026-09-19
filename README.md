# StoryAI Studio

A starter AI image + video generation web app for StoryAI.

## Stack
- React + Vite
- Node.js + Express
- Supabase-ready data/storage layer
- OpenAI image generation on the server
- Pluggable video provider endpoint

## 1. Install
Open two terminals:

```bash
cd client
npm install

cd ../server
npm install
```

## 2. Environment variables

Copy `server/.env.example` to `server/.env`.

Required for real image generation:
- `OPENAI_API_KEY`

Optional:
- `OPENAI_IMAGE_MODEL` (defaults to `gpt-image-2`)
- `VIDEO_PROVIDER_URL` and `VIDEO_PROVIDER_API_KEY` for your chosen video API.
- `CLIENT_ORIGIN` (defaults to http://localhost:5173)

Supabase variables are included for the next persistence step.

## 3. Run

Terminal 1:
```bash
cd client
npm run dev
```

Terminal 2:
```bash
cd server
npm run dev
```

Open http://localhost:5173

## Notes
The image route is wired to OpenAI's image generation API through the server so the API key never reaches the browser.

The video route is intentionally provider-agnostic. Add your preferred video API URL/key in `.env` and adapt `server/src/providers/videoProvider.js` to that provider's request/response format. This avoids locking StoryAI into one vendor.

For production, add Supabase Auth, database records, object storage, rate limiting, job queues, and moderation before exposing generation publicly.
