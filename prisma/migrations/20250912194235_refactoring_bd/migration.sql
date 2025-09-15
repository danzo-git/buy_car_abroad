/*
  Warnings:

  - The `status` column on the `vehicules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `year` on the `vehicules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."VehiculeStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING');

-- AlterTable
ALTER TABLE "public"."vehicules" DROP COLUMN "status",
ADD COLUMN     "status" "public"."VehiculeStatus" NOT NULL DEFAULT 'AVAILABLE',
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;
