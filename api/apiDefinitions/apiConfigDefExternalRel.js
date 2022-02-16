const express = require("express");
const configDefExternalRel = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

//API type
const apiType = "configDefExternalRel";

//Record instances
const configDefExternalRelRecord = new Record(apiType);
const configDefRecord = new Record("configDef");
const propKeyRecord = new Record("propKey");

// Bodyparser
configDefExternalRel.use(bodyParser.json());

configDefExternalRel.post("/create", async (req, res) => {
  const { title, source, target, propKeys } = req.body;

  if (!title || !source || !target || !propKeys) {
    return res
      .status(400)
      .json("title, source, target and/or propKeys missing");
  }
  if (source === target) {
    return res.status(400).json("source and target can't be the same");
  }

  //check if source and target exists
  const configArray = await configDefRecord.getAllId();
  if (!configArray.includes(source)) {
    return res.status(400).json("source does not exist");
  }
  if (!configArray.includes(target)) {
    return res.status(400).json("target does not exist");
  }

  //check if propKeys exists
  const propKeyArray = await propKeyRecord.getAllId();
  propKeys.forEach((sentPropKey) => {
    if (!propKeyArray.includes(sentPropKey)) {
      return res.status(400).json(`${sentPropKey} propKey does not exist`);
    }
  });

  try {
    result = await configDefExternalRelRecord.create({
      title,
      source,
      target,
      propKeys,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDefExternalRel.get("/", async (req, res) => {
  console.log(await configDefExternalRelRecord.getAll());
  try {
    result = await configDefExternalRelRecord.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

configDefExternalRel.get("/:id", async (req, res) => {
  let configArray = await configDefExternalRelRecord.getAllId();
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configDefExpernalId does not exist");
  }

  try {
    result = await configDefExternalRelRecord.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = configDefExternalRel;
