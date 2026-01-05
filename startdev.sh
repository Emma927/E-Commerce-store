#!/bin/bash

# 1. Sprawdź, czy agent SSH działa i czy socket fizycznie istnieje
if [ -z "$SSH_AUTH_SOCK" ] || [ ! -S "$SSH_AUTH_SOCK" ]; then
  echo "📡 Uruchamiam nowego agenta SSH..."
  eval $(ssh-agent -s)
fi

# 2. Sprawdź, czy agent ma już załadowane klucze
ssh-add -l &>/dev/null
if [ $? -ne 0 ]; then
  echo "🔑 Klucz nie jest załadowany. Autoryzacja..."
  ssh-add ~/.ssh/id_ed25519
  
  # Nadaje uprawnienia, aby Docker (użytkownik node) mógł "rozmawiać" z agentem
  echo "🔓 Nadaję uprawnienia do socketu SSH (wpisz hasło sudo)..."
  sudo chmod 666 $SSH_AUTH_SOCK
else
  # Jeśli socket ma już 666 i klucze są w środku, skrypt przejdzie tutaj bez pytania o hasło
  echo "✅ Agent SSH jest aktywny i posiada klucze. Pomijam logowanie."
fi

# 3. Pobierz ID Twojego użytkownika i grupy z systemu Linux
# Zapobiega to problemom z uprawnieniami ("kłódki" na plikach w VS Code)
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)

# 4. Uruchomienie serwera deweloperskiego w tle
echo "🐳 Uruchamiam kontenery Docker..."
docker compose up -d e-commerce-store

# 5. Podłącz się do kontenera interaktywnie
echo "🚀 Wchodzę do kontenera..."
docker compose exec -it e-commerce-store bash
