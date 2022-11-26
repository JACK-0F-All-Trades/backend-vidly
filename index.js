const express = require('express');
const genres = require('./routes/genres');
const customers = require("./routes/customers");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Vidly").then(() => console.log("Connected to DB...")).catch(() => console.log("Error occured while connecting to DB ..."));

const app = express();
app.use(express.json());        // use a middleware to handle json in the request body.
app.use("/api/genres", genres);
app.use("/api/customers", customers);






const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));






