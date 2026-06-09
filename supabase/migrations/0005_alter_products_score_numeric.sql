alter table products
  alter column score type numeric(4,1) using score::numeric(4,1);

update products p
set score = coalesce(
  (select round(avg(pf.score)::numeric, 1) from products_feedbacks pf where pf.product_id = p.id),
  0
);
