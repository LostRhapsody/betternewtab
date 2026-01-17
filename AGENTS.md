# AGENTS.md - AI Coding Agent Instructions

**OmegaTab** - Browser new tab replacement with Vue.js 3 + TypeScript frontend, Rust + Axum backend.

## Build/Lint/Test Commands

All commands run from `client/` directory using `bun`:

```bash
# Development
bun start           # Lint + dev server + Tailwind watcher
bun dev             # Vite dev server only
bun dev:all         # Dev server + Tailwind watcher (no lint)

# Building
bun build           # Full production build (lint + tailwind + type-check + build + test)
bun build:all       # Production build without lint/test
bun type-check      # TypeScript type checking only

# Linting
bun lint            # Biome check with auto-fix

# Testing
bun test:unit       # Vitest in watch mode
bun test:run        # Vitest single run
bun vitest run src/tests/stores/user.test.ts  # Single test file
bun vitest run -t "User Store"               # Tests matching pattern
bun test:e2e        # Cypress E2E tests
bun test:e2e:dev    # Cypress interactive mode

# Backend (Rust) - run from server/ directory
cargo build         # Build
cargo run           # Run dev server
cargo test          # Run tests
cargo clippy        # Linting
```

## Code Style Guidelines

### Formatting (Biome)
- **Indentation**: 2 spaces, **Quotes**: Double quotes
- Auto-organized imports, only `.ts` files in `src/` are linted

### TypeScript Conventions

#### Import Order
1. External packages (vue, pinia, axios, etc.)
2. Internal modules using `@/` alias
3. Type-only imports use `import type`

```typescript
import { defineStore } from "pinia";
import { API } from "@/constants/api";
import api from "@/services/api";
import type { User, UserState } from "@/types/User";
```

#### Naming Conventions
- Types/Interfaces: `PascalCase` (`UserState`, `User`)
- Functions: `camelCase` (`fetchUserData`, `setUserId`)
- Constants: `camelCase` or `SCREAMING_SNAKE` (`API.GET_USER_DATA`)
- Pinia stores: `use[Name]Store` (`useUserStore`)
- Components: `PascalCase` (`SearchBar.vue`)
- Composables: `use[Name]` (`useApi`)

#### Type Definitions
- Define types in `src/types/`, use `type` for objects, `interface` for contracts
- Always type function parameters and return values

```typescript
async function fetchUserData(clerk_user: User): Promise<boolean> { }
```

### Vue Components
Use Composition API with `<script setup lang="ts">`:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";

const props = defineProps<{ userId: string; }>();
const emit = defineEmits<{ update: [value: string]; }>();
</script>
```

### Pinia Stores
Use Options API style:

```typescript
export const useUserStore = defineStore("user", {
  state: (): UserState => ({ userId: null, isLoading: false, error: null }),
  actions: {
    async fetchUserData(clerk_user: User): Promise<boolean> {
      this.isLoading = true;
      try { /* API call */ }
      catch (error) { this.error = error as string; return false; }
      finally { this.isLoading = false; }
    }
  }
});
```

### Error Handling

#### Frontend Pattern
```typescript
try {
  const response = await api.get<UserDataResponse>(API.GET_USER_DATA);
  if (response.status !== 200) throw new Error(`Failed: ${response.status}`);
} catch (error) {
  this.error = error as string;
  cache.clear(CacheKeys.USER);
  return false;
} finally { this.isLoading = false; }
```

#### Backend Pattern (Rust)
```rust
let result = some_operation().map_err(|e| {
    tracing::error!("Error: {:?}", e);
    StatusCode::INTERNAL_SERVER_ERROR
})?;
```

### Testing (Vitest)
```typescript
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("User Store", () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks(); });
  afterEach(() => { vi.resetAllMocks(); });
  it("should have initial state", () => {
    const store = useUserStore();
    expect(store.userId).toBeNull();
  });
});
```

### Rust Conventions
- Functions/variables: `snake_case`, Structs/enums: `PascalCase`
- Use `tracing` for logging, `anyhow::Result` or `Result<T, StatusCode>` for errors
- Sentry integration for error monitoring

## Project Structure

```
client/src/
├── components/      # Vue SFC components
├── composables/     # Vue composables
├── constants/       # API endpoints, config
├── services/        # API service layer
├── stores/          # Pinia stores
├── types/           # TypeScript types
├── utils/           # Utility functions
└── views/           # Page components

server/src/
├── main.rs          # Entry + handlers
├── database.rs      # Database client (SQLite)
├── stripe_client.rs # Payments
└── middleware.rs    # Auth middleware
```

## Key Dependencies
- **Vue 3.5**, **Vue Router 4**, **Pinia 2.3**, **Tailwind CSS**
- **Axios** for HTTP, **JWT-based authentication**
- **Vitest** for unit tests, **Cypress** for E2E
- **Biome** for linting/formatting
