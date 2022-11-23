const { Router } = require("express");
const router = Router();

router.get("/login", (req, res) => {
  return res.render("login.hbs");
});
router.post("/login", (req, res) => {
  let username = req.body.name;
  req.session.user = username;
  return res.redirect("productos");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.render("bye_banner.hbs");
    } else res.send({ status: "Logout ERROR", body: err });
  });
});

module.exports = router;
