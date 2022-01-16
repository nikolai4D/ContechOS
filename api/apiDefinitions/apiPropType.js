const express = require('express');
const propType = express.Router();
const bodyParser = require('body-parser');
const Record = require('./records/Record.js');

//Record instance
const propTypeRecord = new Record("propType");

//Bodyparser
propType.use(bodyParser.json())

//APIs

propType.post("/create", async (req, res) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json("title missing")
  }

  try {
    result = await propTypeRecord.create({ title })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

propType.get("/", async (req, res) => {
  console.log(await propTypeRecord.getAll())
  try {
    result = await propTypeRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

propType.get("/:id", async (req, res) => {

  let propTypeArray = await propTypeRecord.getAllId()
  if (!propTypeArray.includes(req.params.id)) {
    return res.status(400).json("propTypeId does not exist")
  }

  try {
    result = await propTypeRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = propType