# 🔄 Migration Guide: Auth Module Restructuring

Panduan lengkap untuk migrasi dari struktur auth lama ke struktur modular baru.

## 📋 Langkah-langkah Migrasi

1. **Update semua imports** dari struktur lama ke struktur modular baru
2. **Replace store usage** dengan `useAuthStore` yang baru
3. **Update service calls** untuk menggunakan `authService` baru
4. **Replace guard imports** dengan modular guards baru
5. **Update type imports** untuk menggunakan type definitions baru
6. **Test semua auth flows** berfungsi dengan benar
7. **Remove old auth files** setelah migrasi selesai

## 🗂️ Mapping Import Lama ke Baru

| **Import Lama** | **Import Baru** |
|-----------------|-----------------|
| `from '@/stores/auth'` | `from '@/modules/auth'` |
| `from '@/services/api/auth.api'` | `from '@/modules/auth'` |
| `from '@/composables/auth/useLoginMutation'` | `from '@/modules/auth'` |
| `from '@/composables/auth/useLogoutMutation'` | `from '@/modules/auth'` |
| `from '@/composables/auth/useProfileQuery'` | `from '@/modules/auth'` |
| `from '@/router/guard/auth-guard'` | `from '@/modules/auth'` |

## 📝 Contoh Migrasi

### Before ❌
```typescript
// Import terpisah dari berbagai folder
import { useAuthStore } from '@/stores/auth'
import { login, signUp, getProfile } from '@/services/api/auth.api'
import { useLoginMutation } from '@/composables/auth/useLoginMutation'
import { authGuard } from '@/router/guard/auth-guard'
```

### After ✅
```typescript
// Import semua dari satu module
import { 
  useAuthStore,
  authService, 
  useLoginMutation,
  authGuard,
  permissionGuard,
  sessionGuard
} from '@/modules/auth'
```

## 🏪 Store Usage

### Before ❌
```typescript
const authStore = useAuthStore()

// Basic functionality
authStore.setAuth(token, user)
authStore.clearAuth()
authStore.isLogin // computed property
```

### After ✅
```typescript
const authStore = useAuthStore()

// Enhanced functionality
authStore.setAuth(token, user, remember) // added remember parameter
authStore.clearAuth()
authStore.isAuthenticated // renamed from isLogin
authStore.hasPermission(permission) // new method
authStore.hasRole(role) // new method
authStore.updateActivity() // new method
authStore.checkSession() // new method
```

## 🔧 Service Usage

### Before ❌
```typescript
import { login, signUp, getProfile } from '@/services/api/auth.api'

const response = await login(payload)
const user = await getProfile()
```

### After ✅
```typescript
import { authService } from '@/modules/auth'

const response = await authService.login(payload)
const user = await authService.getProfile()
// Plus new methods:
await authService.changePassword(payload)
await authService.forgotPassword(payload)
await authService.resetPassword(payload)
```

## 🎣 Composables Usage

### Before ❌
```typescript
const loginMutation = useLoginMutation()
await loginMutation.mutateAsync(loginData)
```

### After ✅
```typescript
const loginMutation = useLoginMutation()
await loginMutation.mutateAsync({ 
  ...loginData, 
  rememberMe: true // new parameter
})

// Plus new composables:
const registerMutation = useRegisterMutation()
const changePasswordMutation = useChangePasswordMutation()
const forgotPasswordMutation = useForgotPasswordMutation()
const resetPasswordMutation = useResetPasswordMutation()
```

## 🛡️ Guards Usage

### Before ❌
```typescript
import { authGuard } from '@/router/guard/auth-guard'

export function createRouterGuard(router: Router) {
  authGuard(router)
}
```

### After ✅
```typescript
import { authGuard, permissionGuard, sessionGuard } from '@/modules/auth'

export function createRouterGuard(router: Router) {
  authGuard(router)        // Basic auth check
  permissionGuard(router)  // Role/permission check (NEW)
  sessionGuard(router)     // Session timeout check (NEW)
}
```

## 🏷️ Types Usage

### Before ❌
```typescript
import type { AuthUser, LoginPayload } from '@/services/api/auth.api'
```

### After ✅
```typescript
import type { 
  AuthUser,           // Enhanced interface
  LoginPayload,       // Enhanced interface
  AuthResponse,       // Enhanced interface
  AuthState,          // NEW
  AuthConfig,         // NEW
  Permission,         // NEW
  Role               // NEW
} from '@/modules/auth'
```

## 🎯 Route Meta Configuration

### New Features ✨
```typescript
// Enhanced route meta options
{
  path: '/admin',
  meta: {
    auth: true,                    // Requires authentication
    role: 'admin',                 // Requires specific role (NEW)
    permissions: ['read', 'write'], // Requires permissions (NEW)
    guest: false                   // Disallow if authenticated (NEW)
  }
}
```

## 🧰 New Utility Functions

```typescript
import { 
  TokenUtils,
  UserUtils, 
  SessionUtils,
  ValidationUtils 
} from '@/modules/auth'

// Token management
TokenUtils.setToken(token, remember)
TokenUtils.isTokenExpired(token)
TokenUtils.getTokenPayload(token)

// User management
UserUtils.getDisplayName(user)
UserUtils.getInitials(user)
UserUtils.hasPermission(user, permission)

// Session management
SessionUtils.updateLastActivity()
SessionUtils.isSessionExpired()
SessionUtils.clearAuthData()

// Validation
ValidationUtils.validateEmail(email)
ValidationUtils.validatePassword(password)
ValidationUtils.validateUsername(username)
```

## ⚠️ Breaking Changes

1. **Store computed property**: `isLogin` → `isAuthenticated`
2. **setAuth method**: Added third parameter `remember: boolean`
3. **API functions**: Now grouped under `authService` object
4. **Guard imports**: Multiple specialized guards instead of single guard
5. **Type definitions**: Enhanced interfaces with new properties

## ✅ Migration Checklist

- [ ] Update all imports to use `@/modules/auth`
- [ ] Replace `isLogin` with `isAuthenticated`
- [ ] Update `setAuth()` calls to include remember parameter
- [ ] Replace direct API calls with `authService` methods
- [ ] Update guard imports and add new guards
- [ ] Test login/logout flow
- [ ] Test registration flow
- [ ] Test password reset flow
- [ ] Test permission/role checks
- [ ] Test session timeout
- [ ] Remove old auth files
- [ ] Update unit tests
- [ ] Update E2E tests

## 🗑️ Files to Remove After Migration

```
src/
├── stores/auth.ts                           ❌ DELETE
├── services/api/auth.api.ts                 ❌ DELETE
├── composables/auth/                        ❌ DELETE
│   ├── useLoginMutation.ts                  ❌ DELETE
│   ├── useLogoutMutation.ts                 ❌ DELETE
│   └── useProfileQuery.ts                   ❌ DELETE
└── router/guard/auth-guard.ts               ❌ DELETE
```

## 🚀 Benefits After Migration

- ✅ **Modular structure** - Semua auth logic dalam satu folder
- ✅ **Better TypeScript support** - Comprehensive type definitions
- ✅ **Enhanced security** - Token validation, session management
- ✅ **Permission system** - Role-based and permission-based access
- ✅ **Utility functions** - Ready-to-use helper functions
- ✅ **Better DX** - Consistent API, better documentation
- ✅ **Performance** - TanStack Query optimization
- ✅ **Scalability** - Easy to extend and maintain

## 💡 Tips

1. **Migrate gradually** - Update one component at a time
2. **Test frequently** - Ensure each migration step works
3. **Use TypeScript** - Let the compiler guide you
4. **Check console** - Watch for migration warnings
5. **Update tests** - Don't forget to update your test files

## 🆘 Need Help?

- Check `README.md` for comprehensive documentation
- Look at `SUMMARY.ts` for complete feature overview
- Review new type definitions in `/types` folder
- Test utilities in `/utils` folder before using
