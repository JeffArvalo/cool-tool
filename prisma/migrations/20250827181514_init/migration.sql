/*
  Warnings:

  - A unique constraint covering the columns `[store_id,product_id]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventories_store_id_product_id_key" ON "public"."inventories"("store_id", "product_id");
