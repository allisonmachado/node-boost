import migrationsRepository from "../src/data/repositories/mysql/MigrationsRepository";

export async function up() {
    await migrationsRepository.query('CREATE SCHEMA `simple_db` DEFAULT CHARACTER SET utf8');
}

export async function down() {
    await migrationsRepository.query('DROP SCHEMA `simple_db`');
}