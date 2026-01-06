#!/bin/bash
# skrypt ssh-agent.sh
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
