const express = require("express");
const authRouter = express.Router();
const {
  getTime,
  getMetrics
} = require("../controller/prometheus");
const {
  isAuthorized
} = require("../controller/auth");

authRouter.get("/time", getTime);


const baseRouter = express.Router();
baseRouter.use("/", isAuthorized, authRouter);


module.exports = baseRouter;
