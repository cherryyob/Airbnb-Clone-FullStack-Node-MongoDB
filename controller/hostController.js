const homeModel = require("../models/home");
const favourateModel = require("../models/favourate");

exports.getHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    activePage: "add-Home",
    isLoggedIn: req.session.isLoggedIn,
    editing: false,
  });
};

exports.postHome = (req, res, next) => {
  const { _id, homeName, price, location, rating, photo, description } =
    req.body;

  const homeM = new homeModel({
    homeName,
    price,
    location,
    rating,
    photo,
    description,
  });
  homeM
    .save()
    .then((results) => {
      res.render("host/homeAdded", {
        pageTitle: "Home Added",
        isLoggedIn: req.session.isLoggedIn,
        activePage: "homeAdded",
      });
    })
    .catch((err) => {
      console.log("error from save home ", err);
    });
};
exports.postEditHome = (req, res, next) => {
  const { homeName, price, location, rating, photo, _id, description } =
    req.body;
  console.log(req.body);
  homeModel
    .findById(_id)
    .then((home) => {
      ((home.homeName = homeName),
        (home.price = price),
        (home.location = location),
        (home.rating = rating),
        (home.photo = photo),
        (home.description = description));
      home
        .save()
        .then((results) => {
          console.log("home updated", results);
        })
        .catch((err) => {
          console.log("error from update home ", err);
        });
    })
    .catch((err) => {
      console.log("error from find home ", err);
    });

  res.render("host/homeAdded", {
    pageTitle: "Edit Home",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "homeHostList",
  });
};
exports.postPostDelete = (req, res, next) => {
  const id = req.params.homeId;
  homeModel
    .findByIdAndDelete(id)
    .then((results) => {
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("error from delete home ", err);
    });
};
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  homeModel.findById(homeId).then((home) => {
    if (!home) {
      console.log("home not found");
      res.redirect("/host/host-home-list");
    } else {
      res.render("host/edit-home", {
        editHome: home,
        editing: editing,
        pageTitle: "Edit Home",
        isLoggedIn: req.session.isLoggedIn,
        activePage: "Host Home",
      });
    }
  });
};

exports.hostHomeList = (req, res, next) => {
  homeModel.find().then((registorHome) => {
    res.render("host/host-home-list", {
      registorHome: registorHome,
      pageTitle: "Host Home List",
      isLoggedIn: req.session.isLoggedIn,
      activePage: "homeHostList",
    });
  });
};
