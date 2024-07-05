/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "content" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "content_slug_key" ON "content"("slug");
