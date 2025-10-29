# Elevana — Next.js E‑commerce Demo

A lightweight Next.js e‑commerce demo app (TypeScript + Tailwind). This README replaces the default create-next-app content and documents how to run the project locally, start the mock API used by the frontend, and where to find important parts of the codebase.

---

## Quick summary

- Framework: Next.js (app router)
- Language: TypeScript
- Styling: Tailwind CSS
- Dev frontend: http://localhost:3000
- Mock API (json-server): http://localhost:5000

---

## Prerequisites

- Node.js 18+ (recommended)
- npm, pnpm or yarn
- Recommended: install json-server globally or run it with npx
- Linux commands shown below (you're on Linux)

---

## Install dependencies

From project root (/home/focus/Documents/Projects/elevana):

```bash
# npm
npm install

# or pnpm
pnpm install

# or yarn
yarn
```

---

## Mock API (json-server)

This project expects a simple JSON API at http://localhost:5000. The frontend fetches products, categories, reviews and orders from that API.

1. Create a `db.json` in the project root (example below).
2. Start json-server.

Example minimal `db.json` (expand fields as needed):

```json
{
  "products": [
    {
      "id": 1,
      "name": "Example Product",
      "description": "A sample product",
      "price": 29.99,
      "originalPrice": 39.99,
      "category": "electronics",
      "image": "/placeholder.svg",
      "images": ["/placeholder.svg"],
      "rating": 4.5,
      "reviews": 2,
      "stock": 10,
      "features": ["Feature A", "Feature B"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "categories": [
    { "id": "electronics", "name": "Electronics", "image": "/placeholder.svg", "productCount": 1 }
  ],
  "reviews": [
    {
      "id": "RV_1",
      "productId": "1",
      "userName": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "date": "2024-01-02T00:00:00.000Z"
    }
  ],
  "orders": [],
  "users": []
}
```

Start json-server:

```bash
# using npx (no global install required)
npx json-server --watch db.json --port 5000

# or if installed globally
json-server --watch db.json --port 5000
```

Available endpoints after starting:
- GET/POST/PATCH/DELETE /products
- GET/POST /categories
- GET/POST /reviews
- GET/POST /orders
- GET/POST /users

Note: The frontend code expects the API at http://localhost:5000 by default. If you change the API URL, update the fetch calls or set NEXT_PUBLIC_API_URL (see Environment).

---

## Run the Next.js app

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or (if using bun)
bun dev
```

Open http://localhost:3000 in your browser.

Build and run production:

```bash
npm run build
npm run start
```

(Adjust to pnpm/yarn if you use those.)

---

## Environment

You can set environment variables in `.env.local` at project root.

Common variables used by the app (create if needed):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Elevana
```

If NEXT_PUBLIC_API_URL is not set the code falls back to the hardcoded http://localhost:5000 used in the API hooks — check lib/* for fetch URLs.

---

## Project structure (important files)

- app/ - Next.js app router pages and layouts
  - app/layout.tsx — root layout
  - app/page.tsx — home
  - app/products/page.tsx — products list
  - app/products/[id]/page.tsx — product detail
  - app/cart/page.tsx — cart page
  - app/checkout/page.tsx — checkout page
  - app/order-confirmation/page.tsx — confirmation
- components/ — UI components and primitives (header, footer, product-card, etc.)
- lib/ — application hooks / contexts
  - lib/ProductsContext.ts — product fetching/updating logic
  - lib/OrderContext.ts — order creation / confirmation logic
  - lib/AuthContext.ts — authentication helpers (cookie-based)
  - lib/CartContext.ts — cart state (if present)
- db/models.ts — shared TypeScript types for Product, Category, Order, Review (if present)
- public/ — static assets (images, svg placeholders)

---

## How checkout works (high level)

- Cart state is stored in a cart context.
- Checkout calls confirmOrder (lib/OrderContext.ts), which:
  - Builds an order object (IDs often prefixed, e.g., ORDR_*)
  - Updates product stock using updateProduct in ProductsContext
  - Posts the order to /orders on the mock API
- After success the cart is cleared and the app navigates to the order confirmation page.

Note: Some flows depend on a userId cookie. If that cookie is missing, test flows may fail — see lib/AuthContext.ts.

---

## Tests & linting

Check package.json for scripts. Common ones:

```bash
npm run lint        # runs eslint if configured
npm run test        # runs tests if configured
npm run format      # runs prettier if configured
```

If tests are not present, create tests under __tests__ or following your preferred structure.

---

## Troubleshooting

- Empty UI / 404s: Ensure json-server is running on port 5000 and db.json contains expected resources (products, categories, reviews).
- CORS: During development the Next dev server fetches the API directly (localhost). If you host the API on another origin, enable CORS or proxy requests.
- Missing cookies: Some flows expect a cookie named `userId`. Use the auth UI or set a cookie for testing.
- Unexpected fetch URL: Search for hardcoded "http://localhost:5000" in lib/ to update the endpoint.

Linux tips:
- To run both servers (json-server and Next) in parallel in a single terminal you can use tmux, two terminals, or a tool like concurrently:
  npm i -D concurrently
  npx concurrently "npx json-server --watch db.json --port 5000" "npm run dev"

---

## Deploy

This demo is suitable for deployment on Vercel. For production you should:
- Replace json-server with a real backend or hosted mock API
- Configure env vars (NEXT_PUBLIC_API_URL)
- Remove any test/seed data and secure endpoints

---

## Contributing

- Use the existing hooks in lib/ for data operations to keep behavior consistent.
- Add UI primitives under components/ui for shared controls.
- If you add API endpoints, update db/models.ts types.

---

If you want, I can:
- Generate a ready-to-use example db.json with richer sample data.
- Add an npm script to run json-server and Next concurrently.
- Create a minimal `.env.local.example` file.
