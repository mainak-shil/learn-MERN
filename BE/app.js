const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// connect routes
app.use("/api/places", placesRoutes); // prepended - /api/places/...

app.use("/api/users", usersRoutes); // prepended - /api/places/...

//! only runs if some req didn't get any req
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//! error middleware, throws from next()
// only exe for error if any midw have error in front
app.use((error, req, res, next) => {
  if (res.headerSent) {
    // if error sent
    return next(error);
  }
  // if no response is sent yet, then
  res.status(error.code || 500);
  res.json({ message: error.message || `An unknown error occurred` }); // mention message (convention)
});

app.listen(3000);
