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

// POST route to add a new joke to the database
app.post("/jokes", async (req, res, next) => {
  try {
    const { joke, tags } = req.body;
    const newJoke = await Joke.create({ joke, tags });
    res.status(201).json(newJoke);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE route to remove a joke from the database by ID
app.delete("/jokes/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const joke = await Joke.findByPk(id);
    if (!joke) {
      const error = new Error("Joke not found");
      error.status = 404;
      throw error;
    }
    await joke.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PUT route to edit a joke in the database by ID
app.put("/jokes/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { joke, tags } = req.body;
    const foundJoke = await Joke.findByPk(id);
    if (!foundJoke) {
      const error = new Error("Joke not found");
      error.status = 404;
      throw error;
    }
    const updatedJoke = await foundJoke.update({ joke, tags });
    res.json(updatedJoke);
  } catch (error) {
    console.error(error);
    next(error);
  }
});~

module.exports = app;

