/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "address_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_id_key" ON "public"."payments"("stripe_id");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
