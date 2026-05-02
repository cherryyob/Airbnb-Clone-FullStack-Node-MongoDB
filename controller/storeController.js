const homeModel = require("../models/home");
const favourateModel = require("../models/favourate");

exports.getHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home",
    activePage: "add-Home",
  });
};

exports.home = (req, res, next) => {
  homeModel
    .fatchAll()
    .then((rows) => {
      console.log(rows, "hi this is home");
      res.render("store/airbnb", {
        registorHome: rows,
        pageTitle: "home",
        activePage: "home",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.bookings = (req, res, next) => {
  res.render("./store/bookings", {
    pageTitle: "Bookings",
    activePage: "bookings",
  });
};
exports.homeDetails = (req, res, next) => {
  console.log("this isthis is");
  const id = req.params.homeId;
  console.log("home prams : ", id);
  homeModel.findById(id, (home) => {
    if (!home) {
      console.log("home is not found");
      res.redirect("/home-list");
    } else {
      console.log("home is found : ", home);
      res.render("./store/home-detail", {
        home: home,
        pageTitle: "Home Details",
        activePage: "home-details",
      });
    }
  });
};
exports.addToFavourate = (req, res, next) => {
  const homeId = req.body.postId;

  const fav = new favourateModel(homeId);
  fav.save().then((err) => {
    err && console.log("error in savinng favourate :", err);
  });

  res.redirect("/favourate");
};
exports.postRemoveHome = (req, res, next) => {
  const id = req.params.homeId;
  favourateModel.removeFaourate(id).then((rst) => {
    console.log("delete result : ", rst);
    res.redirect("/favourate");
  });
};
exports.favourate = (req, res, next) => {
  favourateModel.getFavoraties().then((homeIds) => {
    homeModel.fatchAll().then((allHomes) => {
      const homeListInFavourate = homeIds.map((ids) =>
        allHomes.find((home) => String(home._id) === ids.homeId),
      );

      res.render("store/favourate", {
        registorHome: homeListInFavourate,
        pageTitle: "Favorate",
        activePage: "favourate",
      });
    });

    console.log("homeIds from favourate controller", homeIds);
  });
};

exports.homeList = (req, res, next) => {
  homeModel.fatchAll().then((registorHome) => {
    res.render("store/homeList", {
      registorHome: registorHome,
      pageTitle: "home List",
      activePage: "homeList",
    });
  });
};
