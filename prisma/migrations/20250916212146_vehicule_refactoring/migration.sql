-- DropForeignKey
ALTER TABLE "public"."vehiculeImage" DROP CONSTRAINT "vehiculeImage_vehiculeId_fkey";

-- AddForeignKey
ALTER TABLE "public"."vehiculeImage" ADD CONSTRAINT "vehiculeImage_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "public"."vehicules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
