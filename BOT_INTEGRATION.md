# Telegram publishing bot

The existing article model and Insights pages are used for bot articles. The backend exposes `/api/bot/v1/` with the trailing slash. All five routes require `Authorization: Bearer <BOT_INTEGRATION_TOKEN>`; an empty or wrong secret returns 403.

Configure `BOT_INTEGRATION_TOKEN` with a long random value in the site's private `.env`. Set `FRONTEND_BASE_URL` to the public origin used for article and image links (`https://consultation.bg` in production). The bot needs the same secret in `HASHTAG_INNOVATIONS_INTEGRATION_TOKEN` and this additional `SITES_JSON` entry:

```json
{"id":"hashtag-innovations","name":"Hashtag Innovations","api_base":"https://consultation.bg/api/bot/v1/","token_env":"HASHTAG_INNOVATIONS_INTEGRATION_TOKEN"}
```

Apply migrations with `cd backend && python manage.py migrate`. For Docker production, run `docker compose -f docker-compose.prod.yml run --rm backend python manage.py migrate` before restarting the backend. The migration adds a unique bot UUID, original payload, article categories and tags. If no active article category exists, it creates `news` for the bot to offer. Uploaded images use `backend/media`, which is mounted persistently at `/app/media` in the production compose file. Public `/media/...` requests are proxied to the backend by the frontend.

The bot calls `GET options/`, `GET articles/<external_id>/`, `POST articles/`, optionally `PUT articles/<external_id>/image/`, then `POST articles/<external_id>/publish/`. Creation stores a draft. A repeated creation with the same UUID and payload returns the same article, while changed content returns 409. Image upload and publication are safe to repeat; publication preserves the original timestamp. Published articles appear at `/en/insights/<slug>` and in the existing Insights list.

Run `cd backend && python manage.py test content` to check the integration. Tests use a temporary database and never publish to the live site.
