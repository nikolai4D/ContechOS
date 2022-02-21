const express = require("express");
const propVal = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

//API type
const apiType = "propVal";

//Record instances
const propValRecord = new Record(apiType);
const propKeyRecord = new Record("propKey");

// Bodyparser
propVal.use(bodyParser.json());

//APIs

propVal.post("/create", async (req, res) => {
  const { title, parentId } = req.body;

  if (!title || !parentId) {
    return res.status(400).json("title and/or parentId missing");
  }
  const propKeyArray = await propKeyRecord.getAllId();
  if (!propKeyArray.includes(parentId)) {
    return res.status(400).json("parentId does not exist");
  }

  try {
    result = await propValRecord.create({ title, parentId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

propVal.get("/", async (req, res) => {
  try {
    result = await propValRecord.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

propVal.get("/:id", async (req, res) => {
  let propValArray = await propValRecord.getAllId();
  if (!propValArray.includes(req.params.id)) {
    return res.status(400).json("propValId does not exist");
  }

  try {
    result = await propValRecord.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = propVal;
