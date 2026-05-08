exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Add Home",
    activePage: "add-Home",
    isLoggedIn: req.session.isLoggedIn,

    editing: false,
  });
};
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.status(200).redirect("/");
};
exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.status(200).redirect("/login");
  });
};
