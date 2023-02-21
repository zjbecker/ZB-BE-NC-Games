const express = require("express");

const {
  getCategories,
  getReviews,
} = require("./controllers/categories-controllers");
const { errorHandler } = require("./controllers/error-handlers");
const { getCommentsById } = require("./controllers/comments-controllers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsById);

app.use(errorHandler);

module.exports = app;
