-- StoryAI Studio starter schema
create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text not null check (type in ('image','video')),
  prompt text not null,
  style text,
  aspect_ratio text,
  duration_seconds integer,
  output_url text,
  status text default 'completed',
  created_at timestamptz default now()
);

create index if not exists generations_user_id_idx on generations(user_id);
create index if not exists generations_created_at_idx on generations(created_at desc);
