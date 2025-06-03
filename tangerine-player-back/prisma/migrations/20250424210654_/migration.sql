/*
  Warnings:

  - A unique constraint covering the columns `[Usuario]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Email]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Made the column `Usuario` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Nombre` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Apellidos` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Email` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Clave` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Fecha_nacimiento` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Usuario` ON `Usuarios`;

-- AlterTable
ALTER TABLE `Usuarios` MODIFY `Usuario` VARCHAR(15) NOT NULL,
    MODIFY `Nombre` VARCHAR(30) NOT NULL,
    MODIFY `Apellidos` VARCHAR(50) NOT NULL,
    MODIFY `Email` VARCHAR(100) NOT NULL,
    MODIFY `Clave` VARCHAR(355) NOT NULL,
    MODIFY `Fecha_nacimiento` DATE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuarios_Usuario_key` ON `Usuarios`(`Usuario`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuarios_Email_key` ON `Usuarios`(`Email`);
