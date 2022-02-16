const express = require("express");
const configs = express.Router();
const bodyParser = require("body-parser");
const GraphRecords = require("./records/GraphRecords.js");

const configsRecords = new GraphRecords("configs");

// Bodyparser
configs.use(bodyParser.json());

configs.get("/", async (req, res) => {
  //console.log(await configsRecords.getAll())
  try {
    result = await configsRecords.getAll();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = configs;
