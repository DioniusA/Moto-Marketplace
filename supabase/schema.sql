-- =====================================================================
-- MOTO MARKETPLACE — Supabase Schema
-- Includes: tables, indexes, foreign keys, RLS policies, seed data
-- Run this in Supabase SQL Editor
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- =====================================================================
-- 1. BRANDS
-- =====================================================================
create table if not exists public.brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  logo_url text,
  total_sales_eth numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_brands_name on public.brands(name);

-- =====================================================================
-- 2. PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('Motorcycles', 'Parts', 'Accessories')),
  brand_id uuid references public.brands(id) on delete set null,
  price numeric(12, 2) not null check (price >= 0),
  cashback_amount numeric(10, 2) not null default 0,
  description text,
  image_url text,
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brand on public.products(brand_id);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- =====================================================================
-- 3. FEATURED LISTINGS (auction/exclusive hero carousel)
-- =====================================================================
create table if not exists public.featured_listings (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  auction_end_time timestamptz not null,
  color_theme text not null default 'green' check (color_theme in ('green', 'red', 'yellow')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_featured_active on public.featured_listings(is_active);

-- =====================================================================
-- 4. PROFILES (extends auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  banner_url text,
  bio text,
  rating_as_renter numeric(3, 2) not null default 0 check (rating_as_renter >= 0 and rating_as_renter <= 5),
  rating_as_owner numeric(3, 2) not null default 0 check (rating_as_owner >= 0 and rating_as_owner <= 5),
  is_verified boolean not null default false,
  social_discord text,
  social_meta text,
  social_youtube text,
  social_twitter text,
  social_instagram text,
  created_at timestamptz not null default now()
);
create index if not exists idx_profiles_username on public.profiles(username);

-- =====================================================================
-- 5. CART ITEMS
-- =====================================================================
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);
create index if not exists idx_cart_user on public.cart_items(user_id);

-- =====================================================================
-- 6. ORDERS
-- =====================================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

-- =====================================================================
-- 7. ORDER ITEMS
-- =====================================================================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(12, 2) not null check (price_at_purchase >= 0)
);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- =====================================================================
-- 8. NEWSLETTER SUBSCRIBERS
-- =====================================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- TRIGGER: Auto-create profile on user signup
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.featured_listings enable row level security;
alter table public.profiles enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- ---------- BRANDS: public read ----------
drop policy if exists "Brands are viewable by everyone" on public.brands;
create policy "Brands are viewable by everyone"
  on public.brands for select
  using (true);

-- ---------- PRODUCTS: public read ----------
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- ---------- FEATURED LISTINGS: public read ----------
drop policy if exists "Featured listings are viewable by everyone" on public.featured_listings;
create policy "Featured listings are viewable by everyone"
  on public.featured_listings for select
  using (true);

-- ---------- PROFILES ----------
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------- CART ITEMS: user-scoped ----------
drop policy if exists "Users can view their own cart" on public.cart_items;
create policy "Users can view their own cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert into their own cart" on public.cart_items;
create policy "Users can insert into their own cart"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own cart" on public.cart_items;
create policy "Users can update their own cart"
  on public.cart_items for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete from their own cart" on public.cart_items;
create policy "Users can delete from their own cart"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- ---------- ORDERS: user-scoped ----------
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ---------- ORDER ITEMS: via parent order ----------
drop policy if exists "Users can view their own order items" on public.order_items;
create policy "Users can view their own order items"
  on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

drop policy if exists "Users can insert their own order items" on public.order_items;
create policy "Users can insert their own order items"
  on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ---------- NEWSLETTER: anyone can subscribe, no reads ----------
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- =====================================================================
-- STORAGE BUCKETS
-- =====================================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict do nothing;

-- Avatar policies
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Document policies (private)
drop policy if exists "Users can upload their own documents" on storage.objects;
create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

drop policy if exists "Users can read their own documents" on storage.objects;
create policy "Users can read their own documents"
  on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[2] = auth.uid()::text);

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Seed brands
insert into public.brands (name, total_sales_eth) values
  ('Yamaha',   34.53),
  ('Honda',    34.62),
  ('Kawasaki', 34.63),
  ('Suzuki',   34.02),
  ('BMW',      34.55),
  ('Ducati',   34.53),
  ('Harley',   34.63),
  ('More',     34.53)
on conflict (name) do nothing;

-- Seed products
do $$
declare
  yamaha_id uuid; honda_id uuid; kawasaki_id uuid; suzuki_id uuid;
  bmw_id uuid; ducati_id uuid; harley_id uuid;
begin
  select id into yamaha_id   from public.brands where name = 'Yamaha';
  select id into honda_id    from public.brands where name = 'Honda';
  select id into kawasaki_id from public.brands where name = 'Kawasaki';
  select id into suzuki_id   from public.brands where name = 'Suzuki';
  select id into bmw_id      from public.brands where name = 'BMW';
  select id into ducati_id   from public.brands where name = 'Ducati';
  select id into harley_id   from public.brands where name = 'Harley';

  insert into public.products (title, category, brand_id, price, cashback_amount, description, rating, featured) values
    ('BMW C400X',       'Motorcycles', bmw_id,      4000000,  2000, 'The BMW C400X is a premium urban scooter designed for the modern rider.', 4.5, true),
    ('Vespa GTS 300',   'Motorcycles', null,        3500000,  1800, 'Classic Italian styling meets modern performance.', 4.6, false),
    ('Yamaha XMAX 300', 'Motorcycles', yamaha_id,   2500000,  1200, 'The ultimate sport scooter for daily commutes.', 4.4, false),
    ('Honda Forza 350', 'Motorcycles', honda_id,    2800000,  1400, 'Honda reliability meets premium design.', 4.7, false),
    ('Kawasaki H2R',    'Motorcycles', kawasaki_id, 15800000, 7200, 'The H2R is not just a motorcycle — it is a hybrid of machine and storm. A supercharged heart beats within its frame, creating pressure powerful enough to twist air itself.', 4.5, true),
    ('Kawasaki H2R v2', 'Motorcycles', kawasaki_id, 15800000, 7200, 'Second variant of the legendary H2R.', 4.8, false),
    ('Honda CRF',       'Motorcycles', honda_id,    2500000,  1200, 'Off-road champion for adventure seekers.', 4.3, false),
    ('Honda NT1100 DCT','Motorcycles', honda_id,   10000000,  5000, 'Touring motorcycle built for long-distance comfort.', 4.9, false)
  on conflict do nothing;

  -- Seed featured auction listings
  insert into public.featured_listings (product_id, auction_end_time, color_theme, is_active)
  select id, now() + interval '3 hours', 'green',  true from public.products where title = 'Kawasaki H2R' limit 1;
  insert into public.featured_listings (product_id, auction_end_time, color_theme, is_active)
  select id, now() + interval '24 hours', 'red',    true from public.products where title = 'Kawasaki H2R v2' limit 1;
  insert into public.featured_listings (product_id, auction_end_time, color_theme, is_active)
  select id, now() + interval '6 hours',  'yellow', true from public.products where title = 'Honda NT1100 DCT' limit 1;
end $$;
