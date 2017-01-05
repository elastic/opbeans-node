insert into product_types (id, name) values (1, 'Light Roast Coffee');
insert into product_types (id, name) values (2, 'Medium Roast Coffee');
insert into product_types (id, name) values (3, 'Dark Roast Coffee');

insert into products (id, sku, name, description, type_id, stock, cost, selling_price) values (1, 'OP-DRC-C1', 'Brazil Verde, Italian Roast', 'Soft, nutty, low acid, with nice bitter-sweet chocolate tastes.', 3, '120', 1500, 3200);
insert into products (id, sku, name, description, type_id, stock, cost, selling_price) values (2, 'OP-MRC-C2', 'Jamaica Blue Mountain, Vienna Roast', 'Rich flavor, rich aroma, moderate acidity, and an even balance.', 2, '60', 20000, 42000);
insert into products (id, sku, name, description, type_id, stock, cost, selling_price) values (3, 'OP-LRC-C3', 'Colombian Supremo, Cinnamon Roast', 'Full bodied with a light acidity making a balanced cup.', 1, '120', 2000, 4200);
