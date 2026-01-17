#!/bin/bash
# skrypt startdev-e2e.sh - może odpalić oba konenery dla developmentu i testów e2e na raz dlatego wczytujemy usera
# 1. Dynamiczne ID użytkownika (NAJWAŻNIEJSZE dla uniknięcia kłódek na plikach)
# Nawet jeśli masz to w .env, to zapewnia 100% pewności, że Docker użyje Twojego aktualnego ID.
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)
# Uruchomienie serwera dev w tle
echo "🐳 Uruchamiam kontenery Docker dla testów e2e (user ubutnu)..."
docker compose up -d e2e-tests

# Opcjonalnie: podłącz się do kontenera dev (interaktywnie)
echo "🚀 Wchodzę do kontenera, mogę przeprowadzać testy e2e..."
docker compose exec -it e2e-tests bash

