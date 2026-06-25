-- NULLL.CLUB loyalty core
-- T0 - Supabase schema, RLS, RPC, seeds and monthly reset.

-- Extensions
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.loyalty_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_points int not null,
  discount_percent numeric(5,2) not null,
  position int not null,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  qr_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  current_month_points int not null default 0,
  lifetime_points int not null default 0,
  consent_waiver boolean not null default false,
  consent_waiver_version text,
  consent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.partner_access_codes (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  code_hash text not null,
  active boolean not null default true,
  created_at timestamptz default now(),
  last_used_at timestamptz
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.partners(id) on delete restrict,
  label text not null,
  amount_eur numeric(10,2) not null check (amount_eur > 0),
  points_awarded int not null,
  created_at timestamptz default now()
);

create index if not exists transactions_partner_id_created_at_idx
  on public.transactions (partner_id, created_at);

create index if not exists transactions_member_id_created_at_idx
  on public.transactions (member_id, created_at);

create table if not exists public.points_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('buy', 'bonus', 'reset', 'adjust')),
  points int not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  description text,
  created_at timestamptz default now()
);

-- Seeds
insert into public.app_config (key, value)
values
  ('points_per_euro', '1'::jsonb),
  ('reset_timezone', '"Europe/Paris"'::jsonb)
on conflict (key) do nothing;

insert into public.loyalty_tiers (name, min_points, discount_percent, position)
select seed.name, seed.min_points, seed.discount_percent, seed.position
from (
  values
    ('Niveau 1', 50, 5::numeric(5,2), 1),
    ('Niveau 2', 150, 10::numeric(5,2), 2),
    ('Niveau 3', 300, 15::numeric(5,2), 3),
    ('Niveau 4', 500, 20::numeric(5,2), 4)
) as seed(name, min_points, discount_percent, position)
where not exists (
  select 1
  from public.loyalty_tiers lt
  where lt.min_points = seed.min_points
);

-- Functions
create or replace function public.get_member_tier(p_points int)
returns public.loyalty_tiers
language plpgsql
stable
set search_path = public
as $$
declare
  v_tier public.loyalty_tiers;
begin
  select lt.*
  into v_tier
  from public.loyalty_tiers lt
  where lt.min_points <= p_points
  order by lt.min_points desc, lt.position desc
  limit 1;

  return v_tier;
end;
$$;

create or replace function public.credit_from_purchase(
  p_qr_token text,
  p_partner_id uuid,
  p_label text,
  p_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.profiles;
  v_ratio numeric;
  v_points int;
  v_transaction_id uuid;
  v_current_month_points int;
  v_tier public.loyalty_tiers;
begin
  if p_qr_token is null or length(trim(p_qr_token)) = 0 then
    raise exception 'QR token missing';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be positive';
  end if;

  if p_label is null or length(trim(p_label)) = 0 then
    raise exception 'Label missing';
  end if;

  select *
  into v_member
  from public.profiles
  where qr_token = p_qr_token;

  if not found then
    raise exception 'Member not found';
  end if;

  select coalesce((value #>> '{}')::numeric, 1)
  into v_ratio
  from public.app_config
  where key = 'points_per_euro';

  v_ratio := coalesce(v_ratio, 1);
  v_points := floor(p_amount * v_ratio)::int;

  insert into public.transactions (
    member_id,
    partner_id,
    label,
    amount_eur,
    points_awarded
  )
  values (
    v_member.id,
    p_partner_id,
    trim(p_label),
    p_amount,
    v_points
  )
  returning id into v_transaction_id;

  insert into public.points_log (
    user_id,
    type,
    points,
    transaction_id,
    description
  )
  values (
    v_member.id,
    'buy',
    v_points,
    v_transaction_id,
    trim(p_label)
  );

  update public.profiles
  set
    current_month_points = current_month_points + v_points,
    lifetime_points = lifetime_points + v_points
  where id = v_member.id
  returning current_month_points into v_current_month_points;

  v_tier := public.get_member_tier(v_current_month_points);

  return jsonb_build_object(
    'member_first_name', v_member.first_name,
    'points_awarded', v_points,
    'current_month_points', v_current_month_points,
    'tier_name', v_tier.name,
    'discount_percent', coalesce(v_tier.discount_percent, 0)
  );
end;
$$;

create or replace function public.reset_monthly_points()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.points_log (
    user_id,
    type,
    points,
    description
  )
  select
    id,
    'reset',
    -current_month_points,
    'Reinitialisation mensuelle'
  from public.profiles
  where current_month_points > 0;

  update public.profiles
  set current_month_points = 0
  where current_month_points > 0;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.app_config enable row level security;
alter table public.loyalty_tiers enable row level security;
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.partner_access_codes enable row level security;
alter table public.transactions enable row level security;
alter table public.points_log enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "points_log_select_own" on public.points_log;
create policy "points_log_select_own"
  on public.points_log
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions
  for select
  to authenticated
  using (auth.uid() = member_id);

drop policy if exists "loyalty_tiers_select_authenticated" on public.loyalty_tiers;
create policy "loyalty_tiers_select_authenticated"
  on public.loyalty_tiers
  for select
  to authenticated
  using (true);

-- No public policies on app_config, partners or partner_access_codes.
-- They are service-role only by design.

-- Cron
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'cron'
      and p.proname = 'schedule'
  ) then
    begin
      perform cron.unschedule('reset-monthly-points');
    exception
      when others then
        null;
    end;

    perform cron.schedule(
      'reset-monthly-points',
      '5 0 * * *',
      $cron$ select case
        when extract(day from (now() at time zone 'Europe/Paris')) = 1
        then public.reset_monthly_points()
      end; $cron$
    );
  else
    raise notice 'pg_cron unavailable. Create a scheduled Edge Function that calls public.reset_monthly_points() daily and only runs the reset when Europe/Paris is day 1.';
  end if;
end;
$$;

