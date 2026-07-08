const User = require("../models/user");
const {v4: uuidv4} = require("uuid")
const {setUser} = require("../service/auth");

async function handleUserSignup(req,res) {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.render("signup", {
            error: "User already exists with this email",
        });
    }
    
    const user = await User.create({
        name,
        email,
        password,
    });
    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
}

async function handleUserLogin(req,res) {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.redirect("/signup");
    }

    if (existingUser.password !== password) {
        return res.render("login", {
            error: "Invalid Password",
        });
    }


    const token = setUser(existingUser);
    res.cookie('token', token);
    return res.redirect("/");
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
};