/*
  Warnings:

  - Made the column `qualification` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Teacher` MODIFY `qualification` VARCHAR(191) NOT NULL;
