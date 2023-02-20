const express = require("express");

const {
  getCategories,
  getReviews,
} = require("./controllers/categories-controllers");
const { errorHandler } = require("./controllers/error-handlers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.use(errorHandler);

module.exports = app;
