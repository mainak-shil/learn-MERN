const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid"); //has timestamp
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
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

const getAllPlaces = (req, res, next) => {
  res.status(200).json({ places: DUMMY_PLACES });
};

const getPlaceById = (req, res, next) => {
  // 1st params to filter req
  const placeId = req.params.pid; // {pid: 'p1}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    // error handling
    // throw or next()
    // next for async programing
    res.status(404).json({ message: "Not found" });
    //or
    throw new HttpError("Could not find a place with that id", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!places) {
    //! error handling, err middleware
    return next(new HttpError("Could not find a place with that user id", 404));
  }
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed", 422));
  }
  //! get data out of body we need bodyparser
  // add middleware before req reaches the routes bcz middleware will be parsed from top to bottom
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  // add validation {todo}
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(200).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatePlace = { ...DUMMY_PLACES.find((e) => e.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((e) => e.id === placeId);
  updatePlace.title = title;
  updatePlace.description = description;

  DUMMY_PLACES[placeIndex] = updatePlace;
  res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find place for that id.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((e) => e.id !== placeId);
  res.status(200).json({ place: DUMMY_PLACES, message: "Deleted place" });
};

exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
