const mongoose = require("mongoose");
// Mongoose Schema
const Schema = mongoose.Schema;
const FlightsSchema = new Schema({
  origin: String,
  departure: String,
  price: String,
  departDate: String,
  leaveDate: String,
});

//Mongoose Model
const Flights = mongoose.model("Flights", FlightsSchema);

module.exports = Flights;
