var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");



var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongodScrape", {
    useNewUrlParser: true
});


app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/us").then(function (response) {
        var $ = cheerio.load(response.data);
        $("div.css-4jyr1y").each(function (i, element) {

            var link = $(element).children().attr("href");
            var title = $(element).children().find("h2.css-1dq8tca").text();
            let summary = $(element).children().find("p.css-1echdzn").text();
            let img = $(element).children().find("img").attr("src");
            let article = {
                title: title,
                link: link,
                img: img,
                summary: summary
            }
            db.Article.findOneAndUpdate({
                title: title
            }, article, {
                upsert: true,
                new: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
            res.render("index", {
                data: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App is running on localhost" + PORT);
});