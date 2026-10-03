# BPS Solok Selatan Internal Application Portal

Next.js 16 client portal and API proxy for BPS Kabupaten Solok Selatan internal applications. Acts as a secure frontend and server-side proxy buffer communicating with the PHP legacy backend (App A) on a remote VPS.

## Key Features

- **Server API Proxy**: Proxies client requests to the remote PHP backend and injects secret API keys server-side (`.env.local`), keeping API credentials out of the browser bundle.
- **Client Live Search & Filtering**: In-memory search across application titles, keywords, descriptions, and category tags without per-keystroke API calls.
- **Access Segmentation**: Classifies links into Public Access vs. Internal VPN Access with visual badges and technical notes.
- **Session Security**: Uses HTTP-Only cookies (`bps_solsel_auth_verified`) for session verification with XSS defense.
- **Security Headers**: Includes Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and AI bot blocking rules via `robots.txt`.
- **Theme Persistence**: Light and Dark mode toggling with local storage memory.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-app-a-vps-domain.com/api
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

## Testing

```bash
# Run Vitest unit tests
npm run test:unit

# Run Playwright E2E tests
npm run test:e2e
```

## Nginx Reverse Proxy Setup (VPS)

When deploying behind Nginx on a Linux VPS, update your site configuration (`/etc/nginx/sites-enabled/your-domain.conf`):

```nginx
server {
  listen 80;
  listen 443 ssl http2;
  server_name your-domain.com;

  server_tokens off;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## License

Internal Kedinasan - BPS Kabupaten Solok Selatan. All rights reserved.
