/*
  Warnings:

  - A unique constraint covering the columns `[user_id,inventory_id]` on the table `product_likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_likes_user_id_inventory_id_key" ON "public"."product_likes"("user_id", "inventory_id");
