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
  "orders": [
    {
      "id": "order_1761156821865",
      "userId": 1760776647335,
      "items": [
        {
          "product": {
            "id": "1",
            "name": "Casque Sans Fil Premium",
            "description": "Casque audio sans fil avec réduction de bruit active, autonomie de 30 heures et son haute fidélité.",
            "price": 299.99,
            "originalPrice": 399.99,
            "category": "electronics",
            "image": "/premium-wireless-headphones.png",
            "images": [
              "/premium-wireless-headphones-front-view.jpg",
              "/premium-wireless-headphones-side.png",
              "/premium-wireless-headphones-folded.png"
            ],
            "rating": 4.8,
            "reviews": 342,
            "stock": 45,
            "features": [
              "Réduction de bruit active",
              "Autonomie 30h",
              "Bluetooth 5.0",
              "Pliable",
              "Microphone intégré"
            ],
            "createdAt": "2024-05-10T14:48:00.000Z"
          },
          "quantity": 1
        }
      ],
      "totalAmount": 299.99,
      "shippingAddress": "",
      "orderDate": "2025-10-22T18:13:41.865Z",
      "status": "processing"
    }
  ],
  "users": [
    {
      "id": "1761158069182",
      "firstName": "Johnd",
      "lastName": "Doe",
      "email": "johndoe@gmail.com",
      "password": "*********",
      "createdAt": "2025-10-22T18:34:29.182Z",
      "phone": "+21621234567",
      "address": "Heloo",
      "cart": [],
      "favProducts": []
    }
  ]
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

Note: The frontend code expects the API at http://localhost:5000 by default.

---

## Run the Next.js app

Start the development server:

```bash
npm run dev (using the script in the package.json file you can ran the server and the application at the same time with that command)
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
