const express = require("express");
const router = express("routers");

const productsRoutes = require("./products/products.routes");
router.use("/products", productsRoutes);
module.exports = router;
