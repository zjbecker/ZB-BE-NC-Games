const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.checkCategory = (category) => {
  return db
    .query("select * from categories where slug = $1;", [category])
    .then(({ rowCount }) =>
      rowCount
        ? true
        : Promise.reject({ msg: "category not found", status: 404 })
    );
};
