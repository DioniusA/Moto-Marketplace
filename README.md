# Moto Marketplace

Production-ready Next.js 14 + Supabase motorcycle marketplace built from the Figma design.

## Assumptions

Items inferred from the Figma design that the brief didn't explicitly spell out:

1. **Currency**: Tenge (₸) — used on all screens in the design.
2. **Domain**: Kazakhstan-first marketplace (based on ₸ and Russian preview).
3. **Entities**: `brands`, `products`, `profiles`, `cart_items`, `orders`, `order_items`, `featured_listings`, `newsletter_subscribers`.
4. **Auth flow**: 3-step signup (credentials → document upload → verification pending). Verification is queued (`is_verified = false`) — we do not auto-approve.
5. **Featured slider**: 3 themed variants (green / red / yellow) with live countdown timers seeded 3h, 24h and 6h into the future.
6. **Category filter pills in Top Deals** (Yamaha, Honda, etc.) filter client-side once products load.
7. **Pages not fully shown in Figma** but implied by navigation: `/services`, `/rentals`, `/about` — minimal, consistent stubs that match the design system.
8. **Documents bucket** stored privately with RLS; avatars stored publicly.
9. **Cart/checkout**: "Proceed to Checkout" creates an order + order_items and clears the cart. A full payment gateway is out of scope.
10. **Images**: the design ships placeholder SVG silhouettes, so product cards fall back to an SVG moto icon when `image_url` is null.

---

## Implementation Plan

1. **Scaffold**: Next.js 14 App Router + TypeScript + Tailwind CSS with the Figma color palette.
2. **Supabase**: create schema, FKs, indexes, RLS, storage buckets and seed data. Wire a trigger to auto-create `profiles` row on user signup.
3. **Auth**: `@supabase/ssr` on client + server + middleware. Protect `/cart` and `/profile`; redirect unauthenticated users with `?redirect=` back-path.
4. **Layout**: shared `Navbar` (swaps between unauth/auth state) + `Footer` (with newsletter subscribe).
5. **Home**: `FeaturedSlider` (live countdown, theme rotation), `BrandGrid` (8 tiles), `TopDeals` (8 cards + brand pills).
6. **Marketplace**: search, category tabs, filter popup (price range slider, accessory types, sort), grid/list toggle, add-to-cart.
7. **Product detail**: image hero, category pill, price, cashback badge, description, quantity selector, add-to-cart.
8. **Cart**: quantity controls, inline remove, subtotal + cashback + total, checkout creating order + order_items.
9. **Profile**: banner + avatar upload, inline edit (username + bio), ratings, verified badge, social links.
10. **Signup**: react-hook-form + zod, step 1 creates Supabase user, step 2 uploads to `documents` bucket, step 3 shows pending state.

---

## Project Structure

```
final/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Tailwind + theme overrides
│   ├── page.tsx                      # Home (Featured / Brands / Top Deals)
│   ├── marketplace/
│   │   ├── page.tsx                  # Browse with filters
│   │   └── [id]/
│   │       ├── page.tsx              # Product detail
│   │       └── not-found.tsx
│   ├── cart/page.tsx
│   ├── profile/page.tsx
│   ├── services/page.tsx
│   ├── rentals/page.tsx
│   ├── about/page.tsx
│   └── auth/
│       ├── signup/page.tsx           # 3-step signup
│       └── login/page.tsx
├── components/
│   ├── ui/{Button,Input}.tsx
│   ├── layout/{Navbar,Footer}.tsx
│   ├── home/{FeaturedSlider,BrandGrid,TopDeals}.tsx
│   ├── marketplace/{ProductCard,SearchBar,CategoryTabs,FilterPopup,AddToCartButton}.tsx
│   ├── cart/CartContent.tsx
│   └── profile/ProfileContent.tsx
├── lib/
│   ├── supabase/{client,server,middleware}.ts
│   ├── types/index.ts
│   └── utils.ts
├── supabase/schema.sql               # Tables + RLS + seed
├── middleware.ts
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
├── package.json
└── .env.local.example
```

---

## Run Guide

### 1. Install dependencies
```bash
cd final
npm install
```

### 2. Create a Supabase project
- Go to https://supabase.com → New Project.
- Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
- This creates tables, indexes, RLS, storage buckets (`avatars`, `products`, `documents`) and seed data.

### 3. Configure environment
Copy `.env.local.example` to `.env.local` and fill values from **Supabase → Project Settings → API**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

### 4. Configure Supabase Auth
- **Authentication → Providers → Email**: enable.
- **Authentication → URL Configuration → Site URL**: `http://localhost:3000` (dev).
- Optional: disable "Confirm email" during development for fast signup testing.

### 5. Run
```bash
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve production build
```

---

## Test Checklist

### Auth
- [ ] Sign up (step 1) creates auth user and `profiles` row via trigger.
- [ ] Sign up step 2 uploads documents to private `documents` bucket.
- [ ] Sign up step 3 shows Verification Pending.
- [ ] Login redirects to `?redirect=` path or `/`.
- [ ] Logout from navbar clears session.
- [ ] `/profile` and `/cart` redirect to `/auth/login` when logged out.

### Home
- [ ] Featured slider rotates every 8s and shows correct theme colors.
- [ ] Countdown timer decrements each second.
- [ ] Brand grid shows 8 tiles; clicking a brand opens `/marketplace?brand=<name>`.
- [ ] Top Deals brand pills filter cards client-side.
- [ ] Empty brand shows "No products found for this brand."

### Marketplace
- [ ] Search input filters by title (case-insensitive).
- [ ] Category tabs (All / Motorcycles / Parts / Accessories) filter products.
- [ ] Filter popup: price slider, accessory types, sort options all apply on Apply.
- [ ] Grid/list toggle switches layout.
- [ ] Add-to-cart icon on product card adds item (redirects to login if unauth).

### Product detail
- [ ] Category pill, price and cashback badge render correctly.
- [ ] Quantity +/- updates count; can't go below 1.
- [ ] Add to Cart adds the exact quantity (or increments if already in cart).

### Cart
- [ ] Quantity +/- updates cart_items row.
- [ ] Trash icon removes item from cart.
- [ ] Subtotal, cashback and total recompute live.
- [ ] Empty state shows when cart is empty.
- [ ] Proceed to Checkout creates an order + order_items and clears the cart.

### Profile
- [ ] Edit toggles inline form; Save persists to `profiles`.
- [ ] Avatar click opens file picker; upload updates `avatar_url`.
- [ ] Verified badge only shows when `is_verified = true`.

### Footer / Newsletter
- [ ] Valid email writes to `newsletter_subscribers`; duplicate shows error.
- [ ] Success state replaces the form.

### Responsive
- [ ] Mobile (<768px): navbar, grids and forms stack cleanly.
- [ ] Tablet (768–1024px): 2-col grids.
- [ ] Desktop (≥1440px): matches Figma 4-col layout.

### Security
- [ ] RLS prevents user A from reading user B's cart / orders (try with another auth session).
- [ ] Unauth user cannot insert into `cart_items` (insert policy blocks it).
- [ ] Documents bucket cannot be listed or read publicly.

---

## Notes

- Fonts: Inter via Google Fonts (matches Figma sans-serif).
- Icons: `lucide-react` — small dependency, tree-shaken.
- No client-side price math is trusted on the server; `order_items.price_at_purchase` snapshots current price at checkout time.
- Middleware (`middleware.ts`) guards `/cart` and `/profile` server-side on every request.
