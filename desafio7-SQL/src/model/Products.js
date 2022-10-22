const knex = require("knex");

module.exports = class Product {
  constructor(dbConfig, tableName) {
    this.knex = knex(dbConfig);
    this.tableName = tableName;
  }
  async createTable(tableName) {
    const exists = await this.knex.schema.hasTable(this.tableName);
    if (!exists) {
      await this.knex.schema.createTable(tableName, (table) => {
        table.increments("id").notNullable().primary();
        table.string("title", 15).notNullable();
        table.float("price").notNullable();
        table.string("thumbnail").notNullable();
      });
    }
  }

  async getAll() {
    try {
      const products = await this.knex
        .from(this.tableName)
        .select("id", "title", "price", "thumbnail");
      console.table(products);
      return products;
    } catch (error) {
      console.log(error);
    } finally {
      this.knex.destroy();
    }
  }

  async getById(id) {
    try {
      const product = await this.knex
        .from(this.tableName)
        .select("id", "title", "price", "thumbnail")
        .where({ id: id });
      console.table(product);
    } catch (error) {
      console.log("error al obtener producto", error);
    } finally {
      this.knex.destroy();
    }
  }

  async save(product) {
    const { title, price, thumbnail } = product;
    if (!title || !price || !thumbnail) {
      return null;
    }

    const newProduct = {
      title,
      price,
      thumbnail,
    };

    try {
      await this.knex(this.tableName).insert(newProduct);
    } catch (error) {
      console.log(error);
    } finally {
      this.knex.destroy();
    }
  }

  async update(id, product) {
    const { title, price, thumbnail } = product;
    try {
      await this.knex.from(this.tableName).where({ id: id }).update({
        title: title,
        price: price,
        thumbnail: thumbnail,
      });
    } catch (error) {
      console.log("error al actualizar producto", error);
    } finally {
      knex(this.config).destroy();
    }
  }

  async deleteById(id) {
    try {
      await this.knex.from(this.tableName).where({ id }).del();
    } catch (error) {
      console.log(error);
    } finally {
      this.knex.destroy();
    }
  }
};
