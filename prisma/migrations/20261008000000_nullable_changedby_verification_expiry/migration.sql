-- DropForeignKey
ALTER TABLE "UserStatusHistory" DROP CONSTRAINT "UserStatusHistory_changedBy_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserStatusHistory" ALTER COLUMN "changedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserStatusHistory" ADD CONSTRAINT "UserStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

