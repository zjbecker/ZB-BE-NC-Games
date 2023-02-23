const db = require("../db/connection");

exports.fetchReviews = (category, sort_by = "created_at", order = "desc") => {
  let queryStr = ` SELECT r.owner, r.title, r.review_id, r.category, r.review_img_url,
  r.created_at, r.votes, r.designer, COUNT(c.review_id)::int AS comment_count
  FROM reviews r
  LEFT JOIN comments c ON r.review_id = c.review_id`;

  const validSortBy = {
    owner: true,
    title: true,
    review_id: true,
    category: true,
    review_img_url: true,
    created_at: true,
    votes: true,
    designer: true,
    comment_count: true,
  };
  const queryParams = [];

  //adding category
  if (category) {
    queryStr += " WHERE r.category = $1";
    queryParams.push(category);
  }
  //adding group by
  queryStr += " GROUP BY r.review_id";

  //adding sort by
  if (validSortBy[sort_by]) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ msg: "invalid sort by query", status: 400 });
  }
  //adding order
  if (order === "desc" || order === "asc") {
    queryStr += " " + order;
  } else {
    return Promise.reject({ msg: "invalid order by query", status: 400 });
  }

  return db.query(queryStr, queryParams).then((result) => result.rows);
};

exports.fetchReviewById = (reviewId) => {
  return db
    .query(
      `SELECT r.owner, r.title, r.review_id, r.category, r.review_img_url, r.review_body,
      r.created_at, r.votes, r.designer, COUNT(c.review_id)::int AS comment_count
      FROM reviews r
      LEFT JOIN comments c ON r.review_id = c.review_id
      WHERE r.review_id = $1
      GROUP BY r.review_id;`,
      [reviewId]
    )
    .then(({ rowCount, rows: review }) => {
      return rowCount
        ? review[0]
        : Promise.reject({ msg: "id not found", status: 404 });
    });
};

exports.updateReviewById = (reviewId, incVotes) => {
  if (!incVotes || typeof incVotes !== "number") {
    return Promise.reject({ msg: "invalid vote patch", status: 400 });
  } else {
    return db
      .query(
        `UPDATE reviews
       SET votes = votes + $1
       WHERE review_id = $2
       RETURNING *;`,
        [incVotes, reviewId]
      )
      .then(({ rows }) => rows[0]);
  }
};
