const { fetchReviews, fetchReviewById } = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = request.query;
  return fetchReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  return fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
