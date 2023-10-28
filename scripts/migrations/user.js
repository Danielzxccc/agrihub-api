exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists('users') // Drop the table if it exists
    .then(() => {
      return knex.schema.createTable('users', function (table) {
        table.increments('id').primary()
        table.string('username').notNullable().unique()
        table.string('password').notNullable()
        table.string('email').notNullable().unique()
        table.string('firstname').notNullable()
        table.string('lastname').notNullable()
        table.date('birthdate').notNullable()
        table.integer('verification_level').notNullable()
        table
          .timestamp('createdAt', { useTz: false, precision: 6 })
          .defaultTo(knex.fn.now(6))
        table
          .timestamp('updatedAt', { useTz: false, precision: 6 })
          .defaultTo(knex.fn.now(6))
      })
    })
}
exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
