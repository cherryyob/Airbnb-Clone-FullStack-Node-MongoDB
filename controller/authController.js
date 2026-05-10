exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    activePage: "login",
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
exports.getsingup = (req, res) => {
  res.status(200).render("auth/singup", {
    pageTitle: "SingUp",
    activePage: "singup",
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.forgatePassword = (req, res) => {
  res.status(200).render("auth/forgatePassword", {
    pageTitle: "Forgate Password",
    activePage: "login",
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.postsingup = (req, res) => {
  console.log(req.body);
  res.status(200);
};
