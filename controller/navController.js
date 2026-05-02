const homeModel = require("../models/home");

exports.getHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    activePage: "add-Home",
  });
};

exports.postHome = (req, res, next) => {
  const { homeName, price, location, rating, photo } = req.body;
  const homeM = new homeModel(homeName, price, location, rating, photo);
  homeM.save();
  res.render("host/homeAdded", {
    pageTitle: "Home Added",
    activePage: "homeAdded",
  });
};

exports.home = (req, res, next) => {
  homeModel.fatchAll((registorHome) => {
    console.log("fatch :", registorHome);
    res.render("store/homeList", {
      registorHome: registorHome,
      pageTitle: "home",
      activePage: "home",
    });
  });
};
exports.bookings = (req, res, next) => {
  res.render("./store/bookings", {
    pageTitle: "Bookings",
    activePage: "bookings",
  });
};
exports.homeDetails = (req, res, next) => {
  res.render("./store/home-detail", {
    pageTitle: "Home Details",
    activePage: "home-details",
  });
};
exports.page404 = (req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Page not found", activePage: "404" });
};
