const path = require("path");
const express = require("express");
const Products = require("./model/Products");

const app = express();
const PORT = process.env.PORT || 8080;

const products = new Products();

app.set("views", "./views");
app.set("view engine", "pug");
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));

// app.get("/", (req, res) => {
//   res.render("index", {});
// });

app.get("/productos", (req, res) => {
  res.render("main", { products: products.getAll() });
});
app.post("/productos", (req, res) => {
  let { title, price, thumbnail } = products.save(req.body);
  res.redirect("/productos");
});

const connectedServer = app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`);
});

connectedServer.on("error", (error) => {
  console.log(error.message);
});
