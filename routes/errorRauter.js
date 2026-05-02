const express = require("express");
const errorRouter = express.Router();
const errorController = require("../controller/errorController");

errorRouter.use(errorController.getError);

module.exports = errorRouter;
