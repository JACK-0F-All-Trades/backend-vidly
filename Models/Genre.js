const mongoose = require("mongoose");

// create a new schema for the genres

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        reqiured: true
    },
    type: {
        type: String,
        enum: ["movies", "action", "comedy", "historical", "fantasy", "horror"]
    }
})

// now create the model
const Genre = mongoose.model("Genre", genreSchema);

// now export this
module.exports = Genre;