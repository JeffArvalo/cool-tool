/*
  Warnings:

  - You are about to drop the column `prouct_id` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cart_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_prouct_id_fkey";

-- AlterTable
ALTER TABLE "public"."cart_items" DROP COLUMN "prouct_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key" ON "public"."cart_items"("cart_id", "product_id");

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
