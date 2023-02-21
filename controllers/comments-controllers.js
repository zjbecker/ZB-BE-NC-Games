exports.getCommentsById = (req, res, next) => {
  return fetchCommentsById()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
