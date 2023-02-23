const {
  fetchReviews,
  fetchReviewById,
  updateReviewById,
} = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  return fetchReviews()
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

exports.patchReviewById = (req, res, next) => {
  const {
    params: { review_id },
    body: { inc_votes },
  } = req;

  const isValidReviewId = fetchReviewById(review_id);
  const updateReview = updateReviewById(review_id, inc_votes);

  return Promise.all([updateReview, isValidReviewId])
    .then(([updatedReview]) => {
      res.status(200).send({ updatedReview });
    })
    .catch(next);
};
