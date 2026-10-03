---
name: nextjs-app-b-hardening-and-qa
description: Master skill for hardening, cleaning, testing, and applying resilient error handling (moderate chaos validation) to Next.js client applications (App B) prior to production deployment. Covers code cleanup, proxy API key protection, HTTP-Only cookies, Vitest + Playwright testing, double-submit protection, and malformed response safety.
---

# Next.js App B Hardening, Cleaning, and Testing Suite

Master workflow for cleaning code, implementing robust security/session proxies, establishing a lightweight QA testing stack (Vitest + Playwright), and guaranteeing resilience against network/server errors (moderate chaos testing) in Next.js client applications prior to production deployment.

---

## 🛡️ Core Stability Rules

> **GOLDEN RULE: Absolute Compatibility & Zero Breakage**
> Always keep refactoring conservative and functionally identical. Do not modify working Next.js routing patterns, proxy contract schemas, or core auth states. If refactoring introduces risk, preserve the proven implementation while wrapping it in resilient guards.

---

## 🚀 4-Stage Pre-Deployment Workflow

```
[ Stage 1: Cleanup & DRY ] ──> [ Stage 2: Security & Sessions ] ──> [ Stage 3: Vitest + Playwright QA ] ──> [ Stage 4: Resilience & Chaos ]
```

---

### Stage 1: Codebase Cleanup & Optimization

1. **File & Folder Hygiene**:
   - Audit `/public` and `/src` to strip default SVGs, unused template boilerplate files, and orphan components.
   - Remove unused or heavy npm dependencies to minimize production bundle sizes.

2. **DRY Server Configuration (`serverApiConfig.ts`)**:
   - Centralize proxy URL resolution and header injection to avoid repeating `fetch` configuration across routes:
   ```typescript
   // src/lib/serverApiConfig.ts
   export function getApiConfig() {
     const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example.com";
     const API_KEY = process.env.BPS_API_KEY ?? "";
     return {
       API_BASE: API_BASE.replace(/\/+$/, ""),
       headers: {
         "X-API-KEY": API_KEY.trim(),
         "Content-Type": "application/json",
       },
     };
   }
   ```

3. **Component Error Boundaries**:
   - Wrap sensitive UI sections (data cards, metric grids, tables) in `<ErrorBoundary>` fallback components to isolate rendering failures.

---

### Stage 2: Security & Session Hardening

1. **Server-Only API Key Protection**:
   - Store API keys strictly in `.env.local` without `NEXT_PUBLIC_` prefixes.
   - Inject secrets exclusively server-side inside Next.js API route proxies (`/api/*`). Never leak credentials to browser bundles.

2. **HTTP-Only Cookie Session Management**:
   - Protect session state against XSS by setting `httpOnly: true`, `secure: isProd`, `sameSite: 'lax'`, and long-term `maxAge` (e.g. 30 days) on authentication:
   ```typescript
   response.cookies.set("bps_solsel_auth_verified", "true", {
     path: "/",
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "lax",
     maxAge: 60 * 60 * 24 * 30, // 30 Days
   });
   ```

3. **Next.js 16 Server Route Guard (`src/proxy.ts` / Middleware)**:
   - Enforce server-side route guards before request execution reaches client components. Redirect unauthenticated users safely to `/login`.

4. **Payload Validation & Sanitization**:
   - Trim string inputs, validate payload types, and enforce maximum length safety bounds (e.g., 255 chars) before forwarding requests to backend endpoints.

---

### Stage 3: Lightweight Testing Setup (QA Stack)

1. **Unit & Proxy Route Testing (Vitest + ESM)**:
   - Configure Vitest in [`vitest.config.mts`](file:///d:/Development/landingpageintra/vitest.config.mts) for sub-second execution.
   - Write tests mocking global `fetch` to verify header injection, bad payload rejections (`400 Bad Request`), and backend error mapping (`502 Bad Gateway`).

2. **End-to-End Flow Testing (Playwright - Headless Mode)**:
   - Configure Playwright in [`playwright.config.ts`](file:///d:/Development/landingpageintra/playwright.config.ts).
   - Write E2E tests verifying: page rendering -> credential input -> form submit -> route redirection -> `Status: Terverifikasi` badge display.

3. **Package.json Integration**:
   ```json
   "scripts": {
     "test:unit": "vitest run",
     "test:unit:watch": "vitest",
     "test:e2e": "playwright test",
     "test:e2e:ui": "playwright test --ui"
   }
   ```

---

### Stage 4: Moderate Chaos & Resilience Handling

1. **Rapid Double-Submit Protection (Button Spamming Guard)**:
   - Combine a synchronous `useRef` lock with `isSubmitting` state guard to block rapid-fire double clicks:
   ```typescript
   const isProcessingRef = useRef(false);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (isSubmitting || isProcessingRef.current) return;
     isProcessingRef.current = true;
     setIsSubmitting(true);

     try {
       await login(username, password);
     } finally {
       setIsSubmitting(false);
       isProcessingRef.current = false;
     }
   };
   ```
   - Disable inputs and apply `pointer-events-none opacity-60` styling on submit buttons during request processing.

2. **Malformed Response Protection (`Unexpected token <` Prevention)**:
   - Intercept non-JSON responses (raw HTML 500/502 server crash pages from backends) using a safe parser wrapper:
   ```typescript
   export async function safeParseJsonResponse<T>(res: Response): Promise<T | null> {
     try {
       if (typeof res.text === "function") {
         const rawText = await res.text();
         if (!rawText || !rawText.trim() || rawText.trim().startsWith("<")) return null;
         return JSON.parse(rawText) as T;
       }
       return typeof res.json === "function" ? ((await res.json()) as T) : null;
     } catch {
       return null;
     }
   }
   ```

3. **Network Latency & Loading UX**:
   - Provide visual feedback during slow networks using pulse skeleton loaders and inline button spinners.

---

## 📋 Pre-Deployment Verification Checklist

Before pushing Next.js App B to production or VPS:

- [ ] **Run Unit Tests**: `npm run test:unit` (Must pass all API proxy tests in `<3s`)
- [ ] **Run E2E Tests**: `npm run test:e2e` (Must pass headless login & navigation tests)
- [ ] **Verify Production Build**: `npm run build` (Zero TypeScript or linting errors, clean exit 0)
- [ ] **Secret Isolation**: Verify no `NEXT_PUBLIC_` environment variables expose sensitive API keys.
