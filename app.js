const express = require("express");

const {
  apiControllers: { getAPI },
  categoriesControllers: { getCategories },
  reviewsControllers: { getReviews, getReviewById, patchReviewById },
  errorControllers: { psqlErrorsHandler, customErrorsHandler, serverErrors },
  commentsControllers: { getCommentsById, postCommentsById },
  usersControllers: { getUsers },
} = require("./controllers");

const app = express();
app.use(express.json());

app.get("/api", getAPI);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsById);
app.post("/api/reviews/:review_id/comments", postCommentsById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.use(psqlErrorsHandler, customErrorsHandler, serverErrors);

module.exports = app;
