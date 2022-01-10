const express = require("express");

const router = express.Router();
// order of routes matters

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

// get only place using pid
router.get("/:pid", (req, res, next) => {
  // 1st params to filter req
  const placeId = req.params.pid; // {pid: 'p1}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    // error handling
    // throw
    const error = new Error("Could not find a place with that id");
    error.code = 404;
    throw error;
  }
  res.json({ place });
});

// get list of all places for a given user id (uid)
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => p.creator === userId);
  if (!place) {
    // error handling
    const error = new Error("Could not find a place with that user id");
    error.code = 404;
    return next(error); // next for async programing
  }
  res.json({ place });
});

module.exports = router;
