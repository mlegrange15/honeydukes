create database bamazon;

use bamazon;

create table products (
item_id integer not null auto_increment,
product_name varchar (15) not null,
department_name varchar(15) not null,
price integer not null,
stock_quantity integer not null,
primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity) values

('Pixie Puffs', 'Cereal', 3, 25),
('Acid Pops', 'Lollipops', 3.5, 27),
('Chocolate Wands', 'Chocolates', 5, 12),
('Peppermint Toad', 'Mints', 2.5, 11),
('Fizzing Whizzbees', 'Sours', 4, 7),
('Bertie Botts Every Flavour Beans', 'Sours', 5, 24),
('Jelly Slugs', 'Sours', 5, 20),
('Salt Water Taffy', 'Sours', 3, 14),
('Chocolate Frogs', 'Chocolates', 7, 30),
('Exploding bonbons', 'Cakes', 6, 16),
('Cauldron Cakes', 'Cakes', 7, 17);

select * from products;