const fs = require("fs");
const express = require("express");
const definitions = express.Router();
const bodyParser = require("body-parser");

const definitionsJSON = JSON.parse(
  fs.readFileSync("./api/apiDefinitions/definitions.json", "utf8")
);

// Bodyparser
definitions.use(bodyParser.json());

definitions.get("/", async (req, res) => {
  try {
    res.status(200).json(definitionsJSON.nodeDefs);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = definitions;
