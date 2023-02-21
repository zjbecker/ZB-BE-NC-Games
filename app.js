const express = require("express");
const {
  getReviews,
  getReviewById,
} = require("./controllers/reviews-controllers");
const { getCategories } = require("./controllers/categories-controllers");
const {
  psqlErrorsHandler,
  customErrorsHandler,
  serverErrors,
} = require("./controllers/error-handlers");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.use(psqlErrorsHandler);
app.use(customErrorsHandler);
app.use(serverErrors);

module.exports = app;
