const { nanoid } = require("nanoid");
const URL = require('../models/url');


async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!req.body) return res.status(400).json({error: "Body is undefined"});
    if(!req.body.url) return res.status(400).json({msg:"url required"});
    
    const existingURL = await URL.findOne({ redirectURL: body.url });
    if(existingURL) {
        const allurls = await URL.find({});
        return res.render("home", {
            id: existingURL.shortId,
            urls:allurls,
            message: "This URL has already been shortened!",
        })
    }

    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],

    });
    const allurls = await URL.find({});
    return res.render("home", {
        id: shortId,
        urls: allurls,
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