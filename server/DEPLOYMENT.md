# Backend deployment

Deploy the `server` folder to a Node.js hosting provider.

Set:
- OPENAI_API_KEY
- OPENAI_IMAGE_MODEL
- CLIENT_ORIGIN=https://YOUR-NETLIFY-DOMAIN.netlify.app

Then set the Netlify environment variable:
`VITE_API_URL=https://YOUR-BACKEND-DOMAIN`

Do not put OPENAI_API_KEY in Netlify's frontend environment variables.
