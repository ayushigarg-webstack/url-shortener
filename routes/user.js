const express = require("express");
const router = express.Router();
const { handleUserSignup } = require("../controllers/user");
const { handleUserLogin } = require("../controllers/user");

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("/login");
});

module.exports = router;