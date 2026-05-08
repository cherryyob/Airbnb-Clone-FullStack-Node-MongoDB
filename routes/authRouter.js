const express = require("express");
const authRauter = express.Router();
const authController = require("../controller/authController");

authRauter.get("/login", authController.getLogin);
authRauter.post("/login", authController.postLogin);
authRauter.post("/logout", authController.postLogout);
module.exports = authRauter;
