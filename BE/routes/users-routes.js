const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controller/users-controller");

const HttpError = require("../models/http-error");

const router = express.Router();
// order of routes matters

router.get("/", usersControllers.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login);

module.exports = router;
