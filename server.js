const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const app = express(); //Initialize Express Application
const PORT = process.env.PORT || 8080; //declare our application port

const routes = require("./routes/api");

mongoose.connect(
  "mongodb+srv://admin:admin@flighttracker.w7rnq.mongodb.net/FlightTracker?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Mongo is connected to atlas.");
});

app.use(morgan("tiny")); //HTTP Request logger
app.use("/", routes);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
