# Implementation Plan: Single Executable Distribution

Convert BetterNewTab from a Docker/Postgres setup to a single distributable executable with embedded SQLite, static file serving, and system tray support.

---

## Phase 1: SQLite Migration

### 1.1 Update Dependencies
**File:** `server/Cargo.toml`

Change SQLx features:
```toml
# FROM:
sqlx = { version = "0.8", features = [ "runtime-tokio", "tls-native-tls", "postgres", "macros", "chrono", "uuid" ] }

# TO:
sqlx = { version = "0.8", features = [ "runtime-tokio", "sqlite", "macros", "chrono" ] }
```

### 1.2 Create SQLite Migrations
**New folder:** `server/migrations_sqlite/`

**New file:** `server/migrations_sqlite/001_initial_schema.sql`

Key conversions from Postgres:
| Postgres | SQLite |
|----------|--------|
| `UUID` | `TEXT` |
| `TIMESTAMPTZ` | `TEXT` (ISO 8601) |
| `JSONB` | `TEXT` (JSON string) |
| `uuid_generate_v4()` | Generate in Rust |
| `$1, $2` params | `?` params |
| `NOW()` | `datetime('now')` |

Remove: `CREATE EXTENSION`, PL/pgSQL functions

### 1.3 Rewrite Database Layer
**File:** `server/src/database.rs`

Changes:
1. Import `SqlitePool`/`SqlitePoolOptions` instead of Pg variants
2. Change `pool: PgPool` to `pool: SqlitePool`
3. Update connection init to use `sqlite:path?mode=rwc`
4. Run migrations on startup with `sqlx::migrate!`
5. Replace all `$1, $2` with `?` in queries
6. Remove `#[sqlx(try_from = "sqlx::types::Uuid")]` annotations
7. Remove `uuid::Uuid::parse_str()` calls (IDs already strings)

### 1.4 Reimplement PL/pgSQL Functions in Rust
**File:** `server/src/database.rs`

Add methods:
- `create_organization()` - use transaction for atomicity
- `create_team()` - use transaction for atomicity

---

## Phase 2: Static File Serving

### 2.1 Add Dependencies
**File:** `server/Cargo.toml`
```toml
rust-embed = "8.2"
mime_guess = "2.0"
```

### 2.2 Create Asset Module
**New file:** `server/src/assets.rs`

- Use `#[derive(RustEmbed)]` with `#[folder = "../client/dist/"]`
- Serve exact file if exists
- Fallback to `index.html` for SPA routing
- Set correct MIME types

### 2.3 Update Router
**File:** `server/src/main.rs`

Add `.fallback(assets::serve_static)` as last route

---

## Phase 3: System Tray (All Platforms)

### 3.1 Add Dependencies
**File:** `server/Cargo.toml`
```toml
tray-icon = "0.14"
image = "0.24"

[target.'cfg(windows)'.build-dependencies]
embed-resource = "2.4"
```

### 3.2 Create Tray Module
**New file:** `server/src/tray.rs`

- Load icon from embedded bytes
- Create menu with "Exit Better New Tab" item
- Return channel for exit messages

### 3.3 Restructure Main
**File:** `server/src/main.rs`

- Add `#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]` to hide console on Windows
- Create tray on main thread (required for macOS)
- Spawn tokio runtime in separate thread
- Handle graceful shutdown via tray exit

### 3.4 Platform-Specific Setup
**New file:** `server/assets/icon.png` (for tray icon)
**New file:** `server/assets/icon.ico` (for Windows executable)
**New file:** `server/build.rs` (embed Windows icon)

---

## Phase 4: Branding & Distribution

### 4.1 Update Package Name
**File:** `server/Cargo.toml`
```toml
[package]
name = "better-new-tab"

[[bin]]
name = "BetterNewTab"
path = "src/main.rs"
```

### 4.2 Create Install Script
**New file:** `install.sh` (at repo root)

```bash
#!/bin/bash
# Detect OS/arch, download from GitHub releases, install to /usr/local/bin
```

### 4.3 Build Scripts
**New file:** `scripts/build-release.sh`

- Build Vue frontend: `cd client && npm run build`
- Build Rust server: `cd server && cargo build --release`
- Output to `dist/` folder

---

## Critical Files Summary

| File | Action |
|------|--------|
| `server/Cargo.toml` | Modify deps |
| `server/src/database.rs` | Major rewrite |
| `server/src/main.rs` | Add tray, static fallback |
| `server/src/assets.rs` | New file |
| `server/src/tray.rs` | New file |
| `server/migrations_sqlite/001_initial_schema.sql` | New file |
| `server/build.rs` | New file |
| `server/assets/icon.png` | New file |
| `install.sh` | New file |

---

## Implementation Order

1. **SQLite Migration** (most critical, enables everything else)
2. **Static File Serving** (enables single binary)
3. **System Tray** (enables background running)
4. **Branding & Installer** (final polish)

---

## Notes

- Database path: Use platform-appropriate data directory (e.g., `~/.local/share/betternewtab/data.db` on Linux)
- Port: Keep `127.0.0.1:3000` (localhost only for security)
- No auto-open browser per user preference
