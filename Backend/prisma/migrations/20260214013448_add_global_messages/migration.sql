-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pictureURL" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dic5sskvu/image/upload/v1771032844/defaultAvatar_szkhjs.webp';

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "imageUrl" TEXT,
    "senderId" INTEGER NOT NULL,
    "globalId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Global" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Global_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_globalId_fkey" FOREIGN KEY ("globalId") REFERENCES "Global"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
