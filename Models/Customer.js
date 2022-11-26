const mongoose = require("mongoose");

// create a schema for the Customers

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11
    },
    isGold: {
        type: Boolean,
        required: true
    }
})

// create a model
const Customer = mongoose.model("customer", customerSchema);

// export the model.
module.exports = Customer;