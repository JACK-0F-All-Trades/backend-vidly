const express = require("express");
const joi = require("joi");
const Customer = require("../Models/Customer");

const router = express.Router();

router.get("/", async (req, res) => {
    const result = await Customer.find();
    res.status(200).send(result);
})

router.get("/:name", async (req, res) => {
    const result = await Customer.findOne({ name: req.params.name });
    if (!result) return res.status(400).send(`No such customer found with the name: ${req.params.name}`);

    res.status(200).send(result);
})

function validateCustomerInput(customerObj) {
    const schema = joi.object({
        name: joi.string().min(3).required(),
        phone: joi.string().min(11).required(),
        isGold: joi.boolean().required()
    })

    const { error } = schema.validate(customerObj);
    if (error) return false;

    return true;
}

router.post("/", async (req, res) => {
    // validate the input from the user
    const validationResult = validateCustomerInput(req.body);

    if (!validationResult) return res.status(400).send("Error while inserting the Customer! (Valiation failed)");

    // create the new customer.
    const newCustomer = new Customer(req.body);

    // save the customer in the db.
    const result = await newCustomer.save();
    return res.status(200).send(result);

})

router.put("/:name", async (req, res) => {
    // check if the record exists.
    const presentObject = await Customer.findOne({ name: req.params.name });
    if (!presentObject) return res.status(404).send(`No such record exists with the name: ${req.params.name}`);

    // check if the user request is valid
    const validationResult = validateCustomerInput(req.body);
    if (!validationResult) return res.status(400).send("Validation failed!");

    // update the user.
    presentObject.set({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    // now save the object into the db.
    const result = await presentObject.save();
    return res.status(200).send(result);
})

router.delete("/:name", async (req, res) => {
    // check if the record exists.
    const presentObject = await Customer.findOne({ name: req.params.name });
    if (!presentObject) return res.status(404).send(`No such record exists with the name: ${req.params.name}`);

    // delete the object
    const result = await Customer.deleteOne({ name: req.params.name });
    return res.status(200).send(result);

})

module.exports = router;
