const endpoints = require("../endpoints.json");

exports.getAPI = (req, res, next) => {
  return res.status(200).send({ endpoints });
};
