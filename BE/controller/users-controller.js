const HttpError = require("./../models/http-error");
const { v4: uuidv4 } = require("uuid"); //has timestamp
const { validationResult } = require("express-validator");

const User = require("../models/user");

// let DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "mainak shil",
//     email: "ms@ms.com",
//     password: "test",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "--password"); // "email name"
  } catch (error) {
    return next(new HttpError("Fetching users failed", 500));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log("existingUser", existingUser);
  } catch (err) {
    console.log("err", err);
    return next(new HttpError("Signup failed", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exists", 422));
  }
  //! if email already exist //old
  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("User already exists", 422);
  // }

  const createdUser = new User({
    name,
    email,
    password,
    image: req.file.path,
    // image:
    //   "https://thumbs.dreamstime.com/b/ten-cats-row-many-cats-sitting-row-front-white-background-128832657.jpg",
    places: [],
  });
  console.log("createdUser", createdUser);
  // const createdUser = {
  //   id: uuidv4(),
  //   name,
  //   email,
  //   password,
  // };
  try {
    await createdUser.save();
  } catch (err) {
    console.log("err", err);

    return next(new HttpError("Signup failed, try again", 500));
  }
  // DUMMY_USERS.push(createdUser);
  res.status(201).json({ users: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    console.log(existingUser);
  } catch (err) {
    return next(new HttpError("Signup failed", 500));
  }
  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Invalid credentials, could not login"));
  }
  //! old
  // const identifiedUser = DUMMY_USERS.find((e) => e.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError("User not found/invalid password", 401);
  // }
  res.status(200).json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
