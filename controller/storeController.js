const homeModel = require("../models/home");
const favourateModel = require("../models/favourate");
const UserModel = require("../models/User");
const { getHomeBookings } = require("../utils/getLatestBookingDataUsingHomeId");
const { mongoose } = require("mongoose");
const bookingModel = require("../models/bookingModel");

exports.getHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "add-Home",
    user: req.session.user,
  });
};

exports.home = (req, res, next) => {
  homeModel
    .find()
    .then((rows) => {
      res.render("store/airbnb", {
        registorHome: rows,
        pageTitle: "home",
        isLoggedIn: req.session.isLoggedIn,
        activePage: "home",
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.checkout = async (req, res, next) => {
  const id = req.params.homeId;
  const selectedHome = await homeModel.findById(id);
  const disableRange = await getHomeBookings(id);
  console.log(disableRange, "disable");

  if (selectedHome) {
    res.render("./store/checkout", {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      home: selectedHome,
      disableRange,
      pageTitle: "Bookings",
      isLoggedIn: req.session.isLoggedIn,
      activePage: "bookings",
      user: req.session.user,
    });
  } else {
    const error = new Error("Selected home can't findeble");
    error.status = 404;
    return next(error);
  }
};
exports.bookings = async(req, res, next) => {
  const userId = req.session.user.id;
const userIdObj=new mongoose.Types.ObjectId(userId)
const bookings=await bookingModel.find({userId:userIdObj})

  console.log("session",bookings );
  res.render("./store/bookings", {
    bookings,
    pageTitle: "Bookings",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "bookings",
    user: req.session.user,
  });
};
exports.homeDetails = async (req, res, next) => {
  const id = req.params.homeId;

  homeModel.findById(id).then((home) => {
    if (!home) {
      res.redirect("/home-list");
    } else {
      res.render("./store/home-detail", {
        home: home,
        pageTitle: "Home Details",
        isLoggedIn: req.session.isLoggedIn,
        activePage: "home-details",
        user: req.session.user,
      });
    }
  });
};
exports.addToFavourate = async (req, res, next) => {
  try {
    const sessionId = req.session.user.id;
    const homeId = req.body.postId;
    const userDocument = await UserModel.findByIdAndUpdate(
      { _id: sessionId },
      {
        $addToSet: { favourate: homeId },
        new: true,
      },
    );
    if (userDocument.modifiedCount > 0) {
      res.redirect("/favourate");
    } else {
      console.log(userDocument, "document");
      res.redirect("/home-list");
    }
  } catch (err) {
    console.error("Error adding to favourite", err);
    res.status(500).send("server Error");
  }
};
exports.postRemoveFavourate = async (req, res, next) => {
  const id = req.params.homeId;
  const sessionId = req.session.user.id;
  try {
    const deleteResults = await UserModel.findOneAndUpdate(
      { _id: sessionId },
      {
        $pull: {
          favourate: id,
        },
      },

      { new: true },
    );
    res.redirect("/favourate");
  } catch (err) {
    console.error("Error while remooving home from fav list:", err);
    next(err);
  }
};
exports.favourate = async (req, res, next) => {
  const sessionId = req.session.user.id;
  const userId = await UserModel.findById(sessionId).populate("favourate");
  res.render("store/favourate", {
    registorHome: userId.favourate,
    pageTitle: "Favorate",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "favourate",
    user: req.session.user,
  });
};

exports.homeList = (req, res, next) => {
  homeModel.find().then((registorHome) => {
    res.render("store/homeList", {
      registorHome: registorHome,
      pageTitle: "home List",
      isLoggedIn: req.session.isLoggedIn,
      activePage: "homeList",
      user: req.session.user,
    });
  });
};
