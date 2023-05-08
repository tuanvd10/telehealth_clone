-- AlterTable
ALTER TABLE `account` ADD COLUMN `role_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `account_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `account_role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
