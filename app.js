const express = require("express");

const {
  categoriesControllers: { getCategories },
  reviewsControllers: { getReviews, getReviewById, patchReviewById },
  errorControllers: { psqlErrorsHandler, customErrorsHandler, serverErrors },
  commentsControllers: { getCommentsById },
} = require("./controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.use(psqlErrorsHandler);
app.use(customErrorsHandler);
app.use(serverErrors);

module.exports = app;
