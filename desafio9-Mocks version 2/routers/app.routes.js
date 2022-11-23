const { Router } = require("express");
const router = Router();

const productsRouter = require("./products/products.routes");
const chatRouter = require("./chat/chat.routes"); //lo manejo desde app.js porque me da error
const fakerRouter = require("./faker/faker.routes");
const sessionRouter = require("./session/session.routes");

router.use("/productos", productsRouter);
router.use("/chat", chatRouter);
router.use("/", fakerRouter);
router.use("/", sessionRouter);

module.exports = router;
