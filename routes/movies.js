const { Movie } = require('../Models/Movie');
const express = require('express');
const router = express.Router();
const joi = require('joi');
const { Genre } = require('../Models/Genre');

// function to create a movie

function createMovie(movieDetials, genre) {
    return new Movie({
        title: movieDetials.title,
        genre: {
            name: genre.name
        },
        numberInStock: movieDetials.numberInStock,
        dailyRentalRate: movieDetials.dailyRentalRate
    });
}

// function to get all the movies from the database.
async function getMovies() {
    const result = await Movie.find();
    return result;
}
function validateInput(obj) {
    const schema = joi.object({
        title: joi.string().min(3).required(),
        genreId: joi.string().required(),
        numberInStock: joi.number().required(),
        dailyRentalRate: joi.number().required()
    })

    const { error } = schema.validate();

    if (error) return false;

    return true;
}

// function to update a movie.
async function updateMovie(movieTitle, updatedObj) {
    // find the movie.
    const presentMovie = await Movie.findOne({ title: movieTitle });
    if (!presentMovie) return false;

    // check for result validation from the user.
    const validationResult = validateInput(updatedObj);
    if (!validationResult) return false;

    // now update the movie.
    presentMovie.set({
        title: updatedObj.title,
        genre: {
            _id: updatedObj.genreId
        },
        numberInStock: updatedObj.numberInStock,
        dailyRentalRate: updatedObj.dailyRentalRate
    })

    // now save it back
    const result = await presentMovie.save();
    if (!result) return false;

    return true;

}

// function to delete a movie.
async function deleteMovie(movieTitle) {
    const movieToDelete = await Movie.findOne({ title: movieTitle });

    if (!movieToDelete) return false;

    const result = await Movie.deleteOne({ title: movieTitle });
    if (result.deletedCount == 1) return true;
    return false;
}

// now some apis.

router.get("/", async (req, res) => {
    // display all the documents.
    const result = await getMovies();
    res.status(200).send(result);
})

router.get("/:title", async (req, res) => {
    const result = await Movie.findOne({ title: req.params.title }).populate('genre');
    if (!result) return res.status(404).send(`No record found with the title: ${req.params.title}`);

    return res.status(200).send(result);
})

// post api
router.post("/", async (req, res) => {
    // first validate the use input.
    const validationResult = validateInput(req.body);
    if (!validationResult) return res.status(400).send("Validation failed!");

    // check if the genre exists or not.
    const genre = Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("No such genre exists!");

    // now create the object
    const newMovie = createMovie(req.body, genre);

    // now save the object in the database.
    const result = await newMovie.save();

    if (!result) return res.status(400).send("Object not saved in the database!");

    return res.status(200).send(result);
})

// put api
router.put("/:title", async (req, res) => {
    const result = await updateMovie(req.params.title, req.body);
    if (!result) return res.status(400).send("Updation failed!");

    return res.status(200).send("Updated Successfully!");
})

// delete api.

router.delete("/:title", async (req, res) => {
    const result = await deleteMovie(req.params.title);
    if (!result) return res.status(400).send("Deletion failed!");

    return res.status(200).send("Deleted Successfully!");
})

module.exports = router;