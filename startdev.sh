#!/bin/bash
# Uruchomienie serwera dev w tle
docker compose up -d

# Opcjonalnie: podłącz się do kontenera dev (interaktywnie)
docker compose exec -it e-commerce-store bash

# Uruchom testy E2E
# docker compose run --rm e2e-tests
# W debugowaniu możesz uruchomić testy bez --rm, żeby kontener nie znikał od razu.
docker compose run e2e-tests

# A wdrugim terminalu wejście jako root dla testowania e2e: docker compose exec --user root e2e-tests sh