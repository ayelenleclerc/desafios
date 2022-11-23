const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.render("chat.hbs");
  } else return res.redirect("login");
});

module.exports = router;
