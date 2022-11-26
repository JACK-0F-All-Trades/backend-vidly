const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Genre = require('../Models/Genre');

// genres array
// const genres = [
//     { id: 1, name: "genre1", type: "action" },
//     { id: 2, name: "genre2", type: "comedy" },
//     { id: 3, name: "genre3", type: "sports" },

// ];
// get api
router.get("/", async (req, res) => {
    // get all the genres from the database
    const result = await Genre.find();
    res.status(200).send(result);
})

// get api for a specific name.
router.get("/:name", async (req, res) => {
    const result = await Genre.find({ name: req.params.name });
    if (!result) return res.status(404).send("Genre Not Found!");

    return res.send(result);
})

// post api.
router.post("/", async (req, res) => {
    // validation
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        type: Joi.string().min(3).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // genres.push({
    //     id: genres.length + 1,
    //     name: req.body.name,
    //     type: req.body.type
    // })

    // now create a mongoDB document
    const newGenre = new Genre(req.body);
    try {
        const result = await newGenre.save();
        return res.send(result);
    }
    catch (ex) {
        console.log(ex.message);
    }



})

// put api.
router.put("/:name", async (req, res) => {
    // check if the genre exists.
    const foundObject = await Genre.findOne({ name: req.params.name });
    if (foundObject.length == 0) return res.status(404).send("Genre Not Found!");

    // check if the request is valid.
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        type: Joi.string().min(3).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // update. (valid)
    // result.name = req.body.name;
    // result.type = req.body.type;

    // we will use the set method instead of the above approach
    foundObject.set({
        name: req.body.name,
        type: req.body.type
    })

    // now save the course back into the DB
    const savedObject = await foundObject.save();

    return res.send(savedObject);

})

// delete api.

router.delete("/:name", async (req, res) => {
    // check if the genre exists.
    const foundObject = await Genre.findOne({ name: req.params.name });
    if (!foundObject) return res.status(404).send("Genre Not Found!");

    // const indexOfDelete = genres.indexOf(result);

    // genres.splice(indexOfDelete, 1);
    // return res.send(genres);
    const result = await Genre.deleteOne({ name: req.params.name });
    return res.status(200).send(result);
})

module.exports = router;