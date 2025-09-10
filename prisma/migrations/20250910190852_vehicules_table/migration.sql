-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'pending_seller';

-- CreateTable
CREATE TABLE "public"."vehicules" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "country_of_origin" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "seller_id" INTEGER NOT NULL,

    CONSTRAINT "vehicules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."vehicules" ADD CONSTRAINT "vehicules_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
