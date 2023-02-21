module.exports.errorHandler = (req, res, next) => {
  res.status(404).send({ msg: "incorrect path: please try again" });
};
