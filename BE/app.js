const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

// connect routes
app.use("/api/places", placesRoutes); // prepended - /api/places/...

app.listen(3000);
