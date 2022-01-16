const express = require('express');
const config = express.Router();
const bodyParser = require('body-parser');
const Record = require('./records/Record.js');

//Record instance
const configRecord = new Record("config");

//Bodyparser
config.use(bodyParser.json())

//APIs

config.post("/create", async (req, res) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json("title missing")
  }

  try {
    result = await configRecord.create({ title })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

config.get("/", async (req, res) => {
  console.log(await configRecord.getAll())
  try {
    result = await configRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

config.get("/:id", async (req, res) => {

  let configArray = await configRecord.getAllId()
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configId does not exist")
  }

  try {
    result = await configRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = config