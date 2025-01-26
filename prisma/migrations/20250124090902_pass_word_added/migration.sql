/*
  Warnings:

  - Added the required column `hashed_password` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "hashed_password" TEXT NOT NULL;
