const mongoose = require('mongoose');
const { genreSchema } = require('./Genre');


// now for the movies schema.
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})

const Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;


