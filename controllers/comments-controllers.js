const {
  fetchCommentsById,
  checkReviewId,
} = require("../models/comments-models");

const { fetchReviewById } = require("../models/reviews-models");

exports.getCommentsById = (req, res, next) => {
  const { review_id } = req.params;

  const isIdValid = fetchReviewById(review_id);
  const fetchComments = fetchCommentsById(review_id);

  return Promise.all([fetchComments, isIdValid])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
