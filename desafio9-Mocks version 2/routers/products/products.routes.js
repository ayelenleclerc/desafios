const { Router } = require("express");
const router = Router();
const path = require("path");
const Contenedor = require("../../models/contenedor");

const productos = new Contenedor(
  path.join(__dirname, "../../data/productos.json")
);

router.get("/", (req, res) => {
  if (req.session.user) {
    let content = productos.content;
    let boolean = content.length !== 0;
    return res.render("index.hbs", {
      list: content,
      showList: boolean,
      name: req.session.user,
    });
  } else return res.redirect("login");
});

router.post("/", (req, res) => {
  if (req.session.user) {
    productos.save(req.body);
    let content = productos.content;
    let boolean = content.length !== 0;
    return res.render("index.hbs", {
      list: content,
      showList: boolean,
      name: req.session.user,
    });
  } else return res.redirect("login");
});

module.exports = router;
