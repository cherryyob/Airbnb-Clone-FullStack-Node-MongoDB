exports.getError = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not found",
    isLoggedIn: req.session.isLoggedIn,
    activePage: "404",
    user: req.session.user,
  });
};
