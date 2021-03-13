import Knex from "knex";

export async function up(knex: Knex) {
    await knex.schema.createTable("user", (table) => {
        table.increments();
        table.string("name").notNullable();
        table.string("surname").notNullable();
        table.string("email", 145).notNullable().unique();
        table.string("password", 60).notNullable();
    });
}

export async function down(knex: Knex) {
    await knex.schema.dropTable("users");
}
