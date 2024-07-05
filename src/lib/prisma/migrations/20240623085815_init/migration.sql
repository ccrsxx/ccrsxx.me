-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'AUTHOR');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('BLOG', 'PROJECT');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "github_id" TEXT,
    "github_username" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestbook" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "guestbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'BLOG',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_like" (
    "id" UUID NOT NULL,
    "ip_address" TEXT NOT NULL,
    "content_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "content_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_github_id_key" ON "user"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_github_username_key" ON "user"("github_username");

-- AddForeignKey
ALTER TABLE "guestbook" ADD CONSTRAINT "guestbook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_like" ADD CONSTRAINT "content_like_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
