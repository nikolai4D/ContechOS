const express = require("express");
const configDefInternalRel = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

//API type
const apiType = "configDefInternalRel";

//Record instances
const configDefInternalRelRecord = new Record(apiType);
const configDefRecord = new Record("configDef");
const propKeyRecord = new Record("propKey");

// Bodyparser
configDefInternalRel.use(bodyParser.json());

configDefInternalRel.post("/create", async (req, res) => {
  const { title, source, propKeys } = req.body;

  if (!title || !source || !propKeys) {
    return res.status(400).json("title, source and/or propKeys missing");
  }

  //check if source exists
  const configArray = await configDefRecord.getAllId();
  if (!configArray.includes(source)) {
    return res.status(400).json("source does not exist");
  }

  //check if propKeys exists
  const propKeyArray = await propKeyRecord.getAllId();
  propKeys.forEach((sentPropKey) => {
    if (!propKeyArray.includes(sentPropKey)) {
      return res.status(400).json(`${sentPropKey} propKey does not exist`);
    }
  });

  try {
    result = await configDefInternalRelRecord.create({ title, source });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDefInternalRel.get("/", async (req, res) => {
  console.log(await configDefInternalRelRecord.getAll());
  try {
    result = await configDefInternalRelRecord.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDefInternalRel.get("/:id", async (req, res) => {
  let configArray = await configDefInternalRelRecord.getAllId();
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configDefInternalId does not exist");
  }

  try {
    result = await configDefInternalRelRecord.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = configDefInternalRel;
