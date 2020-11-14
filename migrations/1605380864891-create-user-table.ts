import migrationsRepository from "../src/data/repositories/mysql/MigrationsRepository";

export async function up() {
    await migrationsRepository.query("\
        CREATE TABLE IF NOT EXISTS `simple_db`.`user` ( \
            `id` INT NOT NULL AUTO_INCREMENT, \
            `name` VARCHAR(145) NOT NULL, \
            `surname` VARCHAR(245) NOT NULL, \
            `email` VARCHAR(145) NOT NULL, \
            `password` CHAR(60) NOT NULL, \
            PRIMARY KEY (`id`)) \
        ENGINE = InnoDB \
    ");
}

export async function down() {
    await migrationsRepository.query(" \
        DROP TABLE `simple_db`.`user` \
    ");
}