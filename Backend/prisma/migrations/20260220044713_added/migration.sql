/*
  Warnings:

  - You are about to drop the column `globalId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Global` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('GLOBAL', 'DIRECTED', 'GROUP');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_globalId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "globalId",
ADD COLUMN     "type" "Type" NOT NULL;

-- DropTable
DROP TABLE "Global";
