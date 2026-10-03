# Portal Tautan Internal BPS Kabupaten Solok Selatan

Frontend client application and API proxy buffer for BPS Solok Selatan internal applications portal. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

App B serves as the user-facing web portal and acts as a server-side proxy layer communicating with the legacy PHP backend (App A) hosted on a remote VPS.

---

## Overview

- **Server-Side API Proxy**: Proxies requests to the remote PHP backend and injects the `X-API-KEY` server-side (`.env.local`), keeping API secrets isolated from the client bundle.
- **Session Management**: Manages user sessions using HTTP-Only cookies (`bps_solsel_auth_verified`) valid for 30 days.
- **Password Hash Fallback**: Server proxy handles legacy password hash variations (SHA-256, MD5, SHA-1, BCRYPT) to support all database accounts in the `admin` table.
- **Client Features**: In-memory live search across application cards, category filters, and VPN access type mapping (Public vs Kedinasan VPN).
- **Resilience**: Safe JSON parsing (`safeParseJsonResponse`) for non-JSON/500 error responses from the backend, synchronous ref locks (`isProcessingRef`) to prevent rapid double-submit form submissions, and loading skeleton UI states.

---

## Architecture

```
User Browser  --->  Next.js App B (/api/* Proxy)  --->  PHP App A VPS  --->  MySQL DB
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://administators.bps1310.cloud/api
BPS_API_KEY=YOUR_SERVER_API_KEY
```

### Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Testing

```bash
# Run unit and API proxy tests (Vitest)
npm run test:unit

# Run end-to-end tests (Playwright Headless)
npm run test:e2e

# Run Playwright tests with UI mode
npm run test:e2e:ui
```

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/            # Server API proxy route handlers (/api/login, /api/layanan, /api/kategori)
│   │   ├── login/          # Login page UI & form handling
│   │   ├── error.tsx       # Global application error boundary
│   │   └── page.tsx        # Main landing page & search
│   ├── components/         # UI components (Navbar, HeroSection, LinkGrid, LinkCard, Modals)
│   ├── context/            # AuthContext provider & session management
│   ├── lib/                # Safe API fetchers, server API config, & access mappers
│   └── proxy.ts            # Edge middleware route guard
├── e2e/                    # Playwright E2E test specs
├── public/                 # Static assets (BPS Logo)
├── vitest.config.mts       # Vitest unit test runner config
└── playwright.config.ts    # Playwright E2E test runner config
```

---

## Documentation

Full project documentation and learning guides are available in the repository root:

- **Developer Learning Guide**: [`MODUL_PEMBELAJARAN.md`](MODUL_PEMBELAJARAN.md) ([HTML Version](MODUL_PEMBELAJARAN.html))
- **Formal Engineering Report**: [`LAPORAN_TEKNIS_PROYEK.md`](LAPORAN_TEKNIS_PROYEK.md) ([HTML Version](LAPORAN_TEKNIS_PROYEK.html))

---

## License

Internal Kedinasan - BPS Kabupaten Solok Selatan. All rights reserved.
