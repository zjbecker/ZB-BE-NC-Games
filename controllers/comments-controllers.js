const {
  fetchCommentsById,
  addCommentById,
} = require("../models/comments-models");

const { fetchReviewById } = require("../models/reviews-models");

exports.getCommentsById = (req, res, next) => {
  const { review_id } = req.params;

  const isValidReviewId = fetchReviewById(review_id);
  const fetchComments = fetchCommentsById(review_id);

  return Promise.all([fetchComments, isValidReviewId])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsById = (req, res, next) => {
  const {
    params: { review_id },
    body,
  } = req;

  const isValidReviewId = fetchReviewById(review_id);
  const addComment = addCommentById(review_id, body);

  return Promise.all([addComment, isValidReviewId])
    .then(([postedComment]) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};
