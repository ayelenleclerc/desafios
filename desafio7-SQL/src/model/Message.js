const knex = require("knex");

module.exports = class Message {
  constructor(dbConfig, tableName) {
    this.tableName = tableName;
    this.knex = knex(dbConfig);
  }
  async createTable() {
    const exists = await this.knex.schema.hasTable(this.tableName);
    if (!exists) {
      await this.knex.schema.createTable(tableName, (table) => {
        table.increments("id").notNullable().primary();
        table.string("email").notNullable();
        table.string("text").notNullable();
        table.string("time").notNullable();
      });
    }
  }
  async addMessage(data) {
    try {
      await this.knex(this.table).insert(data);
    } catch (error) {
      console.log("error al añadir mensaje", error);
    } finally {
      this.knex.dest();
    }
  }

  async getMessages() {
    try {
      const messages = await this.knex.from(this.table).select("*");
      console.log(messages);
      return messages;
    } catch (error) {
      console.log("error al obtener mensajes", error);
    } finally {
      this.knex.destroy();
    }
  }
};
