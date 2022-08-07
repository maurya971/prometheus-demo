let path = require("path");
const express = require("express");
const cors = require("cors");
const prometheusRoute = require("./router");
const responseService = require("./service/response");
const promMid = require('express-prometheus-middleware');

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.use("/", prometheusRoute);

app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    authenticate: req => req.headers.authorization === 'Bearer mysecrettoken',
  }));

app.all("*", function (req, res) {
  return responseService._validationError(res, "Page not found", "Page not found");
});

app.use((err, req, res, next) => {
  return responseService._handleError(res, err, err.message);
});

app.listen(port, () => {
  console.log("Server is running at port " + port);
});

exports = module.exports = app;
