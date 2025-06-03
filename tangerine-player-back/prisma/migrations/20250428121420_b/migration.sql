/*
  Warnings:

  - The primary key for the `Canciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `trackid` on the `Canciones` table. All the data in the column will be lost.
  - Added the required column `id` to the `Canciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Playlist_canciones` DROP FOREIGN KEY `Playlist_canciones_ID_Cancion_fkey`;

-- AlterTable
ALTER TABLE `Canciones` DROP PRIMARY KEY,
    DROP COLUMN `trackid`,
    ADD COLUMN `id` VARCHAR(200) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Playlist_canciones` ADD CONSTRAINT `Playlist_canciones_ID_Cancion_fkey` FOREIGN KEY (`ID_Cancion`) REFERENCES `Canciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
