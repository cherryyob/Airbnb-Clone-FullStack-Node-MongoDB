const homeModel = require("../models/home");
const favourateModel = require("../models/favourate");

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
exports.bookings = (req, res, next) => {
  console.log("session", req.session);
  res.render("./store/bookings", {
    pageTitle: "Bookings",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "bookings",
    user: req.session.user,
  });
};
exports.homeDetails = (req, res, next) => {
  const id = req.params.homeId;

  homeModel.findById(id).then((home) => {
    if (!home) {
      console.log("home is not found");
      res.redirect("/home-list");
    } else {
      console.log("home is found : ", home);
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
exports.addToFavourate = (req, res, next) => {
  const homeId = req.body.postId;

  const fav = new favourateModel({ homeId: homeId });
  fav
    .save()
    .then((savedData) => {
      console.log("Favourate saved : ", savedData);
      res.redirect("/favourate");
    })
    .catch((err) => {
      if (err.code === 11000) {
        console.log("Error Dublicate homeId");
        res.redirect("/home-list");
      } else {
        console.log("Other Error:", err);
        res.status(500).send("Internal Server Error");
      }
    });
};
exports.postRemoveFavourate = (req, res, next) => {
  const id = req.params.homeId;
  favourateModel.findOneAndDelete({ homeId: id }).then((rst) => {
    console.log("delete result : ", rst, "id is ", id);
    res.redirect("/favourate");
  });
};
exports.favourate = (req, res, next) => {
  favourateModel
    .find()
    .populate("homeId")
    .then((homes) => {
      const homeNew = homes.map((home) => home.homeId);

      res.render("store/favourate", {
        registorHome: homeNew,
        pageTitle: "Favorate",
        isLoggedIn: req.session.isLoggedIn,
        activePage: "favourate",
        user: req.session.user,
      });
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
