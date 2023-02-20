module.exports.errorHandler = (req, res, next) => {
  //   const {
  //     err: { status, msg },
  //   } = err;

  //generic errors:
  res.status(404).send({ msg: "incorrect path: please try again" });
};
