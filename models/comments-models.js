const db = require("../db/connection");

exports.fetchCommentsById = (reviewId) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE review_id = $1
       ORDER BY created_at DESC;`,
      [reviewId]
    )
    .then((result) => result.rows);
};

exports.addCommentById = (reviewId, commentObj) => {
  const { username, body } = commentObj;

  if (!username || typeof username !== "string") {
    return Promise.reject({ msg: "invalid username", status: 400 });
  } else if (!body || typeof body !== "string") {
    return Promise.reject({ msg: "invalid comment", status: 400 });
  } else {
    return db
      .query("SELECT * FROM users WHERE username = $1;", [username])
      .then(({ rowCount }) => {
        if (!rowCount) {
          return Promise.reject({ msg: "user not found", status: 404 });
        } else {
          return db
            .query(
              `INSERT INTO comments
               (review_id, author, body)
               VALUES
               ($1, $2, $3)
               RETURNING *;`,
              [reviewId, username, body]
            )
            .then(({ rows }) => rows[0]);
        }
      });
  }
};
