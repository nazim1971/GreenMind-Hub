/*
  Warnings:

  - You are about to drop the column `needPasswordChange` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed');

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "needPasswordChange",
DROP COLUMN "status",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "admins";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problemStatement" TEXT,
    "solution" TEXT,
    "description" TEXT,
    "images" TEXT[],
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "status" "IdeaStatus" NOT NULL DEFAULT 'DRAFT',
    "feedback" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "transactionId" TEXT NOT NULL,
    "gatewayResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userEmail_ideaId_key" ON "votes"("userEmail", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
