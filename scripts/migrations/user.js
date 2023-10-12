exports.up = (knex) => {
  return knex.schema
    .dropTableIfExists('users')
    .createTable('users', function (table) {
      table.increments('id').primary()
      table.text('username').notNullable()
      table.text('password').notNullable()
      table.text('email').notNullable()
      table.text('firstname').notNullable()
    })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
