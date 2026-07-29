-- 1. Tạo bảng profiles lưu thông tin người dùng bổ sung
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null,
  updated_at timestamp with time zone default now(),
  full_name text,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  constraint username_length check (username is null or char_length(username) >= 3)
);

-- Kích hoạt Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies RLS
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. HÀM VÀ TRIGGER SQL TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ (Auth -> Profiles)
-- Khi ứng dụng gọi supabase.auth.signUp({ email, password, options: { data: { full_name } } }),
-- Trigger SQL này sẽ tự động chạy trong DB để lưu thông tin vào bảng profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_name text;
  generated_username text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  generated_username := coalesce(
    new.raw_user_meta_data->>'username', 
    split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4)
  );

  insert into public.profiles (id, full_name, username, avatar_url, updated_at)
  values (
    new.id,
    raw_name,
    generated_username,
    new.raw_user_meta_data->>'avatar_url',
    now()
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    updated_at = now();

  return new;
end;
$$;

-- Gắn trigger vào bảng auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Set up Realtime cho bảng profiles
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.profiles;

-- 4. Set up Storage cho Avatar
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible." on storage.objects;
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Anyone can upload an avatar." on storage.objects;
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

drop policy if exists "Anyone can update an avatar." on storage.objects;
create policy "Anyone can update an avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );
