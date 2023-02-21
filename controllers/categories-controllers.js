const {
  fetchCategories,
  fetchReviews,
} = require("../models/categories-models");

module.exports.getCategories = (req, res, next) => {
  return fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

module.exports.getReviews = (req, res, next) => {
  return fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
