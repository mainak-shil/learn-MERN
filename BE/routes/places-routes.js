const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controller/places-controller");

const router = express.Router();
// order of routes matters

router.get("/", placesControllers.getAllPlaces);

// get only place using pid
router.get("/:pid", placesControllers.getPlaceById);

// get list of all places for a given user id (uid)
router.get("/user/:uid", placesControllers.getPlacesByUserId);

// post //! need validation
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

// update place using pid //! need validation
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
