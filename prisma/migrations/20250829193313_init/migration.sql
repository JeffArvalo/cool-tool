/*
  Warnings:

  - You are about to drop the column `address_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "address_id";
