create table if not exists products_feedbacks (
  id text primary key,
  score int not null,
  comment text not null,
  product_id text not null references products(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
