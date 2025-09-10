-- DropForeignKey
ALTER TABLE "public"."vehicules" DROP CONSTRAINT "vehicules_seller_id_fkey";

-- AlterTable
ALTER TABLE "public"."vehicules" ALTER COLUMN "seller_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vehicules" ADD CONSTRAINT "vehicules_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
