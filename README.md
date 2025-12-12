# 🏪 E-Commerce-store

Aplikacja e-commerce została stworzona w ramach kursu JavaScript Developer, moduł specjalistyczny. Projekt ma na celu odwzorowanie funkcjonalności popularnych sklepów internetowych, pozwalając użytkownikom na intuicyjne przeglądanie, wybieranie i zakup produktów.

**Dostępna online:**  
[https://e-commerce-store.netlify.app](https://e-commerce-store.netlify.app)

---

⚠️ **Informacje o API (Uwaga dla reviewerów)**
Aplikacja korzysta z Fake Store API, które pełni rolę backendu demonstracyjnego.
Dane są symulowane i nietrwałe – np. koszyk czy logowanie resetują się po odświeżeniu strony.

Nie wszystkie endpointy API są wykorzystywane — integracja obejmuje te potrzebne do zakresu funkcjonalności (produkty, logowanie, koszyk).

API służy wyłącznie celom edukacyjnym i testowym.

---

## 🚀 Najważniejsze funkcje

- Integracja z Fake Store API do uwierzytelniania użytkownika oraz pobierania danych o produktach
- Obsługa motywów: jasny i ciemny
- System logowania użytkownika
- Przeglądanie katalogu produktów z możliwością filtrowania i sortowania
- Zarządzanie koszykiem użytkownika
- Zarządzanie ulubionymi produktami
- Finalizacja zakupów z wyborem metody płatności i dostawy
- Pulpit użytkownika wraz z historią zamówień dostępny w sesji użytkownika

---

## 🛠️ Wykorzystywane technologie

- React – do tworzenia skalowalnych i wielokrotnego użytku komponentów UI
- React-Router – do zarządzania nawigacją między komponentami bez przeładowania strony
- TanStack Query (React Query) – do zarządzania stanem danych z API, cache'owania i synchronizacji
- Redux Toolkit – do globalnego zarządzania stanem aplikacji (sesja użytkownika, koszyk, historia zamówień, filtry, ulubione produkty)
- React Hook Forms – do tworzenia formularzy
- Zod - do walidacji formularzy
- MUI (Material-UI) – do budowy spójnego, responsywnego i estetycznego interfejsu
- Podejście Mobile-First
- Narzędzia testowe:
  - Vitest – testy jednostkowe
  - React Testing Library – testy komponentów
  - MSW – przechwytywanie żądań do Fake Store API i zwracanie przygotowanych odpowiedzi
  - Playwright – testy end-to-end (E2E), zintegrowane z GitHub Actions (CI/CD)
  - Fake Store API – do symulacji działania backendu dla produktów i transakcji
- Docker – do konteneryzacji aplikacji w środowisku deweloperskim, testowym i produkcyjnym

---

## 📸 Zrzuty ekranu

Desktop i mobile znajdują się w folderze app/src/screenshots/.

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; margin-bottom: 40px">
  <img src="app/src/screenshots/desktop-view1.png" alt="Widok desktop" style="margin-right: 10px;">
  <img src="app/src/screenshots/mobile-view1.png" alt="Widok mobilny">
</div>

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; margin-bottom: 40px">
  <img src="app/src/screenshots/desktop-view2.png" alt="Widok desktop" style="margin-right: 10px;">
  <img src="app/src/screenshots/mobile-view2.png" alt="Widok mobilny">
</div>

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; margin-bottom: 40px">
  <img src="app/src/screenshots/desktop-view3.png" alt="Widok desktop" style="margin-right: 10px;">
  <img src="app/src/screenshots/mobile-view3.png" alt="Widok mobilny">
</div>

---

## ⚙️ Szczegółowe funkcjonalności

### ☀️🌙 1. Obsługa motywów

Użytkownicy mogą płynnie przełączać się między jasnym, a ciemnym motywem, zapewniając czytelność i dostępność UI.

### 🔐 2. Uwierzytelnianie użytkowników

Logowanie odbywa się poprzez endpoint Fake Store API - POST:

```bash
Autoryzacja - POST `/auth/login`
Id użytkwonika wybranego po username - GET `/users`
Dane użytkownika wybrane po id oraz tokenie - GET `/users/:id`
```

Dane logowania testowego:

```bash
username: "johnd"
password: "m38rmF$"
```

API zwraca token JWT (symulowany) i jest zapisywany w lokalnej pamięci przeglądarki (localStorage).
Token zawiera poprawny format JWT, ale nie ma walidacji bezpieczeństwa — jest generowany wyłącznie do celów demonstracyjnych.

### 📦 3. Katalog produktów

Wykorzystywane endpointy:

```bash
Pobranie listy produktów — GET `/products`
Pobranie jednego produktu — GET `/products/:id`
Pobranie kategorii — GET `/products/categories`
Produkty w kategorii — GET `/products/category/:category`
Sortowanie produktów po cenie — GET `/products?sort=desc`
```

Ograniczenie API: maksymalnie 20 produktów.
Produkty są prezentowane ze zdjęciami, opisami, cenami, ocenami i kategoriami. Aplikacja obsługuje filtrowanie, sortowanie i wyszukiwanie. Produkty ładowane są metodą lazy-loading.

### 🛒 4. Koszyk

Koszyk działa w całości po stronie frontendu. Dane koszyka są przechowywane w localStorage, dzięki czemu pozostają po odświeżeniu strony, ale nie są trwałe po stronie serwera — backend ich nie zapisuje.

Wysłanie zamówienia zwraca jedynie symulowane ID oraz datę servera poprzez endpoint:

```bash
Wysłanie zamówienia - POST: `/carts`
```

### 🛍️ 5. Proces realizacji zakupów

Ze względu na brak trwałości danych proces realizacji zakupów jest w całości lokalnie. Jedyne id zamówienia oraz data pochodzi z API po wysłaniu zamówienia POST na endpoint `/carts`. Użytkownik przechodzi przez wszystkie etapy: logowanie, podanie adresu wysyłki, wybór metody dostawy, wybór metody płatności i potwierdzenie zamówienia.

### 📑 6. Pulpit użytkownika

Historia zamówień zapisywana jest w sesji użytkownika dzięki redux-toolkit oraz localStorage.

## 🔧 Instalacja lokalna

1. Utwórz folder `E-Commerce-store`.

2. Sklonuj repozytorium:

```bash
 # SSH (zalecane, jeśli masz skonfigurowany klucz SSH)
git clone git@github.com:Your-Account/E-Commerce-store.git
```

> Uwagi:

> - SSH pozwala na push/pull do repozytoriów prywatnych bez podawania loginu i tokenu, jeśli w kontenerze lub lokalnym systemie masz skonfigurowany klucz SSH.

> - HTTPS wymaga podania tokenu przy push do repozytorium, nawet jeśli repo jest publiczne, jeśli pracujesz w środowisku, które nie pamięta Twoich danych uwierzytelniających (np. w Dockerze).

> - W lokalnym systemie Git mógł wcześniej korzystać z cache credential helper, dlatego push działał bez pytania o token. W kontenerze Docker te ustawienia nie są dostępne, dlatego Git pyta teraz o token przy push/pull przez HTTPS.

> - Dla publicznego repozytorium clone i pull działają identycznie przy SSH i HTTPS, różnica pojawia się dopiero przy push do repo prywatnego lub przy ograniczonych uprawnieniach.

```bash
git clone https://github.com/Your-Account/E-Commerce-store.git
```

3. Wejdź do katalogu:

```bash
   cd E-Commerce-store
```

4. Zainstaluj zależności

```bash
   npm install
```

5. Uruchom środowisko developerskie:

```bash
   npm run dev
```

6. Buduj do produkcji (opcjonalnie)\*\*

```bash
   npm run build
```

### 🧪 Testy i Continuous Integration (CI)

Aplikacja ma kilka rodzajów testów: jednostkowe, integracyjne oraz end-to-end (E2E). Możesz uruchomić je ręcznie albo korzystając z Husky przy pre-commit.
Projekt korzysta również z automatycznych testów i skanów bezpieczeństwa, aby zapewnić jakość kodu oraz poprawne działanie aplikacji.

1️⃣ GitHub Actions Workflow – Testy i Skan kodu źródłowego

- Testy jednostkowe, integracyjne i E2E
  - Uruchamiane przy pushu do branchy: main, develop, feature-fe
  - Testy uruchamiane są na Node.js 24.x
  - E2E testy Playwright wykonują się po zbudowaniu frontendu i uruchomieniu serwera developerskiego

- Skan bezpieczeństwa source code (Trivy FS scan)
  - Analizuje folder ./app oraz zależności (node_modules)
  - Wykrywa podatności w bibliotekach i pakietach (CRITICAL/HIGH)
  - Nie skanuje logiki biznesowej ani tajnych danych

1. Testy jednostkowe i integracyjne

Uruchamiają się za pomocą Vitest:

```bash
npm test        # uruchamia wszystkie testy jednostkowe i integracyjne
npm run coverage # uruchamia testy z raportem pokrycia
```

2. Testy end-to-end (E2E) z Playwright

Do testów E2E możesz wykorzystać wersję z UI (Trace Viewer) lub CI:

🔍 Lokalnie (z UI Trace Viewer)

Uruchamia graficzny interfejs Playwrighta, przydatny do debugowania:

```bash
npm run e2e # wersja z interfejsem graficznym (Trace Viewer) - lokalne bez konener
```
Działa tylko lokalnie — poza Dockerem.

🐳 W kontenerze Docker (zalecane)
 
1. Uruchom środowisko developerskie:

```bash
./startdev.sh
```
2. Wejdź do kontenera testowego jako użytkownik root:

```bash
docker compose exec --user root e2e-tests sh # Wejście do kontenera jako user-root
```
3. Uruchom testy E2E w trybie CI (bez UI):

```bash
npm run test:e2e-ci # uruchamia testy E2E w trybie CI (bez UI) - w kontenerze jako root
```
>⚠️ Uwaga dotycząca uprawnień w kontenerze:
Dlaczego testy E2E muszą być uruchamiane jako użytkownik root?

Playwright w kontenerze korzysta z przeglądarek (Chromium, Firefox, WebKit), które:
- tworzą cache przeglądarek i dane runtime w katalogach:
  - /root/.cache/
  - /root/.config/
  - /tmp/playwright*
- zapisują trace’y(nagrania przebiegu całego testu e2e), screenshoty i raporty w katalogu projektu:
  - /app/test-results/
- Użytkownik node (UID 1000) — standardowy user w kontenerach Node — nie ma pełnych praw zapisu do tych lokalizacji, co powodowałoby błędy typu:
- EACCES: permission denied

Dlatego:
➡️ Testy E2E są uruchamiane tylko w izolowanym kontenerze i tylko jako root.
➡️ Jest to normalne i zgodne z zaleceniami Playwrighta dla środowisk Dockerowych.
➡️ Nie ma to żadnego wpływu na bezpieczeństwo środowiska produkcyjnego — dotyczy wyłącznie środowiska testowego.

3. Uruchomienie frontendu do testów E2E

Testy E2E wymagają uruchomionej aplikacji.
Aby to zrobić, najpierw zbuduj projekt, a następnie uruchom wersję statyczną:. Możesz to zrobić tak:

```bash
npm run build      # buduje aplikację do katalogu /dist
npm run start:e2e  # uruchamia statyczną wersję aplikacji na http://localhost:3000
```

Ta wersja nie ma hot-reload, dev servera, ani narzędzi developerskich – działa jak finalna aplikacja użytkownika.

4. Automatyczne testy przy commicie dzięki Husky 🐶

Lokalnie przed każdym commitem uruchamiane są:

```bash
npm run format   # automatycznie sformatuje wszystkie pliki zgodnie z Prettier
npm run prettier   # sprawdzi, czy pliki są poprawnie sformatowane (bez zapisu zmian)
npm run lint   # sprawdzi styl kodu zgodnie z ESLint
npm run test   # uruchamia testy jednostkowe i integracyjne
```

Dzięki temu kod w repozytorium jest zawsze poprawny i zgodny ze standardami projektu.

### 🐳 Uruchomienie i obraz Docker oraz środowisko developerskie

Aplikacja jest przygotowana do uruchamiania w Dockerze, co ułatwia pracę w środowisku developerskim i produkcyjnym. Dzięki temu nie trzeba ręcznie instalować zależności ani budować frontendu — wszystko działa w kontenerze.

1️⃣ Co zawiera obraz Docker

Obraz jest przygotowany w kilku etapach:

1. Testy i instalacja zależności

- Kopiowanie całego kodu i instalacja wszystkich zależności (dependencies i devDependencies)
- Uruchomienie testów jednostkowych, integracyjnych i end-to-end (Playwright)

2. Build frontendu

- Kompilacja aplikacji React (tworzenie katalogu dist)

3. Serwowanie aplikacji przez Nginx

- Skopiowanie plików z katalogu dist do katalogu serwowanego przez Nginx
- Konfiguracja uprawnień, aby Nginx działał jako użytkownik nginx
- Domyślny port: 8080

Dzięki temu obraz jest gotowy do użycia zarówno w środowisku developerskim, jak i produkcyjnym.

2️⃣ Uruchamianie aplikacji

Start środowiska developerskiego w katalogu głównym projektu:

```bash
./startdev.sh
```

Skrypt wykona:

```bash
docker compose up -d # Uruchomienie kontenerów
docker compose exec -it e-commerce-store bash # Wejście do kontenera jako standradowy użytkownik node
docker compose run e2e-tests  # Uruchomienie osobnego kontenera do testów E2E (Playwright)
```

Teraz jesteś w terminalu kontenera i możesz uruchomić:

```bash
npm install     # opcjonalnie doinstalowanie paczek
npm run dev     # start serwera developerskiego
```

W środowisku deweloperskim aplikacja działa pod adresem:

```bash
http://localhost:3000
```

W środowisku produkcyjnym (w obrazie Dockerowym) Nginx wystawia aplikację pod adresem:

```bash
http://localhost:8080
```

Zatrzymanie środowiska
Po zakończeniu pracy wystarczy:

```bash
docker compose down
```

To zatrzymuje i usuwa kontener, pozostawiając kod lokalnie.

3️⃣ Obraz Docker do CI/CD

- W repozytorium jest skonfigurowany workflow GitHub Actions, który:
 - Przeprowadza testy jednostkowe, integracyjne i E2E (tryb headlessowy)
 - Buduje obraz Docker (build frontendu dist)
 - Serwuje aplikację przez Nginx (port 8080)
 - Publikuje obraz do GitHub Container Registry (ghcr.io)
 - Wykonuje skan bezpieczeństwa Trivy przy push’u tagów:
   - Analizuje gotowy obraz Docker
   - Wykrywa podatności CRITICAL/HIGH w systemie operacyjnym oraz bibliotekach w obrazie
   - Uruchamia się tylko przy tagowaniu obrazu (push tagów do GHCR)

Dzięki temu użytkownik końcowy może od razu użyć gotowego obrazu bez ręcznego buildowania.

📂 Struktura repozytorium

```bash
E-Commerce-store/
├─ .github/workflows/           # Folder z workflow GitHub Actions
│   ├─ cicd.yml                 # CI/CD: testy, build obrazu Docker, publikacja do GHCR
│   └─ test-ci.yml              # Uruchamianie testów jednostkowych, integracyjnych i E2E
├─ app/                         # Główny folder aplikacji frontendowej (Vite + React)
│   ├─ .husky/                  # Konfiguracja Husky do pre-commit hooks (formatowanie, lint, testy)
│   ├─ e2e/                     # Testy end-to-end (Playwright)
│   ├─ public/                  # Pliki statyczne dostępne publicznie (obrazy, favicon, itp.)
│   ├─ src/                      # Kod źródłowy aplikacji
│   │   ├─ App.jsx               # Główny komponent aplikacji React
│   │   ├─ main.jsx              # Punkt wejścia (renderowanie React)
│   │   ├─ constants.js          # Stałe globalne aplikacji
│   │   ├─ GlobalAppStyles.jsx   # Globalne style aplikacji
│   │   ├─ components/           # Komponenty React
│   │   │   ├─ common/           # Wspólne komponenty (np. Button, Modal)
│   │   │   └─ sections/         # Sekcje/fragmenty strony (np. Navigation, Hero, Footer)
│   │   ├─ context/              # Konteksty React
│   │   ├─ hooks/                # Własne hooki
│   │   ├─ layout/               # Layouty stron
│   │   ├─ pages/                # Widoki / strony aplikacji
│   │   ├─ screenshots/          # Zrzuty ekranu (desktop i mobile)
│   │   ├─ store/                # Redux Toolkit store
│   │   ├─ __tests__/            # Testy jednostkowe i integracyjne
│   │   └─ __mocks__/            # Mocki testowe (np. MSW)
│   └─ package.json              # Zależności i skrypty projektu (dla frontendu)
├─ README.md                     # Dokumentacja projektu
├─ startdev.sh                   # Skrypt uruchamiający środowisko developerskie w Dockerze
├─ .dockerignore                 # Ignorowane pliki przy buildzie obrazu Docker
├─ .env                          # USER_ID=1000, GROUP_ID=1000
├─ .gitignore                    # Ignorowane pliki w repozytorium git
├─ docker-compose.yml            # Konfiguracja Docker Compose (dev)
├─ Dockerfile                    # Definicja obrazu Docker (testy + build + Nginx)
├─ nginx.conf                    # Konfiguracja Nginx
```

✨ Status projektu

Projekt realizowany edukacyjnie.
Możliwe dalsze rozwijanie (backend własny, baza danych itd.).
