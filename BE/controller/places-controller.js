const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const { v4: uuidv4 } = require("uuid"); //has timestamp
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: "20 W 34th St, New York, NY 10001",
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: "20 W 34th St, New York, NY 10001",
//     creator: "u1",
//   },
// ];

const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (error) {
    return next(new HttpError("Could not able to find places", 500));
  }
  res.status(200).json({ places });
};

const getPlaceById = async (req, res, next) => {
  // 1st params to filter req
  const placeId = req.params.pid; // {pid: 'p1}
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Couldnot find a place, try again", 500));
  }

  //!old
  // const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    // error handling
    // throw or next()
    // next for async programing
    // res.status(404).json({ message: "Not found" });
    //or
    return next(new HttpError("Could not find a place with that id", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log("userId", userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError("fetching place failed", 500));
  }
  //!old
  //const places = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!places || places.length === 0) {
    //! error handling, err middleware
    return next(new HttpError("Could not find a place with that user id", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
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
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://thumbs.dreamstime.com/b/ten-cats-row-many-cats-sitting-row-front-white-background-128832657.jpg",
    creator, //!logged in user id
  });

  let user;
  try {
    //!check if the logged in userId exists
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed", 500));
  }

  if (!user) {
    //! if user in not db
    return next(new HttpError("User not found for given id", 500));
  }
  console.log(user);

  //! Old
  // const createdPlace = {
  //   id: uuidv4(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };
  try {
    //! relation operation 1.store new doc place 2. add placeId <--> user
    //multiple op; both/either fails undo all //! transitions ; sessions
    const session = await mongoose.startSession();
    session.startTransaction();
    //! 1. place created
    await createdPlace.save({ session });
    //! placeId is added in user
    //! mongoose push -> establish conn between models
    user.places.push(createdPlace);
    //! update user
    await user.save();
    await session.commitTransaction();

    //! old
    //await createdPlace.save();
  } catch (err) {
    console.log("err", err);
    return next(new HttpError("Creating place failed, try again", 500));
  }
  //DUMMY_PLACES.push(createdPlace);

  res.status(200).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not find a place with id", 500));
  }
  //!old
  //const updatePlace = { ...DUMMY_PLACES.find((e) => e.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((e) => e.id === placeId);
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Could not update place with id", 500));
  }
  //!old
  //DUMMY_PLACES[placeIndex] = updatePlace;
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not find a place with that id", 500));
  }
  //!old
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find place for that id.", 404);
  // }
  try {
    await place.remove();
  } catch (error) {
    return next(new HttpError("Could not delete the place", 500));
  }
  //!old
  // DUMMY_PLACES = DUMMY_PLACES.filter((e) => e.id !== placeId);
  res.status(200).json({ message: "Deleted place" });
};

exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
