const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

//! just return the uploaded files, don't execute
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  //! CORS handling
  //! idea: add some headers in response; later when we sent back specific routes
  //! does have these headers attached
  res.setHeader("Access-Control-Allow-Origin", "*"); //! allows which domain should allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

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
  if (req.file) {
    //! rollback image upload, don't store
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    // if error sent
    return next(error);
  }
  // if no response is sent yet, then
  res.status(error.code || 500);
  res.json({ message: error.message || `An unknown error occurred` }); // mention message (convention)
});

mongoose
  .connect(
    `mongodb+srv://mainak:Nc5xNGU4GG5N4Hy7@cluster0.oixkfgt.mongodb.net/places?retryWrites=true&w=majority`
  )
  .then(() => {
    //! if conn success
    app.listen(5001);
  })
  .catch((err) => console.log(err));
