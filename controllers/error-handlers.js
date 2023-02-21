exports.psqlErrorsHandler = (err, req, res, next) => {
  const { code, message } = err;
  if (code === "22P02") {
    res.status(400).send({ msg: message });
  } else {
    next(err);
  }
};

exports.customErrorsHandler = (err, req, res, next) => {
  const { status, msg } = err;

  if (status && msg) {
    res.status(status).send({ msg });
  } else {
    console.log(`unhandled error ${err}`);
    response.status(500).send({ msg: "unhandled error" });
  }
};

exports.serverErrors = (req, res, next) => {
  res.status(404).send({ msg: "invalid path" });
};
