create table if not exists products (
  id text primary key,
  score int not null,
  name text not null,
  description text,
  external_link text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
