const db = require("../db/connection");

exports.fetchReviews = () => {
  return db
    .query(
      ` SELECT r.owner, r.title, r.review_id, r.category, r.review_img_url,
        r.created_at, r.votes, r.designer, COUNT(c.review_id)::int AS comment_count
        FROM reviews r
        LEFT JOIN comments c ON r.review_id = c.review_id
        GROUP BY r.review_id
        ORDER BY r.created_at DESC;`
    )
    .then((result) => result.rows);
};

exports.fetchReviewById = (reviewId) => {
  return db
    .query(
      `SELECT * FROM reviews
      WHERE review_id = $1;`,
      [reviewId]
    )
    .then(({ rowCount, rows: review }) => {
      return rowCount
        ? review[0]
        : Promise.reject({ msg: "id not found", status: 404 });
    });
};
