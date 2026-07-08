const express = require("express");
const router = express.Router();
const { restrictTo } = require("../middlewares/auth");
const URL = require("../models/url");
const User = require("../models/user")

router.get("/admin/urls", restrictTo(["ADMIN"]), async(req,res) => {
    const allurls = await URL.find({})
    .populate("createdBy", "name email");
    res.render("home", {
        urls: allurls,
        message: "",
    }); 
})

router.get('/', restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
    const loggedInUser = await User.findById(req.user._id);

    const allurls = await URL.find({ 
        createdBy: req.user._id
    }).populate("createdBy", "name email");
    console.log(allurls);
    res.render("home", {
        urls: allurls,
        user: loggedInUser,
        message: "",
    });
});

router.get("/signup", (req,res) => {
    return res.render("signup");
});

router.get("/login", (req,res) => {
    return res.render("login");
});



module.exports = router;