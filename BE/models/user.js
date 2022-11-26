const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: "string", require: true },
  email: { type: "string", require: true, unique: true },
  password: { type: "string", require: true, minLength: 6 },
  image: { type: "string", require: true },
  // places: { type: "string", require: true },
  //! relation
  places: [{ type: mongoose.Types.ObjectId, require: true, ref: "Place" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
