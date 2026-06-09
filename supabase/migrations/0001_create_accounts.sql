create table if not exists accounts (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  password text not null,
  salt text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
