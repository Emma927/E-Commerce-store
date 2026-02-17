#!/bin/bash
# skrypt startdev.sh
# 1. Zarządzanie Agentem SSH (niezbędne, by SSH w ogóle działało)
if [ -z "$SSH_AUTH_SOCK" ] || [ ! -S "$SSH_AUTH_SOCK" ]; then
  echo "📡 Uruchamiam nowego agenta SSH..."
  eval $(ssh-agent -s)
fi

# 2. Ładowanie kluczy
ssh-add -l &>/dev/null
if [ $? -ne 0 ]; then
  echo "🔑 Klucz nie jest załadowany. Autoryzacja..."
  ssh-add ~/.ssh/id_ed25519
else
  echo "✅ Agent SSH jest aktywny i posiada klucze."
fi

# 3. Dynamiczne ID użytkownika (NAJWAŻNIEJSZE dla uniknięcia kłódek na plikach)
# Nawet jeśli masz to w .env, to zapewnia 100% pewności, że Docker użyje Twojego aktualnego ID.
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)

# 4. Uruchomienie kontenera dev w tle (user node)
echo "🐳 Uruchamiam kontenery Docker..."
docker compose up -d e-commerce-store

# 5. Wejście do kontenera
echo "🚀 Wchodzę do kontenera..."
docker compose exec -it e-commerce-store bash