const HttpError = require("./../models/http-error");
const { v4: uuidv4 } = require("uuid"); //has timestamp
const { validationResult } = require("express-validator");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "mainak shil",
    email: "ms@ms.com",
    password: "test",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { name, email, password } = req.body;
  //! if email already exist
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("User already exists", 422);
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ users: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((e) => e.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User not found/invalid password", 401);
  }
  res.status(200).json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
