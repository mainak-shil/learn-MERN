const express = require("express");

const app = express();

// middleware // alter any request
// use next() for jump to next middleware

// bodyparser use to parse the data and auto next to next middleware
app.use((req, res, next) => {
  console.log("MIDDLEWARE");
  next();
});

app.use((req, res, next) => {
  re.send();
});

app.listen(3000);
