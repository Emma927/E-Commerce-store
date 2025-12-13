#!/bin/bash
# Uruchomienie serwera dev w tle
docker compose up -d e2e-tests

# Opcjonalnie: podłącz się do kontenera dev (interaktywnie)
docker compose exec -it e2e-tests bash

