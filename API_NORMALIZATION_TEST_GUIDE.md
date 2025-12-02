# API URL Normalization Fix - Testing & Verification Guide

## Summary
This fix eliminates the duplicate `/api` bug where requests were resolving to URLs like:
- ❌ `https://wash-ease-backend.vercel.app/api/api/laundry`

Instead of:
- ✅ `https://wash-ease-backend.vercel.app/api/laundry`

## Root Cause
The axios instance was configured with a `baseURL` that sometimes included `/api` and sometimes didn't, while request paths also inconsistently included `/api`, causing duplication.

## Solution
- Standardized `baseURL` to always end with `/api`
- Added request interceptor to strip accidental `/api` prefixes from paths
- Enhanced debug logging to diagnose URL resolution in dev mode
- Preserved all authentication and error handling logic

---

## Environment Configuration

### Development (.env)
```dotenv
VITE_API_BASE_URL=http://localhost:5001
```
**Behavior**: Axios normalizes to `http://localhost:5001/api`

### Production (.env.production)
```dotenv
VITE_API_BASE_URL=https://wash-ease-backend.vercel.app/api
```
**Behavior**: Axios uses as-is (already ends with `/api`)

### Legacy/Fallback (empty)
```dotenv
VITE_API_BASE_URL=
```
**Behavior**: Defaults to `/api` (dev proxy)

---

## Request Path Standards

**Going forward, all API calls should use paths WITHOUT the `/api` prefix:**

✅ **Correct:**
```javascript
api.get('/laundry')
api.post('/auth/signup', data)
api.get('/employee/orders')
api.put('/laundry/:id', updateData)
```

❌ **Incorrect (will still work but not best practice):**
```javascript
api.get('/api/laundry')
api.post('/api/auth/signup', data)
```

The interceptor will handle both, but standardizing on `/api`-free paths is cleaner.

---

## Manual Testing Procedures

### Test 1: Production Build (Vercel Deployment)
**Setup:**
- Ensure `.env.production` has `VITE_API_BASE_URL=https://wash-ease-backend.vercel.app/api`
- Build and deploy to Vercel

**Steps:**
1. Open https://wash-ease.vercel.app
2. Open DevTools → Network tab
3. Perform signup, login, or any laundry action
4. Inspect network request

**Expected:**
- Request URL: `https://wash-ease-backend.vercel.app/api/auth/signup` (single `/api`)
- NO requests to `https://wash-ease-backend.vercel.app/api/api/*`
- Status 200/201/400 (normal API responses)

**Verify Console Output:**
- No `[API Config]` logs (production mode)

---

### Test 2: Local Development (localhost:5001)
**Setup:**
- Ensure `.env` has `VITE_API_BASE_URL=http://localhost:5001`
- Run backend on port 5001: `npm run dev` in `server/`
- Run frontend: `npm run dev` in `client/`

**Steps:**
1. Open http://localhost:5173 in browser
2. Open DevTools → Console tab
3. Look for logs starting with `[API Config]`
4. Perform signup/login action
5. Open Network tab and inspect request

**Expected:**
- Console shows:
  ```
  [API Config] VITE_API_BASE_URL: http://localhost:5001
  [API Config] Normalized BASE_URL: http://localhost:5001/api
  ```
- When making requests, console shows:
  ```
  [API Request] POST http://localhost:5001/api/auth/signup
  [API Request] GET http://localhost:5001/api/laundry
  ```
- Network request URL: `http://localhost:5001/api/auth/signup`
- Response status: 200/201/400 (normal)

---

### Test 3: Duplicate /api Resilience
**Purpose**: Verify that even if code accidentally uses `/api/laundry`, it normalizes correctly

**Setup:**
- Same as Test 2 (localhost dev)

**Steps:**
1. Open DevTools → Console
2. Run this test code:
```javascript
import api from './src/utils/axios.js';

// Test case 1: Request with /api prefix
api.get('/api/laundry')
  .then(res => console.log('✅ /api/laundry worked:', res))
  .catch(err => console.log('Request (should work):', err.config?.url));

// Test case 2: Request without /api prefix
api.get('/laundry')
  .then(res => console.log('✅ /laundry worked:', res))
  .catch(err => console.log('Request (should work):', err.config?.url));

// Test case 3: Absolute external URL (should not be modified)
api.get('https://example.com/data')
  .catch(err => console.log('External URL:', err.config?.url));
```

**Expected:**
- Both `/api/laundry` and `/laundry` should resolve to the same final URL: `http://localhost:5001/api/laundry`
- No `/api/api` in any resolved URLs
- External URLs remain untouched

---

### Test 4: Dev Proxy Mode
**Purpose**: Verify relative `/api` paths work for Vite proxy setup

**Setup:**
- Set `.env` to `VITE_API_BASE_URL=` (empty or `/api`)
- Ensure Vite config has proxy for `/api`:
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
}
```

**Steps:**
1. Run frontend: `npm run dev`
2. Make a request
3. Inspect network tab

**Expected:**
- Request to `/api/laundry` (relative)
- Proxied to `http://localhost:5001/api/laundry`
- Works without changing code

---

### Test 5: Authentication Token Attachment
**Purpose**: Verify tokens are still attached and 401 handling works

**Setup:**
- Same as Test 2 (localhost dev)
- User logged in (token in localStorage)

**Steps:**
1. Open DevTools → Network tab
2. Make any API request (e.g., load dashboard)
3. Inspect request headers
4. Clear localStorage: `localStorage.clear()`
5. Make another request expecting 401

**Expected:**
- Authenticated requests have `Authorization: Bearer <token>` header
- 401 response redirects to `/login` or `/employee/login`
- No errors in console (auth logic preserved)

---

### Test 6: Network Error Messages
**Purpose**: Verify helpful error messages when backend is unreachable

**Setup:**
- Same as Test 2 (localhost dev)
- Stop backend server

**Steps:**
1. Try to make an API request
2. Check network tab → request fails
3. Check console for error message

**Expected:**
- Console shows: `Network error: unable to reach API at http://localhost:5001/api`
- Clear indication of what URL was attempted
- No misleading `/api/api` in error message

---

## Automated Tests

### Prerequisites
Ensure `vitest` is installed:
```bash
npm install --save-dev vitest
```

### Running Tests
```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- axios.test.js

# Watch mode
npm run test -- --watch
```

### Test File
Location: `client/src/utils/axios.test.js`

Tests cover:
1. **normalizeBase()** function:
   - Empty/null input → defaults to `/api`
   - Full URLs get `/api` suffix
   - No duplicate `/api` suffix
   - Trailing slashes removed

2. **normalizeRequestUrl()** function:
   - Strips `/api` prefix when base ends with `/api`
   - Leaves paths unchanged when already clean
   - Preserves absolute external URLs
   - Ensures relative URLs start with `/`

3. **Integration tests**:
   - Production scenario: `https://wash-ease-backend.vercel.app/api` + `/laundry` = no duplication
   - Dev scenario: `http://localhost:5001` + `/auth/signup` = correct path
   - All real-world combinations never produce `/api/api`

---

## Code Audit Checklist

- [ ] Run automated tests: `npm run test`
- [ ] All tests pass with 100% coverage for normalization functions
- [ ] Manual Test 1 (Production): No `/api/api` in network requests
- [ ] Manual Test 2 (Local Dev): Console shows correct normalized BASE_URL
- [ ] Manual Test 3 (Resilience): Both `/api/laundry` and `/laundry` work
- [ ] Manual Test 4 (Proxy): Dev proxy still works
- [ ] Manual Test 5 (Auth): Tokens attached, 401 redirects work
- [ ] Manual Test 6 (Errors): Network errors show correct attempted URL

---

## Deployment Checklist

**Before Merging:**
1. All automated tests pass
2. Manual tests 1-6 pass in your environment
3. Commit message is descriptive
4. PR description explains the fix and acceptance criteria

**After Merge to Main:**
1. Deploy to staging environment
2. Run manual tests on staging
3. Verify Vercel build succeeds
4. Deploy to production
5. Monitor error logs for any regressions

---

## Acceptance Criteria

### ✅ Core Requirements
1. **No duplicate `/api` paths**
   - Given `VITE_API_BASE_URL=https://wash-ease-backend.vercel.app/api`
   - When calling `api.get('/api/laundry')`
   - Then request resolves to `https://wash-ease-backend.vercel.app/api/laundry` (NOT `/api/api/laundry`)

2. **Production works correctly**
   - Deployed to Vercel with `.env.production`
   - All endpoints resolve without duplication
   - Authentication and error handling preserved

3. **Development works correctly**
   - Local dev with `http://localhost:5001`
   - Requests properly resolve to `http://localhost:5001/api/*`
   - Debug logs show normalized BASE_URL

4. **Backward compatibility**
   - Existing code using `/api/laundry` still works (normalized)
   - New code can use cleaner `/laundry` paths
   - Token attachment and 401 handling unchanged

5. **Test coverage**
   - Automated tests pass for all URL combinations
   - No regressions detected after changes

---

## Rollback Plan

If issues occur post-deployment:

1. **Quick rollback:**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **If tests weren't run:**
   - Check that `axios.test.js` passes locally before deploying again
   - Verify `.env` and `.env.production` have correct values

3. **Debug info to collect:**
   - Screenshot of DevTools Network tab showing failing URL
   - Console logs (especially `[API Config]` and `[API Request]` lines)
   - Network request headers
   - Backend logs if available

---

## Summary Table

| Scenario | Input | Expected URL | Status |
|----------|-------|--------------|--------|
| Prod: Base with /api | `VITE_API_BASE_URL=https://...vercel.app/api` + `/api/laundry` | `https://.../api/laundry` | ✅ |
| Prod: Base without /api | `VITE_API_BASE_URL=https://...vercel.app` + `/api/laundry` | `https://.../api/laundry` | ✅ |
| Dev: localhost | `VITE_API_BASE_URL=http://localhost:5001` + `/auth/signup` | `http://localhost:5001/api/auth/signup` | ✅ |
| Proxy: Relative path | `VITE_API_BASE_URL=/api` + `/laundry` | `/api/laundry` | ✅ |
| Fallback: Empty | `VITE_API_BASE_URL=` + `/laundry` | `/api/laundry` | ✅ |
| External URL | `VITE_API_BASE_URL=http://localhost:5001/api` + `https://other.com/data` | `https://other.com/data` | ✅ |
