const { Router } = require("express");
const router = Router();
const ApiProductos = require("../../api/apiProductos");
const apiProductos = new ApiProductos();

router.get("/productos-test", (req, res) => {
  const result = apiProductos.productos();
  return res.render("index.hbs", {
    list: result,
    showList: true,
    name: req.session.user,
  });
});

module.exports = router;
