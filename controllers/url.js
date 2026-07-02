const { nanoid } = require("nanoid");
const URL = require('../models/url');


async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!req.body) return res.status(400).json({error: "Body is undefined"});
    if(!req.body.url) return res.status(400).json({msg:"url required"});
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],

    });
    return res.json({id: shortId});
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