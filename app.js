const express = require("express");
const { connectToMongoDB } = require("./connect");
const app = express();
const path = require("path");
// const router = express.Router();


const URL = require('./models/url');
const staticRoute = require("./routes/staticRouter");
app.use(express.static(path.join(__dirname, "public")));

const urlRoute = require("./routes/url");

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('MongoDB connected'));

app.use(express.json());
app.use(express.urlencoded({ extended:false })); 


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use('/', staticRoute);
app.use("/url", urlRoute);

app.get("/test", async (req,res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
});


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId: shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            },
        }
    );
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});