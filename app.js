const express = require("express");

const { getCategories } = require("./controllers/categories-controllers");
const { errorHandler } = require("./controllers/error-handlers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use(errorHandler);

module.exports = app;
