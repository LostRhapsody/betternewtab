# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OmegaTab is a customizable browser new tab replacement. It's a monorepo using Turborepo with four workspaces: a Vue.js client app, a Vue.js landing page, VitePress documentation, and a Rust backend server.

## Common Commands

### Root Level (Turborepo)
```bash
bun dev        # Run all workspaces in dev mode
bun build      # Build all workspaces
bun lint       # Lint all workspaces
bun test       # Run tests across workspaces
```

### Client App (client/)
```bash
bun dev:all         # Dev server + Tailwind watcher (recommended for development)
bun start           # Lint + dev:all
bun lint            # Biome check with auto-fix
bun type-check      # TypeScript type checking (vue-tsc)
bun test:unit       # Vitest in watch mode
bun test:run        # Vitest single run
bun test:e2e        # Cypress E2E tests
bun build           # Production build (runs lint, tailwind, type-check, build, and tests)
```

### Backend Server (server/)
```bash
cargo run                  # Run the server
cargo watch -x run         # Dev server with auto-reload
cargo test                 # Run tests
cargo clippy               # Linting
cargo build --release      # Production build
```

### Landing Page (landing-page/)
```bash
bun dev:all      # Dev server + Tailwind watcher
bun build        # Production build
```

### Docs (docs/)
```bash
bun dev          # VitePress dev server
bun build        # Build documentation
```

## Architecture

### Backend (Rust/Axum)
- **Entry point**: `server/src/main.rs` - Contains all HTTP route handlers and app initialization
- **Database**: SQLite via SQLx with type-safe queries (`database.rs`)
- **Authentication**: JWT-based auth with middleware (`middleware.rs`, `user_jwt.rs`)
- **System tray**: Desktop app with tray icon support (`tray.rs`)
- **Static assets**: Embedded SPA serving via rust-embed (`assets.rs`)
- API routes are prefixed with `/api`
- The server runs on `127.0.0.1:3000`

### Client (Vue 3 + TypeScript)
- **State management**: Pinia stores in `src/stores/` - user, links, settings, searchEngine, feedback
- **API layer**: Axios client with interceptors in `src/services/api.ts` - handles auth headers and token refresh
- **Auth service**: `src/services/auth.ts` - token storage in localStorage
- **Routing**: Vue Router with auth guards in `src/router/index.ts`
- **Caching**: Custom cache utility for user data, links, and settings
- **UI**: Vuetify 3 components with Tailwind CSS for styling

### Data Flow
1. User authenticates → JWT stored in localStorage
2. API requests include Bearer token via Axios interceptor
3. Pinia stores fetch/cache data from API
4. Links and settings are cached locally for fast page loads
5. Background server refresh updates cache with latest data

### Key Types
- `Link`: User bookmarks with url, title, description, icon, column_type, order_index
- `UserSettings`: Settings blob stored as JSON (search_history, autosuggest, metadata flags)
- `UserContext`: JWT claims extracted in middleware (user_id, email)

## Environment Setup

Backend requires `JWT_SECRET` in `.env`. Client requires `VITE_API_BASE_URL`. See README for full env var documentation.

SQLite database is created automatically at platform-specific paths:
- Linux: `~/.local/share/OmegaTab/omega-tab.db`
- macOS: `~/Library/Application Support/OmegaTab/omega-tab.db`
- Windows: `%APPDATA%/OmegaTab/omega-tab.db`
