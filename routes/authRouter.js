const express = require("express");
const authRauter = express.Router();
const authController = require("../controller/authController");

authRauter.get("/login", authController.getLogin);
authRauter.post("/login", authController.postLogin);
authRauter.post("/logout", authController.postLogout);
authRauter.get("/singup", authController.getsingup);
authRauter.get("/forgatePassword", authController.forgatePassword);
authRauter.post("/singup", authController.postsingup);
module.exports = authRauter;
