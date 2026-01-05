# --- STAGE 1: TESTY (Zawiera wszystko, by uruchomić testy jednostkowe i integracyjne) ---
# Bazowy obraz Node.js 24, alias 'test_runner'
FROM node:24 AS test_runner 
# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie CAŁEGO kodu i instalacja WSZYSTKICH zależności (devDependencies i dependencies)
# Kopiowanie plików zależności do kontenera
COPY ./app/package*.json ./

# Dodajemy flagę --ignore-scripts, aby npm nie próbował konfigurować Husky/Git - W skrócie: Husky po ignore-scripts w Dockerze po prostu nie istnieje, jest „uśpiony”, bo nie ma repozytorium Git w buildzie.
RUN npm install --ignore-scripts

# Instalacja wszystkich zależności (dependencies + devDependencies)
# RUN npm install
# Kopiowanie całego kodu aplikacji
COPY ./app .

# Uruchomienie wszystkich testów
# Jeśli testy zakończą się błędem, budowanie obrazu zatrzyma się.
RUN npm test

# Instalacja zależności systemowych wymaganych przez Playwright
# RUN apt-get update && apt-get install -y \
#     libnss3 libnspr4 libx11-xcb1 libxrandr2 libxcomposite1 libxcursor1 \
#     libxdamage1 libxfixes3 libxi6 libgtk-3-0 libgdk-3-0 libatk1.0-0 \
#     libasound2 libdbus-1-3 libgbm1 libxss1 libxkbcommon0 libcurl4 \
#     libatspi2.0-0 libcups2 libwayland-client0 libwayland-server0 \
#     libepoxy0 libwoff2-1 libvpx7 libopus0 gstreamer1.0-plugins-base \
#     gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-libav \
#     -y

# # Instalacja zależności systemowych i przeglądarki Chromium, Firefox, Webkit dla Playwright
# # Musi być wykonane przez roota.
# RUN npx playwright install --with-deps
# 
# # Ustaw zmienną środowiskową
# ENV PLAYWRIGHT_BASE_URL=http://e-commerce-store:3000
# 
# # Uruchomienie testów E2E (Playwright, używając nowego skryptu 'test:e2e-ci')
# # Testy end-to-end, tryb headlessowy; przerwie build przy błędzie
# RUN npm run start:e2e & \
#     npx wait-on $PLAYWRIGHT_BASE_URL && \
#     npx playwright test ./e2e

# --- STAGE 2: BUDOWANIE APLIKACJI (Kompilacja frontendu) ---
# Używamy etapu development/test_runner jako bazy, bo ma już zainstalowane wszystkie zależności (vite, babel itp.)
FROM test_runner AS builder

# Budowanie aplikacji (tworzenie katalogu 'dist')
RUN npm run build

# --- STAGE 3: SERWOWANIE GOTOWEJ APLIKACJI PRZEZ NGINX ---
# Używamy lekkiego, bezpiecznego obrazu Nginx Alpine jako serwer produkcyjny
FROM nginx:alpine AS production_nginx
# Użycie obrazu bazowego nginx:alpine jest kluczowe. alpine to bardzo lekka, minimalistyczna dystrybucja Linuxa, która używa narzędzia o nazwie BusyBox.
# BusyBox domyślnie udostępnia podstawową powłokę systemową jako /bin/sh.
# Obraz ten nie zawiera Basha (/bin/bash), dlatego Twoja próba użycia go zakończyła się błędem executable file not found.

# Załatanie nowych luk bezpieczeństwa jeśli się pojawią - Aktualizacja pakietów systemowych w kontenerze (łatki bezpieczeństwa)
RUN apk update && apk upgrade 
# Usuwamy domyślny plik konfiguracyjny Nginx, jeśli chcemy użyć własnego
RUN rm /etc/nginx/conf.d/default.conf

# Kopiowanie plików frontendu z etapu build do katalogu serwowanego przez Nginx
# Nginx domyślnie szuka plików w /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcjonalnie: Kopiowanie niestandardowego pliku konfiguracyjnego Nginx (jeśli masz złożoną konfigurację)
# Własny plik konfiguracyjny serwera
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Naprawia uprawnień, żeby Nginx mógł działać jako użytkownik jako non-root
# Ten blok zapewnia, że wszystkie katalogi i pliki potrzebne do działania Nginx są dostępne dla użytkownika nginx. Dzięki temu kontener może działać bez root, co jest bezpieczniejszym podejściem.
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Przełącz na użytkownika nginx (worker processes będą działały jako nginx)
USER nginx

# Odsłonięcie portu (domyślny port Nginx to 80, zamieniam powyzej 1024, aby nie korzystać z user-root tylko z mojego user-nginx)
EXPOSE 8080

# Domyślny CMD Nginx: uruchamia serwer w pierwszym planie
CMD ["nginx", "-g", "daemon off;"]

#Szczegółowo:
# 1. chown -R nginx:nginx /var/cache/nginx
# - Zmienia właściciela katalogu /var/cache/nginx na użytkownika i grupę nginx.
# - -R oznacza rekurencyjnie, czyli wszystkie podfoldery i pliki w tym katalogu.
# - Cel: Nginx musi móc zapisywać cache bez uprawnień roota.

# 2. chown -R nginx:nginx /var/log/nginx
# - Zmienia właściciela katalogu z logami Nginx na nginx.
# - Cel: Nginx może tworzyć i zapisywać logi (access.log, error.log) jako nie-root.

# 3. chown -R nginx:nginx /etc/nginx/conf.d
# Zmienia właściciela katalogu z konfiguracją Nginx na nginx.
# - Cel: Jeśli Nginx będzie musiał zmodyfikować pliki konfiguracyjne w trakcie działania (np. reload), użytkownik nginx ma uprawnienia.

# 4. touch /var/run/nginx.pid
# - Tworzy pusty plik PID dla Nginx (/var/run/nginx.pid) jeśli jeszcze nie istnieje.
# - Plik PID służy do zapisywania identyfikatora procesu master Nginx.

# 5. chown -R nginx:nginx /var/run/nginx.pid
# - Nadaje uprawnienia użytkownikowi nginx do pliku PID.
# - Cel: Nginx jako nie-root może zapisać swój PID i poprawnie działać.

# 1️⃣ Build obrazu
# 
# Dockerfile ma na celu zbudowanie finalnego obrazu (w tym wypadku frontendu w /dist i przygotowanie Nginx).
# 
# Podczas budowania obrazu:
# 
# Nie ma jeszcze działającego serwera frontendu (bo kontener jeszcze się nie uruchomił).
# 
# Próba uruchomienia npm run start:e2e & w RUN zawiesza build, bo serwer działa ciągle i RUN nigdy się nie kończy.
# 
# Dlatego testy E2E w RUN nie działają i blokują build.
# 
# 2️⃣ Testy E2E
# 
# Playwright musi mieć działający serwer – czyli kontener z frontem musi być uruchomiony.
# 
# Dlatego testy E2E:
# 
# uruchamiasz dopiero w runtime, np. przez docker-compose w osobnym kontenerze.
# 
# Możesz je wykonywać lokalnie przed deployem, lub w CI/CD pipeline.