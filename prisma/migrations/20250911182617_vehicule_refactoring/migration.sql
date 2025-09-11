/*
  Warnings:

  - Made the column `seller_id` on table `vehicules` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."vehicules" DROP CONSTRAINT "vehicules_seller_id_fkey";

-- AlterTable
ALTER TABLE "public"."vehicules" ALTER COLUMN "seller_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vehicules" ADD CONSTRAINT "vehicules_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
