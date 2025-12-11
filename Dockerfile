# --- STAGE 1: TESTY E2E (Zawiera wszystko, by uruchomić testy) ---
FROM node:24 AS test_runner
WORKDIR /app

# Kopiowanie CAŁEGO kodu i instalacja WSZYSTKICH zależności (devDependencies i dependencies)
COPY ./app/package*.json ./
RUN npm install
COPY ./app .

# Uruchomienie wszystkich testów (unit, integracyjnych, e2e)
# Jeśli masz dedykowany skrypt np. "test:ci", użyj go tutaj.
# Jeśli testy zakończą się błędem, budowanie obrazu zatrzyma się.

# Uruchomienie wszystkich testów
# Jeśli testy zakończą się błędem, budowanie obrazu zatrzyma się.
RUN npm test

# Instalacja zależności systemowych i przeglądarki Chromium dla Playwright
# Musi być wykonane przez roota.
RUN npx playwright install --with-deps

# 3. Uruchomienie testów E2E (Playwright, używając nowego skryptu 'test:e2e-ci')
RUN npm run test:e2e-ci

# --- STAGE 2: BUDOWANIE APLIKACJI (Kompilacja frontendu) ---
# Używamy etapu development/test_runner jako bazy, bo ma już zainstalowane wszystkie zależności (vite, babel itp.)
FROM test_runner AS builder

# Budowanie aplikacji (tworzenie katalogu 'dist')
RUN npm run build

# --- STAGE 3: SERWOWANIE GOTOWEJ APLIKACJI PRZEZ NGINX ---
# Używamy lekkiego, bezpiecznego obrazu Nginx Alpine
FROM nginx:alpine AS production_nginx

# Załatanie nowych luk bezpieczeństwa jeśli się pojawią
RUN apk update && apk upgrade 
# Usuwamy domyślny plik konfiguracyjny Nginx, jeśli chcemy użyć własnego
RUN rm /etc/nginx/conf.d/default.conf

# Kopiujemy pliki wynikowe z etapu build do domyślnego katalogu serwowania Nginx
# Nginx domyślnie szuka plików w /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcjonalnie: Kopiowanie niestandardowego pliku konfiguracyjnego Nginx (jeśli masz złożoną konfigurację)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Naprawiamy uprawnienia (to nadal konieczne, żeby Nginx mógł pisać swoje pliki jako non-root)
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid
# # Przełącz na użytkownika nginx (worker processes będą działały jako nginx)
USER nginx

# Nginx domyślnie działa na porcie 80 i ma wbudowany CMD, nie potrzebujesz npm start

# Odsłonięcie portu (domyślny port Nginx to 80, zamieniam powyzej 1024, aby nie krozystać z user root tylko mojego nginx)
EXPOSE 8080

# Domyślny CMD Nginx uruchamia serwer. Nie ruszaj tej linii.
CMD ["nginx", "-g", "daemon off;"]
