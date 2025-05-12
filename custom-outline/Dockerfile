FROM outlinewiki/outline:latest

# Switch to root to handle permissions
USER root

# Patch server to bind to 0.0.0.0 instead of localhost
COPY patch-bind.sh /patch-bind.sh
RUN chmod +x /patch-bind.sh && /patch-bind.sh

# Switch back to node user
USER node
