/*
  Warnings:

  - Changed the type of `status` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VoteStatus" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "status",
ADD COLUMN     "status" "VoteStatus" NOT NULL;

-- DropEnum
DROP TYPE "voteStatus";
