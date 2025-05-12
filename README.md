# Outline & Chatwoot Integration Assignment

## Overview
This project demonstrates integration of Outline (knowledge base), Chatwoot (chat platform), and Keycloak (authentication) using Docker Compose. It includes:
- SSO authentication via Keycloak
- Outline knowledge base protected by Keycloak
- Chatwoot chat with a bot that answers questions by querying Outline
- All services reverse-proxied by Nginx

---

## 1. Keycloak Setup
- Realm: `kb-chat-demo`
- Clients:
  - `kb-ui` (public)
  - `chatwoot-oidc` (confidential)
- Valid redirect URIs:
  - `http://localhost:3000/*` (Outline)
  - `http://localhost:4000/auth/callback` (Chatwoot/bot)
- Import the realm using:
  ```sh
  docker cp realm-export.json keycloak:/opt/keycloak/data/import/realm-export.json
  # Or mount as a volume in docker-compose.yml
  ```
- Start Keycloak with Docker Compose. Admin user: `admin` / `admin` (see docker-compose.yml)

---

## 2. Outline Knowledge-Base
- Outline runs in the `custom-outline` service (see Dockerfile for 0.0.0.0 binding patch).
- Protected by OIDC (Keycloak) via environment variables in docker-compose.yml.
- After login, create/import a few sample articles via the Outline UI.

---

## 3. Chatwoot AI Agent (Bot)
- The bot listens for Chatwoot webhooks (messages starting with `/ask`).
- It queries Outline’s API for relevant content and replies via Chatwoot API.
- Bot code is in `bot/index.js`.
- Configure `CHATWOOT_API_KEY` and `OUTLINE_API_KEY` in your environment or `.env` file.

---

## 4. Docker Compose
- All services are defined in `docker-compose.yml` and share the `kbnet` network.
- Services:
  - keycloak, keycloak-db
  - outline, outline-db, outline-redis
  - chatwoot, chatwoot-db, chatwoot-redis
  - bot
  - web-ui
  - nginx (reverse proxy)
- Start all services:
  ```powershell
  docker-compose up -d --build
  ```

---

## 5. Nginx Reverse Proxy
- Nginx config is in `nginx/nginx.conf`.
- Proxies / to Outline, /chatwoot/ to Chatwoot, /auth/ to Keycloak, and handles CORS.

---

## 6. Demo Script
1. Go to `http://localhost` in your browser.
2. Login via Keycloak SSO.
3. Browse the Outline knowledge base.
4. Open Chatwoot at `http://localhost/chatwoot/`.
5. Send a message starting with `/ask <your question>`.
6. The bot will reply with relevant content from Outline.

---

## 7. Troubleshooting
- Ensure all containers are running: `docker ps`
- Check logs: `docker-compose logs <service>`
- If you see 502 errors, check Nginx and service ports.
- Make sure all services are on the `kbnet` network.

---

## 8. Credits
- [Outline](https://github.com/outline/outline)
- [Chatwoot](https://github.com/chatwoot/chatwoot)
- [Keycloak](https://www.keycloak.org/)

---

## 9. Notes
- Keycloak realm export is included as `realm-export.json`.
- Sample bot code is in `bot/index.js`.
- For any issues, see comments in the code and configuration files.
"# kb-chat-demo" 
