const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://sourabhrajput:sourabhrajput@cluster0.qnbu2.mongodb.net/eval-4");

module.exports = {
    connection
}