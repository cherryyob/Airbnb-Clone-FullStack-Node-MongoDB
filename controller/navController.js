const homeModel = require("../models/home");

exports.getHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    activePage: "add-Home",
    user: req.session.user,
  });
};

exports.postHome = (req, res, next) => {
  const { homeName, price, location, rating, photo } = req.body;
  const homeM = new homeModel(homeName, price, location, rating, photo);
  homeM.save();
  res.render("host/homeAdded", {
    pageTitle: "Home Added",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "homeAdded",
    user: req.session.user,
  });
};

exports.home = (req, res, next) => {
  homeModel.fatchAll((registorHome) => {
    console.log("fatch :", registorHome);
    res.render("store/homeList", {
      registorHome: registorHome,
      pageTitle: "home",
      isLoggedIn: req.session.isLoggedIn,
      activePage: "home",
      user: req.session.user,
    });
  });
};
exports.bookings = (req, res, next) => {
  res.render("./store/bookings", {
    pageTitle: "Bookings",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "bookings",
    user: req.session.user,
  });
};
exports.homeDetails = (req, res, next) => {
  res.render("./store/home-detail", {
    pageTitle: "Home Details",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "home-details",
    user: req.session.user,
  });
};
exports.page404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not found",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "404",
    user: req.session.user,
  });
};
