const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

// connect routes
app.use("/api/places", placesRoutes); // prepended - /api/places/...

// only exe for error if any midw have error in front
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  // if no response is sent yet, then
  res.status(error.code || 500);
  res.json({ message: error.message || `An unknown error occurred` }); // mention message (convention)
});

app.listen(3000);
