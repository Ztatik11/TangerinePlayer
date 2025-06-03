/*
  Warnings:

  - You are about to drop the column `artwork` on the `Canciones` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Canciones` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `Canciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverUrl` to the `Canciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Canciones` DROP COLUMN `artwork`,
    DROP COLUMN `url`,
    ADD COLUMN `audioUrl` VARCHAR(400) NOT NULL,
    ADD COLUMN `coverUrl` VARCHAR(300) NOT NULL;
