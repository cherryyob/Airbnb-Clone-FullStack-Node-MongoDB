const express = require("express");

const userRauter = express.Router();
const storeController = require("../controller/storeController");

userRauter.get("/", storeController.home);
userRauter.get("/bookings", storeController.bookings);
userRauter.get("/home-details/:homeId", storeController.homeDetails);
userRauter.get("/booking", storeController.bookings);
userRauter.get("/favourate", storeController.favourate);
userRauter.get("/home-list", storeController.homeList);
userRauter.post("/favouraties", storeController.addToFavourate);
userRauter.post("/remove-favourate/:homeId", storeController.postRemoveHome);

module.exports = userRauter;
