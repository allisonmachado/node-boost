// import migrationsRepository from "../src/data/repositories/mysql/MigrationsRepository";

export async function up() {
    // await migrationsRepository.query('CREATE UNIQUE INDEX `email_UNIQUE` ON `simple_db`.`user` (`email` ASC) VISIBLE');
}

export async function down() {
    // await migrationsRepository.query('DROP INDEX `email_UNIQUE` ON `simple_db`.`user`');
}