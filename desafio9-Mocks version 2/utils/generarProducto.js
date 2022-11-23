const faker = require("@faker-js/faker");
faker.locale = "es";

function generarProducto() {
  return {
    title: faker.commerce.product(),
    price: Number(faker.commerce.price()),
    thumbnail: faker.image.imageUrl(),
  };
}

module.exports = { generarProducto };
