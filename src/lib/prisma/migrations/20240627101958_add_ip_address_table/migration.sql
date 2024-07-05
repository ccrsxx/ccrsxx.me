/*
  Warnings:

  - You are about to drop the column `ip_address` on the `content_like` table. All the data in the column will be lost.
  - Added the required column `ip_address_id` to the `content_like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "content_like" DROP COLUMN "ip_address",
ADD COLUMN     "ip_address_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "content_view" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "ip_address_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "content_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_address" (
    "id" UUID NOT NULL,
    "ip_address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ip_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ip_address_ip_address_key" ON "ip_address"("ip_address");

-- AddForeignKey
ALTER TABLE "content_like" ADD CONSTRAINT "content_like_ip_address_id_fkey" FOREIGN KEY ("ip_address_id") REFERENCES "ip_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_view" ADD CONSTRAINT "content_view_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_view" ADD CONSTRAINT "content_view_ip_address_id_fkey" FOREIGN KEY ("ip_address_id") REFERENCES "ip_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
