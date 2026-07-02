-- NULLL.CLUB checkout orders

create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  locale text not null check (locale in ('fr')),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  delivery_method text not null check (delivery_method in ('pickup', 'shipping')),
  notes text,
  total_eur numeric(10,2) not null check (total_eur > 0),
  created_at timestamptz default now()
);

create table if not exists public.checkout_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.checkout_orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity int not null check (quantity > 0 and quantity <= 20),
  unit_price_eur numeric(10,2) not null check (unit_price_eur >= 0),
  line_total_eur numeric(10,2) not null check (line_total_eur >= 0),
  created_at timestamptz default now()
);

create index if not exists checkout_orders_created_at_idx
  on public.checkout_orders (created_at desc);

create index if not exists checkout_orders_email_idx
  on public.checkout_orders (email);
