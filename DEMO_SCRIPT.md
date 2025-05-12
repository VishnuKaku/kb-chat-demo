# Demo Script: Outline & Chatwoot Integration

1. Open http://localhost in your browser.
2. Login using Keycloak credentials (admin/admin or as configured).
3. Browse the Outline knowledge base and verify you can see sample articles.
4. Open Chatwoot at http://localhost/chatwoot/ and log in.
5. Start a new conversation and send a message starting with `/ask <your question>` (e.g., `/ask What is Outline?`).
6. The bot will reply with the most relevant answer from the Outline knowledge base.
7. If you encounter issues, check container logs with `docker-compose logs <service>`.

