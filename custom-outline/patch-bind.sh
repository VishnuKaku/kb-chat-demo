#!/bin/sh
# Patch Outline server to bind to 0.0.0.0
set -e

# Find and replace localhost with 0.0.0.0 in the built server files
find /opt/outline/build/server -type f -exec sed -i 's/localhost/0.0.0.0/g' {} +

echo "Patched Outline to bind to 0.0.0.0"
