const express = require("express");
const configDef = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

//Record instance
const configDefRecord = new Record("configDef");

//Bodyparser
configDef.use(bodyParser.json());

//APIs

configDef.post("/create", async (req, res) => {
  const { title, propKeys } = req.body;

  if (!title || !propKeys) {
    return res.status(400).json("title and/or propKeys missing");
  }

  try {
    result = await configDefRecord.create({ title, propKeys });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDef.get("/", async (req, res) => {
  console.log(await configDefRecord.getAll());
  try {
    result = await configDefRecord.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDef.get("/:id", async (req, res) => {
  let configArray = await configDefRecord.getAllId();
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configId does not exist");
  }

  try {
    result = await configDefRecord.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = configDef;
