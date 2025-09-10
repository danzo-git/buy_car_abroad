-- CreateTable
CREATE TABLE "public"."vehiculeImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "vehiculeId" INTEGER NOT NULL,

    CONSTRAINT "vehiculeImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."vehiculeImage" ADD CONSTRAINT "vehiculeImage_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "public"."vehicules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
