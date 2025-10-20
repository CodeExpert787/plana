-- Create table to persist user likes/dislikes for activities
create table if not exists public.user_activity_preferences (
  user_id uuid not null,
  activity_id text not null,
  status text not null check (status in ('liked','disliked')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (user_id, activity_id)
);

-- Basic RLS allowing users to see and modify only their own rows
alter table public.user_activity_preferences enable row level security;

-- Recreate policies idempotently: drop if exists then create
drop policy if exists "select own prefs" on public.user_activity_preferences;
create policy "select own prefs" on public.user_activity_preferences
  for select using (auth.uid() = user_id);

drop policy if exists "upsert own prefs" on public.user_activity_preferences;
create policy "upsert own prefs" on public.user_activity_preferences
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own prefs" on public.user_activity_preferences;
create policy "update own prefs" on public.user_activity_preferences
  for update using (auth.uid() = user_id);

drop policy if exists "delete own prefs" on public.user_activity_preferences;
create policy "delete own prefs" on public.user_activity_preferences
  for delete using (auth.uid() = user_id);


