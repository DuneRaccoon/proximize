#!/bin/bash

PROJECT_NAME="proximize-prod"
PROJECT_FILE="docker-compose.yml"

# # the image isn't ever being rebuilt, so this should force it to
# docker compose \
#   --file "$PROJECT_FILE" \
#   --project-name "$PROJECT_NAME" \
#   build --no-cache

# # then spin up the production environment
# docker compose \
#   --file "$PROJECT_FILE" \
#   --project-name "$PROJECT_NAME" \
#   up -d --remove-orphans

docker compose --file "$PROJECT_FILE" --project-name $PROJECT_NAME up -d --build --remove-orphans
