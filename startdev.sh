#!/bin/bash
# 1. Uruchom agenta na Twoim komputerze (jeśli nie działa)
eval $(ssh-agent -s)

# 2. Dodaj swój klucz prywatny (na komputerze!)
ssh-add ~/.ssh/id_ed25519

# 3. Nadaj uprawnienia socketowi, aby Docker mógł go "podnieść"
sudo chmod 666 $SSH_AUTH_SOCK

# 4. Ustaw zmienne użytkownika
# Komendy export USER_ID=$(id -u) i export GROUP_ID=$(id -g) w skrypcie pobierają Twoje numery z systemu i wstrzykują je do pliku YAML w momencie uruchamiania.
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)
# 5. Uruchomienie serwera dev w tle
docker compose up -d e-commerce-store

# 6. Podłącz się do kontenera dev (interaktywnie)
docker compose exec -it e-commerce-store bash