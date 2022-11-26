const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: "string", require: true },
  description: { type: "string", require: true },
  image: { type: "string", require: true },
  address: { type: "string", require: true },
  image: { type: "string", require: true },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  // creator: { type: "string", require: true },
  //! relation
  creator: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
