# 🏪 E-Commerce-store

The e-commerce application was created as part of the JavaScript Developer course, specialized module. The project aims to replicate the functionality of popular online stores, allowing users to intuitively browse, select, and purchase products.

**Available online:**  
[https://e-commerce-store-online.netlify.app/](https://e-commerce-store-online.netlify.app/)

---

⚠️ **API Information (Note for Reviewers)**
The application uses the Fake Store API, which serves as a demo backend.
The data is simulated and non-persistent — for example, the cart or login resets when the page is refreshed.

Not all API endpoints are used — the integration only covers those required for the implemented features (products, login, cart).

The API is intended for educational and testing purposes only.

---

⚙️ Notes on Docker and node_modules

The project was developed and tested on WSL2, where Docker runs on a native Linux filesystem (ext4).

In this environment, bind mounts were used without anonymous volumes for node_modules because, with WSL2 + ext4, this does not cause performance issues and provides:

- full access to node_modules from VS Code (IntelliSense, Go to Definition),
- easier debugging of libraries,
- consistent file permissions (UID 1000),
- simpler development environment setup.

On macOS and Windows (without WSL2), where Docker runs in a virtual machine and uses NTFS/APFS filesystems, it is recommended to use a separate Docker volume for node_modules due to the performance cost of synchronization between the host and the container.

---

## 🚀 Key Features

- Integration with the Fake Store API for user authentication and product data retrieval
- Theme support: light and dark modes
- User login system
- Product catalog browsing with filtering and sorting options
- User cart management
- Favorites (wishlist) management
- Checkout process with payment and delivery method selection
- User dashboard with order history available during the user session

---

## 🛠️ Technologies Used

- React – for building scalable and reusable UI components
- React Router – for managing navigation between components without page reloads
- TanStack Query (React Query) – for managing API data state, caching, and synchronization
- Redux Toolkit – for global state management (user session, cart, order history, filters, favorite products)
- React Hook Form – for building forms
- Zod – for form validation
- MUI (Material-UI) – for creating a consistent, responsive, and visually appealing interface
- React-Toastify – for displaying notifications and handling UI errors
- Mobile-First approach
- Testing tools:
  - Vitest – unit testing
  - React Testing Library – component testing
  - MSW – intercepting requests to the Fake Store API and returning prepared responses
  - Playwright – end-to-end (E2E) testing, integrated with GitHub Actions (CI)
  - Fake Store API – simulating backend functionality for products and transactions
- Docker – for containerizing the application in development, testing, and production environments

---

## 📸 Screenshots

Mobile and desktop screenshots can be found in the `app/src/screenshots/` folder.

### View 1
![Mobile view 1](app/src/screenshots/mobile-view1.png)
![Desktop view 1](app/src/screenshots/desktop-view1.png)

### View 2
![Mobile view 2](app/src/screenshots/mobile-view2.png)
![Desktop view 2](app/src/screenshots/desktop-view2.png)

### View 3
![Mobile view 3](app/src/screenshots/mobile-view3.png)
![Desktop view 3](app/src/screenshots/desktop-view3.png)

---

## ⚙️ Detailed Features

### ☀️🌙 1. Theme Support

Users can seamlessly switch between light and dark themes, ensuring UI readability and accessibility.

### 🔐 2. User Authentication

Login is handled via the Fake Store API endpoint - POST:

```bash
Authentication - POST `/auth/login`
Get user ID by username - GET `/users`
Get user data by ID - GET `/users/:id`
```

> The JWT token is used on the frontend only to control whether the fetch request should be executed (enabled: !!token). The Fake API does not verify the token, so in practice only the user id is required to retrieve user data.

Test login credentials:

```bash
username: "johnd"
password: "m38rmF$"
```

> The API returns a simulated JWT token and stores it in the browser's local storage (localStorage).
The token has a valid JWT format, but it is neither properly signed nor verified on the backend, so it does not provide real security and is intended for demonstration purposes only.

### 📦 3. Product Catalog

Used endpoints:

```bash
Get all products — GET `/products`
Get a single product — GET `/products/:id`
Get categories — GET `/products/categories`
Products in a category w kategorii — GET `/products/category/:category`
Sort products by price — GET `/products?sort=desc`
```

API limitation: a maximum of 20 products.
Products are displayed with images, descriptions, prices, ratings, and categories. The application supports filtering, sorting, and searching. Products are loaded using lazy-loading.

### 🛒 4. Cart

The cart is fully handled on the frontend. Cart data is stored in localStorage, so it persists after a page refresh, but it is not saved on the server— the backend does not store it.

Submitting an order returns only a simulated ID and server date via the endpoint:

```bash
Submit order - POST: `/carts`
```

### 🛍️ 5. Checkout process

Due to the lack of persistent data storage, the entire checkout process is handled locally on the frontend.
Only the order ID and order date are returned from the API after submitting the order via a POST request to the `/carts` endpoint.

The user goes through all checkout steps: logging in, providing a shipping address, selecting a delivery method, choosing a payment method, and confirming the order.

### 📑 6. User Dashboard

Order history is saved in the user session using Redux Toolkit and localStorage.

### ⚠️ 7. API Error Handling and Notifications

The application handles errors from HTTP requests (status codes 4xx and 5xx) as well as other unexpected issues. The mechanism is based on the useHandleApiError hook, which:

- Automatically displays a toast message for the user (using React-Toastify) in case of:
  - Network errors (e.g., no connection)
  - Client errors (4xx)
  - Server errors (5xx)
- Allows optional refetching of data after server errors (5xx) via React Query invalidation.
- This ensures consistent and non-intrusive visual feedback across the UI without duplicating logic in individual components.

Example usage in a component:

const handleApiError = useHandleApiError(['products-infinite']);

```bash
useEffect(() => {
  if (isError) {
    handleApiError(error);
  }
}, [isError, error, handleApiError]);
```

This way, the user is immediately informed of any issues, and the data can be automatically refetched if a server error occurs.

## 🔧 Running the Application

The application can be run locally or using Docker. In both cases, the first step is to prepare the repository.

### 1. Preparation (Common for Both Methods)

1. Create a folder named `E-Commerce-store`.

2. Clone the repository:

```bash
 # SSH (recommended if you have an SSH key configured)
git clone git@github.com:Your-Account/E-Commerce-store.git

 # OR HTTPS
git clone https://github.com/Your-Account/E-Commerce-store.git
```

> Notes:

> - SSH allows push/pull to public and private repositories without entering your username and token, as long as you have an SSH key configured in your container or local system.

> - HTTPS requires a token for push operations, even for public repositories, if you are working in an environment that does not remember credentials (e.g., inside a Docker container).

> - If using HTTPS, make sure Git Credential Manager or another credential helper is configured to store tokens.

> - On a local system, Git might have previously used saved credentials (credential helper), so push operations worked without asking for a token. In a Docker container, these settings are not available, so Git will ask for a token again when performing push/pull via HTTPS.

> - For a public repository, clone and pull operations work via both HTTPS and SSH without authentication. The difference becomes important when working with private repositories, where authentication is required for every operation (clone, pull, push), and when pushing to a public repository: HTTPS requires a token, while SSH relies on key-based authorization.

## 🔐 Git Authorization in the Container (HTTPS)
If you are using HTTPS and Git inside the container asks for login credentials:
 - Use your GitHub Personal Access Token (PAT) as the password.
 - To avoid entering credentials repeatedly, you can enable a temporary cache in the container:
```bash
git config --global credential.helper 'cache --timeout=3600'
```

3. Navigate to the project directory:

```bash
   cd E-Commerce-store
```

### 💻 2. Local Method (Host)

Requires Node.js installed on your computer.

```bash
   npm install     # Install dependencies
   npm run dev     # Start the dev server (Vite)
```

→ The application runs locally on the host at http://localhost:3000

Building the production version (optional):\*\*

```bash
   npm run build
```

### 🐳 3. Running via Docker and Development Environment

Containerization provides a ready-to-use environment for running the application, where Node.js is already installed. This means you do not need Node.js installed on the host. Project files are mapped via bind mounts between the host and the container, allowing you to edit code locally while using Node.js and other tools inside the container.

3.1. 🛠️ Helper Scripts

The project includes two main scripts:

1. **startdev.sh** – starts the frontend container (`e-commerce-store`) using the host’s UID/GID and opens a shell inside it.
2. **startdev-e2e.sh** – starts the E2E container (`e2e-tests`) and optionally opens an interactive shell inside it.

💡 For most users: `startdev.sh` is sufficient for development work. `startdev-e2e.sh` is only used for running E2E tests.

> ⚠️ Note for container users:
> - The frontend dev container (`e-commerce-store`) uses **dynamicznie UID/GID hosta**, uses the host’s UID/GID dynamically when started via `startdev.sh`. If you run `docker compose up` manually, the UID/GID are taken from the `.env` file.
> - The E2E container (e2e-tests) is based on the Playwright image, which has a default Ubuntu user. In docker-compose.yml the container’s UID/GID is overridden with the host values (from .env or startdev-e2e.sh), so that files in the bind mount have the correct permissions.

---

3.2. 📝 UID/GID Configuration for Docker / Dev Container

> ⚠️ If your local user has a UID/GID different from the default (1000:1000), you must update the values in the .env file so the containers have proper permissions for project files and SSH.

💡 In short: each user sets their own UID/GID in the .env file, which gives them full control over their project files. Bind mounts ensure file synchronization between the container and the host, providing full file access without permission issues.

Example `.env` files:

```bash
.env
USER_ID=1000
GROUP_ID=1000
```
Check your UID/GID on Linux/WSL:
```bash
id -u   # Your UID
id -g   # Your GID
``` 

If the values are different from 1000, update them in .env:
```bash
USER_ID=1004 # Example value
GROUP_ID=1004 # Example value
```

> 🔑Additionally, group_add: "${GROUP_ID}" allows the Node user inside the container (UID from .env) to access the host SSH socket, regardless of the host’s UID/GID configuration.

Thanks to this setup, both the frontend container (e-commerce-store) and the test container (e2e-tests) work correctly, and project files as well as the SSH socket have proper permissions.

---

3.3. Starting the Development Environment from the Project Root Directory

Start the frontend container:

```bash
 chmod +x startdev.sh  # Grant execute permissions (only required the first time)
./startdev.sh
```

The script will execute: 

```bash
docker compose up -d e-commerce-store # Start the frontend container
docker compose exec -it e-commerce-store bash # Enter the container as the default node user
```

> ⚠️ IMPORTANT:
> - The `startdev.sh` script:
    > - Automatically starts the SSH agent, checks and loads SSH keys, and ensures proper permissions for the SSH socket inside the container. No password input or manual permission changes are required.
    > - On the first run of the frontend container, it starts the development server and opens a terminal inside the container.

💡 If you are not using Git inside the container, the SSH agent is still started but does not require any additional configuration.
 
The `npm run dev` commands is not required inside the container, because the development server starts automatically when the frontend container is launched. If you try to run it manually in the same container, port 3000 will already be in use and a conflict may occur.

In the development environment, the application runs inside the frontend container (e-commerce-store) and is automatically available in the browser at:

```bash
http://localhost:3000
```

You are now inside the container terminal and can run:

```bash
npm install # Install all dependencies after the first project clone.
            # Use again only when adding new packages.
```

In the production environment, the Docker image uses Nginx to expose the application at:

```bash
http://localhost:8080
```

Stopping the Environment
After finishing your work, simply run:

```bash
docker compose down
```

- Because volumes in docker-compose.yml are defined as bind mounts on WSL2, the down command removes only the containers (operating system, runtime), while your source code and the node_modules folder remain safely on disk (EXT4).
- On the next run of ./startdev.sh, Docker will reuse the existing files, eliminating the need to reinstall dependencies.
- Bind mounts remain intact, so node_modules do not need to be reinstalled.

---

### 🧪 Tests and Code Quality

The project includes automated unit, integration, and end-to-end (E2E) tests, as well as mechanisms for enforcing code quality standards.

1️⃣ Unit and Integration Tests

Run using Vitest:

```bash
npm test        # runs all unit and integration tests
npm run coverage # runs tests with a coverage report
```

---

2️⃣ End-to-End (E2E) Tests with Playwright

For E2E testing, you can use either the UI version (Trace Viewer) or CI:

### 🔍 Local (with UI Trace Viewer)

Launches the Playwright graphical interface, which is useful for debugging:

```bash
npm run e2e # UI mode (Trace Viewer)
```

- This command runs tests in UI mode (with windows)
- Test results are saved in the app/test-results/ directory
- The Playwright HTML report is generated in app/playwright-report/
- Works locally only — outside of Docker

### 🐳 In Docker (Recommended)

Running E2E tests in Docker requires the frontend container to be running, so port 3000 must be accessible to both the browser and the test containers.

1. Start the development environment (frontend):

Start the frontend container:

```bash
./startdev.sh # Starts the frontend container and enters it as the default node user
```

- The script starts the frontend container (e-commerce-store) with the host’s UID/GID, automatically launches the SSH agent and the development server, and opens a terminal inside the container.
- If you are not using Git inside the container, the SSH agent is still started without requiring additional configuration.

2. Starting the E2E Test Container

```bash
chmod +x startdev-e2e.sh # grant execute permissions (only required the first time)
./startdev-e2e.sh
```

- The script starts the e2e-tests container.
- The e2e-tests container has a depends_on relationship with e-commerce-store, which means Docker Compose will start the frontend container if it is not already running.
- ⚠️ depends_on does not guarantee that the frontend dev server (Vite) is ready and listening on port 3000.
- On the first run, the script requires an active SSH agent (SSH_AUTH_SOCK), as the frontend container may need Git authorization.
- After the first run, if the SSH agent is already active, startdev-e2e.sh can automatically start both the frontend and E2E containers.
- Thanks to tty: true, the frontend container remains active in the background, but E2E tests will not start automatically until the dev server is available.
- The role of depends_on is limited to ensuring container startup order and starting e-commerce-store before e2e-tests, preventing errors such as “frontend container does not exist.” It does not replace server readiness checks.
- The E2E container runs as your user (UID from the host), not as root. The Playwright image already includes all required browsers and system dependencies.

> 💡 The startdev-e2e.sh script prepares the e2e-tests container for running tests.
     > - On the first run, it requires an active SSH agent (SSH_AUTH_SOCK) and a running frontend server (started via ./startdev.sh).
     > - After the first run, once the SSH agent is active, both services can be started automatically using ./startdev-e2e.sh after stopping or removing the containers.

```bash
docker compose up -d e2e-tests # Start the E2E test container
docker compose exec -it e2e-tests bash # Enter the container as the ubuntu user (with host UID/GID)
```

You are now inside the container terminal and can run:

```bash
npm run test:e2e-ci # runs E2E tests in CI mode (headless, no UI) – everything runs as a regular user
```

- This command runs tests in headless mode (no browser windows)
- Test results are saved in the app/test-results/ directory
- The Playwright HTML report is generated in app/playwright-report/ and is visible on the host thanks to bind mounts

ℹ️ The Playwright image (mcr.microsoft.com/playwright:v1.57.0-noble) already includes all required browsers and system dependencies, so no additional installation or switching to root is needed.

🛡️ Important note on permissions (Non-Root)
In this project, E2E tests are not run as root.
Why this is better:
 - File ownership consistency: Reports and screenshots created in the container belong to the host user. You can open, edit, and delete them without using sudo.
 - Security: Browsers run with sandboxing enabled, which is the recommended security standard in 2026.
 - Compliance: The environment reflects secure configurations used in professional CI/CD systems.

> 💡 TIP: If you encounter a Permission denied error, make sure you do not have old test-results directories created by root. You can remove them with:
``` bash 
sudo rm -rf app/test-results app/playwright-report
```

---

🏗️ Production Environment Simulation for Testing
Instead of using the development server, you can test a static build.

E2E tests require a running application. To do this, first build the project and then start the static version.
You can do it as follows:

```bash
npm run build      # builds the application into the /dist directory
npm run start:e2e  # starts the static version of the application at http://localhost:3000
```

This version has no hot reload, no dev server, and no development tools—it behaves like the final user-facing application.

---

3️⃣ Pre-commit Code Quality Checks with Husky 🐶

Before each commit, it is recommended to verify that the code is correct and follows the project standards.
Husky runs the following checks in sequence:

```bash
npm run prettier  # checks if files are properly formatted (without writing changes)
npm run lint      # checks code style according to ESLint rules
npm run test      # runs unit and integration test
```

If you want to automatically fix file formatting, you can use:

```bash
npm run format   # automatically formats all files according to Prettier
```

This ensures that the code in the repository is always correct and consistent with the project standards.

### 4. 🚀 Continuous Integration and Continuous Delivery (GitHub Actions)

#### GitHub Actions Workflow – Tests and Source Code Scanning.

The repository includes configured GitHub Actions workflows that:
- Run unit, integration, and E2E tests (Playwright, headless mode) and perform source code security scanning in a dedicated workflow (`tests-ci.yml`)
- Build and publish a Docker image and perform a Trivy security scan of the image (`ci-cd.yml`)

1. Test Pipeline 

1.1. Unit, Integration, and E2E Tests:
  - Triggered on pushes to the following branches: main, develop, feature-fe
  - Tests are executed using Node.js 24.x
  - Playwright E2E tests run after the frontend is built and the development server is started
  -  📦 E2E Test Artifacts (CI)
    - During E2E test execution in GitHub Actions, Playwright test artifacts are generated:
      - HTML report (`playwright-report/`)
      - Traces that allow step-by-step analysis of test execution
    - Artifacts are automatically saved and available for download from the **Actions** tab for each pipeline run — including failed runs
    - This enables:
      - Debugging E2E failures without reproducing the issue locally
      - Analyzing application behavior in the CI environment
      - Downloading reports and traces for later documentation or test audits

1.2. Source Code Security Scan (Trivy FS Scan)
  - Scans the ./app directory and dependencies (node_modules)
  - Detects vulnerabilities in libraries and packages (CRITICAL / HIGH)
  - Does not scan business logic or secret data

---

2. Docker Pipeline – Continuous Delivery (CD)

2.1. Docker Image Build
- Builds a production-ready Docker image of the frontend (static `dist` build)
- Serves the application via Nginx (port 8080)
- Publishes the image to GitHub Container Registry (ghcr.io)

The Docker image is published **only after all tests pass successfully**.
This ensures that end users can immediately use a ready-to-run, verified image without manually building it.

##### What Does the Docker Image Contain?

The image is built in multiple stages:

2.1.1. The image is built in multiple stages:

- Copies the entire codebase and installs all dependencies (both dependencies and devDependencies)
- Runs unit and integration tests

### ⚠️ Notes on E2E Tests in the Docker Image

E2E tests **are not executed during the Docker image build (docker build)**, for the following reasons:

- **Build Environment Isolation**  
  During the `docker build` phase, the environment is temporary and isolated.
  E2E tests require a running server available at a specific URL, which is difficult or impossible to configure reliably during the build process.

- **Nature of Server Processes**  
  Running a server (e.g., Vite) is a long-lived process that does not terminate on its own.
  Docker build requires each instruction to finish before moving to the next one, which makes it impossible to run a server and execute E2E tests in the same build step.

- **Separation of Responsibilities**  
  E2E tests are executed in a separate container (`e2e-tests`) only after the application has fully started.
  This allows tests to run in near-production conditions and communicate with the application over the Docker network—exactly as a real user would.

2.1.2. Frontend Build

- Compiles the React application (creates the dist directory)

2.1.3. Serving the Application with Nginx

- Copies files from the dist directory to the directory served by Nginx
- Configures permissions so that Nginx runs as the nginx user
- Default port: 8080

As a result, the image is ready to be used in both development and production environments.

2.2. Running a Trivy Security Scan on Tag Push
  - Analyzes the final Docker image
  - Detects CRITICAL/HIGH vulnerabilities in the operating system and libraries
  - Runs only when an image tag is pushed

2.3 Testing the Production Image
> ℹ️ **GitHub Actions (CI)**  
> In the CI pipeline, the application is started **from the final Docker image**
> (served by Nginx) on the GitHub Actions runner
> and is available locally at:
>
```bash
 http://localhost:8080
```
> End-to-end tests (Playwright) are executed in headless mode
> **directly against the running production image**,
> without using a development server (Vite).

> This ensures that CI tests validate exactly the same artifact,
> that is published to the GitHub Container Registry (ghcr.io).

---

### 5. 🐳 Dev Container (VS Code)

The project supports running in a VS Code Dev Container, providing a consistent development environment without the need to install Node.js, Docker, or project dependencies directly on the host machine.

🚀 Starting the Dev Container

1. Open the project in Visual Studio Code
2. VS Code will display the prompt “Reopen in Container”
(or manually select: Dev Containers: Reopen in Container)
3. VS Code will:
 - Build the container image
 - Start the frontend container e-commerce-store
 - Automatically start the development server

> Note: The npm run dev command works only when running locally on the host. Inside the container, the development server starts automatically, and port 3000 is already in use by that process.

The frontend running inside the container is available in the browser at:

```bash
http://localhost:3000
```

🔑 SSH in the Dev Container
- The Dev Container can automatically forward the SSH agent from the host when using the standard configuration and opening the project directly in VS Code.
- Private SSH keys are not copied into the container — they are accessed via the SSH agent socket.
- Git inside the container can use the local user configuration if .gitconfig and .ssh/known_hosts files are available in the container.
- git pull / git push operations work without additional configuration only in the standard Dev Container setup (without a custom docker-compose.yml).
- When using a custom docker-compose.yml, the SSH socket (SSH_AUTH_SOCK) as well as the .ssh and .gitconfig files must be manually mapped for SSH-based push/pull operations to work.

---
💡 Configuration and Volumes

The frontend container e-commerce-store in the Dev Container includes:

- The project workspace mounted at:

```bash
/workspace
```

- Port forwarding:

```bash
3000:3000
```

- tty: true – keeps the container running in the background

⚡ E2E Container (Playwright)

- The e2e-tests container is available as a separate Docker service.
- In the Dev Container environment:
  - It can be started automatically via depends_on.
  - It runs in manual mode (tail -f /dev/null).
- E2E tests are executed:
  - Manually during development
  - Automatically in CI (GitHub Actions)
> Thanks to this approach, E2E tests do not block the startup of the development environment..

📂 Repository Structure

```bash
E-Commerce-store/
├─ .devcontainer/                  # Dev Container configuration for VS Code
│   ├─ devcontainer.json           # Development container configuration file
│   └─ dotfiles/.bashrc            # Additional shell settings inside the container
├─ .github/workflows/              # GitHub Actions workflows
│   ├─ ci-cd.yml                   # CI/CD: tests, Docker image build, publish to GHCR
│   └─ test-ci.yml                 # UUnit, integration, and E2E test execution
├─ .husky/pre-commit               # Code quality checks before commit
├─ app/                            # Main frontend application folder (Vite + React)
│   ├─ e2e/                           # End-to-end tests (Playwright)
│   ├─ public/                        # Public static files (images, favicon, etc.)
│   ├─ src/                           # Application source code
│   │   ├─ App.jsx                    # Main React application component
│   │   ├─ main.jsx                   # Entry point (React rendering))
│   │   ├─ constants.js               # Global application constants
│   │   ├─ GlobalAppStyles.jsx        # Global application styles
│   │   ├─ components/                # React components
│   │   │   ├─ common/                # Shared components (e.g., Button, Modal)
│   │   │   └─ sections/              # Page sections/fragments (e.g., Navigation, Hero, Footer)
│   │   ├─ context/                   # React contexts
│   │   ├─ hooks/                     # Custom hooks
│   │   ├─ layout/                    # Page layouts
│   │   ├─ pages/                     # Application views/pages
│   │   ├─ screenshots/               # Screenshots (desktop and mobile
│   │   ├─ store/                     # Redux Toolkit store
│   │   ├─ __tests__/                 # Unit and integration tests
│   │   └─ __mocks__/                 # Test mocks (MSW)
│   └─ package.json                   # Project dependencies and scripts (frontend)
├─ README.md                          # Project documentation
├─ startdev.sh                        # Script to start the Docker-based development environment
├─ startdev-e2e.sh                    # Script to start the Docker E2E testing environment
├─ .dockerignore                      # Files ignored during Docker image build
├─ .env                               # USER_ID=1000, GROUP_ID=1000
├─ .gitignore                         # Files ignored by git
├─ docker-compose.yml                 # Docker Compose configuration (dev)
├─ Dockerfile                         # Docker image definition (tests + build + Nginx)
├─ nginx.conf                         # Nginx configuration
```

✨ Project Status

This project is developed for educational purposes.
Further development and extensions are possible.