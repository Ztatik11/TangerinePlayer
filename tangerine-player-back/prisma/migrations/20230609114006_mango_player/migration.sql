-- CreateTable
CREATE TABLE `Usuarios` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Usuario` VARCHAR(15) NULL,
    `Nombre` VARCHAR(30) NULL,
    `Apellidos` VARCHAR(50) NULL,
    `Email` VARCHAR(100) NULL,
    `Clave` VARCHAR(355) NULL,
    `Fecha_nacimiento` DATE NULL,

    UNIQUE INDEX `Usuario`(`Usuario`, `Email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Canciones` (
    `trackid` VARCHAR(200) NOT NULL,
    `url` VARCHAR(400) NULL,
    `title` VARCHAR(50) NULL,
    `artist` VARCHAR(100) NULL,
    `artwork` VARCHAR(300) NULL,

    PRIMARY KEY (`trackid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Playlist_canciones` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_Playlist` INTEGER NULL,
    `ID_Cancion` VARCHAR(200) NULL,

    INDEX `fk_ID_Cancion`(`ID_Cancion`),
    INDEX `fk_ID_Playlist`(`ID_Playlist`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Playlists` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(50) NULL,
    `ID_Usuario` INTEGER NULL,

    INDEX `fk_ID_Usuario_Playlist`(`ID_Usuario`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Playlist_canciones` ADD CONSTRAINT `fk_ID_Cancion` FOREIGN KEY (`ID_Cancion`) REFERENCES `Canciones`(`trackid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Playlist_canciones` ADD CONSTRAINT `fk_ID_Playlist` FOREIGN KEY (`ID_Playlist`) REFERENCES `Playlists`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Playlists` ADD CONSTRAINT `fk_ID_Usuario_Playlist` FOREIGN KEY (`ID_Usuario`) REFERENCES `Usuarios`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
