const homeModel = require("../models/home");
const fs = require("fs");
const favourateModel = require("../models/favourate");

exports.getHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    activePage: "add-Home",
    isLoggedIn: req.session.isLoggedIn,
    editing: false,
    user: req.session.user,
  });
};

exports.postHome = (req, res, next) => {
  const { _id, homeName, price, location, rating, description } = req.body;
  console.log(req.files);
  if (!req.files["photo"] || !req.files["homeRuls"]) {
    return res.status(422).send("image or home rule is not valid");
  } else {
    const photo = req.files["photo"][0].path;
    const homeRuls = req.files["homeRuls"][0].path;
    console.log(req.file, "file name ");
    const homeM = new homeModel({
      homeName,
      price,
      location,
      rating,
      photo,
      homeRuls,
      description,
    });
    homeM
      .save()
      .then((results) => {
        res.render("host/homeAdded", {
          pageTitle: "Home Added",
          isLoggedIn: req.session.isLoggedIn,
          activePage: "homeAdded",
          user: req.session.user,
        });
      })
      .catch((err) => {
        console.log("error from save home ", err);
      });
  }
};
exports.postEditHome = (req, res, next) => {
  const { homeName, price, location, rating, _id, description } = req.body;
  console.log(req.body);
  homeModel
    .findById(_id)
    .then((home) => {
      ((home.homeName = homeName),
        (home.price = price),
        (home.location = location),
        (home.rating = rating),
        (home.description = description));
      if (req.files["photo"]) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("error while delete old photo file : ", err);
          }
        });
        home.photo = req.files["photo"][0].path;
      }
      if (req.files["homeRuls"]) {
        fs.unlink(home.homeRuls, (err) => {
          console.log("error while deleting home rules file : ", err);
        });
        home.homeRuls = req.files["homeRuls"][0].path;
      }
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
    user: req.session.user,
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
        user: req.session.user,
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
      user: req.session.user,
    });
  });
};
