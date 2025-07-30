# Auth Module

Modul autentikasi yang modular dan terstruktur untuk aplikasi Vue.js dengan shadcn-vue.

## 📁 Struktur Folder

```
src/modules/auth/
├── types/           # Type definitions & interfaces
├── constants/       # Constants & configuration
├── utils/          # Utility functions
├── services/       # API service layer
├── stores/         # Pinia store management
├── composables/    # Vue composables for reactive logic
├── guards/         # Router guards
├── setup.ts        # Easy setup configuration
├── index.ts        # Main entry point
├── README.md       # Comprehensive documentation
├── MIGRATION.md    # Migration guide from old structure
└── SUMMARY.md      # Complete summary of changes
```

## 🚀 Penggunaan

### Import

```typescript
// Import semua dari entry point utama
import {
  AUTH_ROUTES,
  authGuard,
  authService,
  useAuthStore,
  useLoginMutation
} from '@/modules/auth'
import { authService } from '@/modules/auth/services'
// Atau import spesifik
import { useAuthStore } from '@/modules/auth/stores'
```

### Store (Pinia)

```typescript
const authStore = useAuthStore()

// State
authStore.user // Current user
authStore.token // Auth token
authStore.isAuthenticated // Login status
authStore.isLoading // Loading state

// Actions
authStore.setAuth(token, user, remember)
authStore.clearAuth()
authStore.updateUser(userData)
authStore.hasPermission(permission)
authStore.hasRole(role)
```

### Composables (TanStack Query)

```typescript
// Login
const loginMutation = useLoginMutation()
await loginMutation.mutateAsync({
  email: 'user@example.com',
  password: 'password',
  rememberMe: true
})

// Register
const registerMutation = useRegisterMutation()
await registerMutation.mutateAsync({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password'
})

// Profile
const profileQuery = useProfileQuery()
// Auto-syncs with store

// Logout
const logoutMutation = useLogoutMutation()
await logoutMutation.mutateAsync()
```

### Services

```typescript
// Direct API calls (optional, composables preferred)
const response = await authService.login(loginData)
const user = await authService.getProfile()
await authService.logout()
```

### Router Guards

```typescript
// Di router/guard/index.ts
import { authGuard, permissionGuard, sessionGuard } from '@/modules/auth'

export function createRouterGuard(router: Router) {
  authGuard(router) // Basic auth check
  permissionGuard(router) // Role/permission check
  sessionGuard(router) // Session timeout check
}
```

### Route Meta

```typescript
// Contoh penggunaan di router
{
  path: '/admin',
  meta: {
    auth: true,              // Requires authentication
    role: 'admin',           // Requires specific role
    permissions: ['read'],   // Requires permissions
    guest: false             // Disallow if authenticated
  }
}
```

## 🔧 Utilities

### Token Utils
```typescript
import { TokenUtils } from '@/modules/auth'

TokenUtils.setToken(token, remember)
TokenUtils.getToken()
TokenUtils.removeToken()
TokenUtils.isTokenExpired(token)
TokenUtils.getTokenPayload(token)
```

### User Utils
```typescript
import { UserUtils } from '@/modules/auth'

UserUtils.getDisplayName(user)
UserUtils.getInitials(user)
UserUtils.hasPermission(user, permission)
UserUtils.hasRole(user, role)
```

### Session Utils
```typescript
import { SessionUtils } from '@/modules/auth'

SessionUtils.updateLastActivity()
SessionUtils.isSessionExpired()
SessionUtils.clearAuthData()
```

### Validation Utils
```typescript
import { ValidationUtils } from '@/modules/auth'

ValidationUtils.validateEmail(email)
ValidationUtils.validatePassword(password)
ValidationUtils.validateUsername(username)
```

## 🛡️ Security Features

- **Token Management**: Automatic token storage and refresh
- **Session Timeout**: Configurable inactivity timeout
- **Permission System**: Role-based and permission-based access control
- **Input Validation**: Built-in validation utilities
- **Secure Storage**: Proper token storage with remember me option

## 📝 Constants

```typescript
import {
  AUTH_ROUTES,
  AUTH_STORAGE_KEYS,
  SESSION_CONFIG,
  VALIDATION_RULES
} from '@/modules/auth'

// Use predefined constants
const loginRoute = AUTH_ROUTES.LOGIN
const tokenKey = AUTH_STORAGE_KEYS.TOKEN
const timeout = SESSION_CONFIG.INACTIVITY_TIMEOUT
```

## 🔄 Migration dari Struktur Lama

Lihat file `MIGRATION.md` untuk panduan lengkap migrasi dari struktur auth yang lama.

### Perubahan Utama:

1. **Store**: `isLogin` → `isAuthenticated`
2. **Service**: Function imports → `authService` object
3. **Guards**: Single guard → Multiple specialized guards
4. **Types**: Scattered types → Centralized type definitions
5. **Utils**: No utils → Comprehensive utility functions

## 🎯 Best Practices

1. **Gunakan Composables**: Lebih baik menggunakan composables daripada direct service calls
2. **Type Safety**: Selalu gunakan TypeScript types yang disediakan
3. **Error Handling**: Composables sudah handle error secara otomatis
4. **Performance**: Composables menggunakan TanStack Query untuk caching optimal
5. **Security**: Gunakan validation utils untuk input validation

## 🧪 Testing

```typescript
// Mock store untuk testing
import { useAuthStore } from '@/modules/auth'

const mockAuthStore = {
  isAuthenticated: true,
  user: { id: 1, name: 'Test User' },
  hasPermission: vi.fn(() => true),
  hasRole: vi.fn(() => true)
}
```

## 📋 TODO & Roadmap

- [ ] Add unit tests for all utilities
- [ ] Add E2E tests for auth flows
- [ ] Add social login support
- [ ] Add two-factor authentication
- [ ] Add account recovery flows
- [ ] Add audit logging
- [ ] Add rate limiting
- [ ] Add password strength meter
- [ ] Add session management dashboard

## 📚 Documentation

- **README.md** - Dokumentasi lengkap penggunaan module
- **MIGRATION.md** - Panduan migrasi dari struktur lama
- **SUMMARY.md** - Ringkasan lengkap fitur dan perubahan
