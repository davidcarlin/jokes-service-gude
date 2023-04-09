const express = require("express");
const app = express();
const { Op } = require("sequelize");
const { sequelize, Joke } = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  try {
    const { tags, content } = req.query;
    let where = {};

    if (tags) {
      where.tags = {
        [Op.like]: `%${tags}%`,
      };
    }
    if (content) {
      where.joke = {
        [Op.like]: `%${content}%`,
      };
    }

    const jokes = await Joke.findAll({ where });
    res.json(jokes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = app;
