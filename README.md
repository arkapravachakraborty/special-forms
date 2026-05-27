# ✦ Special Forms

A stunning, full-stack, type-safe form builder and response collection engine. Built with a highly curated minimal **white theme**, end-to-end type safety, and a robust Turborepo workspace architecture.

---

## 🎨 System Aesthetics & Interface

Special Forms is designed with visual excellence at its core:
* **Curated Warm-Ivory Canvas**: Pristine layouts utilizing custom soft backdrops (`#FAF9F6`), glowing active selectors, and sleek geometric spacing.
* **Holographic Glassmorphism**: High-resolution abstract 3D visual panels combined with frosted-glass testimonial widgets.
* **Micro-Animations**: Equipped with responsive transition effects (glow states, slide-ins, and click scale transforms) that make the interface feel alive.

---

## ⚡ Core Capabilities

* **✦ End-to-End Type Safety**: Share input types directly from database schemas to your frontend forms. No manual code generator steps required.
* **✦ Dynamic Form Schema Builder**: An intuitive visual designer allowing you to add, order, and configure custom input fields (`TEXT`, `NUMBER`, `EMAIL`, `PASSWORD`, `YES_NO`) on the fly.
* **✦ Real-Database Response Submission**: Encrypt and store anonymous form responses in a PostgreSQL database via public tRPC endpoints.
* **✦ Submissions Inspector Spreadsheet**: A secure, dynamic spreadsheet data grid that renders columns on the fly matching the exact schema definition of the form. Fully protected by session authorization guards.
* **✦ Password Complexity Analyzer**: Real-time password complexity visualization with smooth horizontal gradients.
* **✦ Sharing & Clipboard Integration**: Quick copying of public form URLs directly to the clipboard from your workspace cards.

---

## 🏗️ Monorepo Directory Architecture

Special Forms is built inside a high-performance **Turborepo monorepo** workspace:

```text
├── apps
│   ├── web          # Next.js 16 App Router (Turbopack, Tailwind CSS v4, Radix, Lucide)
│   └── api          # Express tRPC API server, hosting Scalar OpenAPI docs
├── packages
│   ├── database     # Drizzle ORM schemas, migration setup, and connection adapter
│   ├── trpc         # Core client and server endpoints & schemas configuration
│   ├── services     # Isolated business logic services (UserService, FormService, SubmissionService)
│   └── logger       # Lightweight shared telemetry log utilities
```

---

## 🚀 Quick Start

Ensure you have **Node.js (>=18)** and **pnpm** installed on your system.

### 1. Link Environment Configurations
Run the setup shell script to configure `.env` configurations across apps and packages:
```bash
./setup.sh
```

### 2. Boot the Local PostgreSQL Database
Spin up the local PostgreSQL container in the background using Docker Compose:
```bash
pnpm db:up
```

### 3. Start the Development Servers
For optimal resource management and compile speeds on Windows, start only the Next.js frontend and the Express API server side-by-side:
```bash
pnpm --filter web --filter @repo/api dev
```
*(Alternatively, you can run all workspace services in parallel via `pnpm dev`).*

### 4. Explore the Workspace Links

| Endpoint | Purpose |
| :--- | :--- |
| **`http://localhost:3000`** | **Landing Homepage** (featuring dynamic session detection) |
| **`http://localhost:3000/signup`** | **Sign Up** (with real-time password strength analyzer) |
| **`http://localhost:3000/signin`** | **Sign In** (session token setter) |
| **`http://localhost:3000/dashboard`** | **Workspace Workspace Grid** (create forms, view responses, delete) |
| **`http://localhost:8000/docs`** | **Scalar OpenAPI Docs** (interactive backend sandbox) |

---

## 🛠️ CLI Reference Commands

| Command | Action |
| :--- | :--- |
| **`pnpm db:up`** | Spins up the PostgreSQL container |
| **`pnpm db:down`** | Shuts down database services and releases ports |
| **`pnpm dev`** | Runs development watchers for all workspaces |
| **`pnpm build`** | Bundles all applications for production deployment |
| **`pnpm check-types`** | Compiles TypeScript declarations checking for syntax issues |
| **`pnpm format`** | Invokes Prettier code styling across all code files |

---

<div align="center">
  <span className="text-zinc-400">Special Forms is designed & engineered by the Special Forms team.</span>
</div>
