-- Run this in your Supabase SQL editor to create all tables
-- (If you already ran this before, the "if not exists" clauses make it safe to run again)

-- ─── Weight entries ───────────────────────────────────────────────────────────
create table if not exists weight_entries (
  id uuid primary key default gen_random_uuid(),
  weight_lbs numeric(5,1) not null check (weight_lbs > 0 and weight_lbs < 1000),
  date date not null,
  note text,
  created_at timestamptz default now(),
  constraint weight_entries_date_unique unique (date)
);

-- Allow anonymous read/write (since this is a personal app)
alter table weight_entries enable row level security;

create policy "allow all" on weight_entries
  for all using (true) with check (true);

-- Optional: seed Molly's known starting data point
-- insert into weight_entries (date, weight_lbs, note)
-- values ('2019-02-17', 181.4, 'Starting weight (WW enrollment)')
-- on conflict (date) do nothing;

-- ─── Feedback table ───────────────────────────────────────────────────────────
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  reviewed boolean default false,
  created_at timestamptz default now()
);

alter table feedback enable row level security;

create policy "allow all" on feedback
  for all using (true) with check (true);

-- If you already created the feedback table without the "reviewed" column, run this:
-- alter table feedback add column if not exists reviewed boolean default false;
