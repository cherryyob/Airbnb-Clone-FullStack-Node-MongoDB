const homeModel = require("../models/home");
const favourateModel = require("../models/favourate");

exports.getHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    activePage: "add-Home",
    editing: false,
  });
};

exports.postHome = (req, res, next) => {
  const { _id, homeName, price, location, rating, photo, description } =
    req.body;

  const homeM = new homeModel(
    _id,
    homeName,
    price,
    location,
    rating,
    photo,
    description,
  );
  homeM.save();
  res.render("host/homeAdded", {
    pageTitle: "Home Added",
    activePage: "homeAdded",
  });
};
exports.postEditHome = (req, res, next) => {
  const { homeName, price, location, rating, photo, _id, description } =
    req.body;
  console.log(req.body);
  const editHome = new homeModel(
    _id,
    homeName,
    price,
    location,
    rating,
    photo,
    description,
  );

  editHome.save().then((results) => {
    console.log("home updated", results);
  });

  res.render("host/homeAdded", {
    pageTitle: "Edit Home",
    activePage: "homeHostList",
  });
};
exports.postPostDelete = (req, res, next) => {
  homeModel.deletePost(req.params.homeId, (err) => {
    err && console.log("error from delete callback :", err);
  });
  res.redirect("/host/host-home-list");
};
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  homeModel.findById(homeId, (home) => {
    if (!home) {
      console.log("home not found");
      res.redirect("/host/host-home-list");
    } else {
      res.render("host/edit-home", {
        editHome: home,
        editing: editing,
        pageTitle: "Edit Home",
        activePage: "Host Home",
      });
    }
  });
};

exports.hostHomeList = (req, res, next) => {
  homeModel.fatchAll().then((registorHome) => {
    res.render("host/host-home-list", {
      registorHome: registorHome,
      pageTitle: "Host Home List",
      activePage: "homeHostList",
    });
  });
};
