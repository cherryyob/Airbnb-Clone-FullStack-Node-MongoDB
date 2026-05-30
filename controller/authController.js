const bcrypt = require("bcryptjs");
const user = require("../models/User");
const { check, validationResult } = require("express-validator");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    activePage: "login",
    isLoggedIn: false,
    error: [],
    oldInput: [],
    editing: false,
  });
};
exports.postLogin = async (req, res, next) => {
  const { emailId, password } = req.body;
  try {
    const findedUser = await user.findOne({ email: emailId });
    console.log(findedUser, "this is from database");
    if (!findedUser) {
      console.log("user Not found:", emailId);
      return res.status(422).render("auth/login", {
        pageTitle: "login",
        activePage: "login",
        isLoggedIn: false,
        error: ["user does not exist"],
        oldInput: [emailId],
        user: req.session.user,
      });
    }
    const isMatch = await bcrypt.compare(password, findedUser.password);
    if (!isMatch) {
      console.log("password not match");

      return res.status(422).render("auth/login", {
        pageTitle: "login",
        activePage: "login",
        isLoggedIn: false,
        error: ["user password not match"],
        oldInput: [emailId],
        user: req.session.user,
      });
    }

    req.session.isLoggedIn = true;
    const { _id, firstName, lastName, email, userType } = findedUser;
    req.session.user = {
      id: _id.toString(),
      firstName,
      lastName,
      email,
      userType,
    };
    return req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
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
    error: [],
    oldInput: {},
    user: req.session.user,
  });
};
exports.forgatePassword = (req, res) => {
  res.status(200).render("auth/forgatePassword", {
    pageTitle: "Forgate Password",
    activePage: "login",
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.postsingup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage(" First name must be at least 2 charactor")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name should only containt alphabets"),
  check("lastName")
    .trim()
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last Name Should containt only alphabets"),
  check("email").isEmail().withMessage("enter vailid email").normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 charactor")
    .matches(/[a-z]/)
    .withMessage("password should containt one lowercase")
    .matches(/[A-Z]/)
    .withMessage("password should containt one uppercase")
    .matches(/[0-9]/)
    .withMessage("password should containt one number")
    .matches(/[!@#$%^&*_+?><]/)
    .withMessage("password should containt one special charactor")
    .trim(),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirmPassword do not matche");
      }
      return true;
    }),
  check("userType")
    .notEmpty()
    .withMessage("userType must needed")
    .isIn(["guest", "host"])
    .withMessage("user type invalid"),
  check("terms")
    .notEmpty()
    .withMessage("please accept term and condition")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error(" must accept term and condition");
      }
      return true;
    }),
  (req, res) => {
    const error = validationResult(req);
    const { firstName, lastName, email, password, userType, terms } = req.body;
    if (!error.isEmpty()) {
      res.status(422).render("auth/singup", {
        pageTitle: "SingUp",
        activePage: "singup",
        isLoggedIn: false,
        error: error.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, password, userType, terms },
        user: req.session.user,
      });
    } else {
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const userModel = new user({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        userModel
          .save()
          .then(() => {
            res.status(200).redirect("/login");
          })
          .catch((err) => {
            res.status(422).render("auth/singup", {
              pageTitle: "SingUp",
              activePage: "singup",
              isLoggedIn: false,
              error: [err.message],
              user: req.session.user,

              oldInput: {
                firstName,
                lastName,
                email,
                password,
                userType,
                terms,
              },
            });
          });
      });
    }
  },
];
