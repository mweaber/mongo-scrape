var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    },
    img: {
        type: String,
        required: true,
        default: "No src"
    },
    summary: {
        type:String,
        required: true
    }

});

var Article = mongoose.model("article", ArticleSchema);
module.exports = Article;