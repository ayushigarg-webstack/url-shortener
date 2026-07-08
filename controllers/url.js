const { nanoid } = require("nanoid");
const URL = require('../models/url');
const User = require("../models/user");

async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    const loggedInUser = await User.findById(req.user._id);
    if(!req.body) return res.status(400).json({error: "Body is undefined"});
    if(!req.body.url) return res.status(400).json({msg:"url required"});
    
    const existingURL = await URL.findOne({ 
        redirectURL: body.url,
        createdBy: req.user._id,
     });
    if(existingURL) {
        const allurls = await URL.find({
            createdBy: req.user._id,
        }).populate("createdBy", "name email");
        return res.render("home", {
            id: existingURL.shortId,
            urls:allurls,
            user: loggedInUser,
            message: "This URL has already been shortened!",
        })
    }

    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,

    });
    const allurls = await URL.find({
        createdBy: req.user._id
    }).populate("createdBy", "name email");
    return res.render("home", {
        id: shortId,
        urls: allurls,
        user: loggedInUser,
        message: "",
    });
};

async function handleGetAnalytics(req,res) {
    shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ 
        totalClicks: result.visitHistory.length, 
        analytics: result.visitHistory,
    });
}
module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};