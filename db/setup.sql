-- Drop everything
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_fk0";
ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_fk0";
ALTER TABLE "order_lines" DROP CONSTRAINT IF EXISTS "order_lines_fk0";
ALTER TABLE "order_lines" DROP CONSTRAINT IF EXISTS "order_lines_fk1";

DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "product_types";
DROP TABLE IF EXISTS "customers";
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "order_lines";


-- Create everything
CREATE TABLE "products" (
	"id" serial NOT NULL,
	"sku" varchar NOT NULL UNIQUE,
	"name" varchar NOT NULL,
	"description" TEXT NOT NULL,
	"type_id" int NOT NULL,
	"stock" int NOT NULL,
	"cost" int NOT NULL,
	"selling_price" int NOT NULL,
	CONSTRAINT products_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "product_types" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL UNIQUE,
	CONSTRAINT product_types_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "customers" (
	"id" serial NOT NULL,
	"full_name" varchar NOT NULL,
	"company_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"address" varchar NOT NULL,
	"postal_code" varchar NOT NULL,
	"city" varchar NOT NULL,
	"country" varchar NOT NULL,
	CONSTRAINT customers_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "orders" (
	"id" serial NOT NULL UNIQUE,
	"customer_id" int NOT NULL,
	"date" DATE NOT NULL,
	CONSTRAINT orders_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "order_lines" (
	"order_id" int NOT NULL,
	"product_id" int NOT NULL,
	"amount" int NOT NULL
) WITH (
  OIDS=FALSE
);


ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("type_id") REFERENCES "product_types"("id");
ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("customer_id") REFERENCES "customers"("id");
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_fk0" FOREIGN KEY ("order_id") REFERENCES "orders"("id");
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");
