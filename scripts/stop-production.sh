#!/bin/bash

PROJECT_NAME="proximize-prod"
PROJECT_FILE="docker-compose.yml"

EXTRA_ARGS="$@"

RUNNING_CONTAINERS=$(docker-compose -f $PROJECT_FILE -p $PROJECT_NAME ps -q)

if [ -n "$RUNNING_CONTAINERS" ]; then
  echo "Bringing down the ${PROJECT_NAME} production environment..."
  docker compose --file "$PROJECT_FILE" --project-name $PROJECT_NAME down $EXTRA_ARGS
  echo "${PROJECT_NAME} Production environment has been brought down and volumes maintained."
else
  echo "Error: ${PROJECT_NAME} Production environment is not running."
  exit 1
fi