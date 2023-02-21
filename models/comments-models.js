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
