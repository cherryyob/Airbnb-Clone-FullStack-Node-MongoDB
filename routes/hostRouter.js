const express = require("express");
const hostRouter = express.Router();
const hostController = require("../controller/hostController");
hostRouter.get("/add-home", hostController.getHome);
hostRouter.get("/host-home-list", hostController.hostHomeList);

hostRouter.post("/add-home", hostController.postHome);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home/:homeId", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postPostDelete);

module.exports = hostRouter;
