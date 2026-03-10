-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "recipentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipentId_fkey" FOREIGN KEY ("recipentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
