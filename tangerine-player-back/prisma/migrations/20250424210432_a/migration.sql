/*
  Warnings:

  - Added the required column `album` to the `Canciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Canciones` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `Canciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Canciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artist` on table `Canciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `artwork` on table `Canciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ID_Playlist` on table `Playlist_canciones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ID_Cancion` on table `Playlist_canciones` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `coverUrl` to the `Playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Playlists` table without a default value. This is not possible if the table is not empty.
  - Made the column `Nombre` on table `Playlists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ID_Usuario` on table `Playlists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Playlist_canciones` DROP FOREIGN KEY `fk_ID_Cancion`;

-- DropForeignKey
ALTER TABLE `Playlist_canciones` DROP FOREIGN KEY `fk_ID_Playlist`;

-- DropForeignKey
ALTER TABLE `Playlists` DROP FOREIGN KEY `fk_ID_Usuario_Playlist`;

-- AlterTable
ALTER TABLE `Canciones` ADD COLUMN `album` VARCHAR(100) NOT NULL,
    ADD COLUMN `duration` VARCHAR(10) NOT NULL,
    MODIFY `url` VARCHAR(400) NOT NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `artist` VARCHAR(100) NOT NULL,
    MODIFY `artwork` VARCHAR(300) NOT NULL;

-- AlterTable
ALTER TABLE `Playlist_canciones` MODIFY `ID_Playlist` INTEGER NOT NULL,
    MODIFY `ID_Cancion` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `Playlists` ADD COLUMN `coverUrl` VARCHAR(300) NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    MODIFY `Nombre` VARCHAR(100) NOT NULL,
    MODIFY `ID_Usuario` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Playlist_canciones` ADD CONSTRAINT `Playlist_canciones_ID_Cancion_fkey` FOREIGN KEY (`ID_Cancion`) REFERENCES `Canciones`(`trackid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Playlist_canciones` ADD CONSTRAINT `Playlist_canciones_ID_Playlist_fkey` FOREIGN KEY (`ID_Playlist`) REFERENCES `Playlists`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Playlists` ADD CONSTRAINT `Playlists_ID_Usuario_fkey` FOREIGN KEY (`ID_Usuario`) REFERENCES `Usuarios`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Playlist_canciones` RENAME INDEX `fk_ID_Cancion` TO `Playlist_canciones_ID_Cancion_idx`;

-- RenameIndex
ALTER TABLE `Playlist_canciones` RENAME INDEX `fk_ID_Playlist` TO `Playlist_canciones_ID_Playlist_idx`;

-- RenameIndex
ALTER TABLE `Playlists` RENAME INDEX `fk_ID_Usuario_Playlist` TO `Playlists_ID_Usuario_idx`;
