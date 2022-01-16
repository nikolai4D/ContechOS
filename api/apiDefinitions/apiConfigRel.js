const express = require('express')
const configRel = express.Router()
const bodyParser = require('body-parser')
const Record = require('./records/Record.js');

//API type
const apiType = "configRel";

//Record instances
const configRelRecord = new Record(apiType)
const configRecord = new Record("config")

// Bodyparser
configRel.use(bodyParser.json())


configRel.post("/create", async (req, res) => {

  const { title, source, target } = req.body

  if (!title || !source || !target) {
    return res.status(400).json("title, source and/or target missing")
  }
  if (source === target) {
    return res.status(400).json("source and target can't be the same")
  }

  const configArray = await configRecord.getAllId()
  if (!configArray.includes(source)) {
    return res.status(400).json("source does not exist")
  }
  if (!configArray.includes(target)) {
    return res.status(400).json("target does not exist")
  }  

  try {
    result = await configRelRecord.create({ title, source, target })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

configRel.get("/", async (req, res) => {
  console.log(await configRelRecord.getAll())
  try {
    result = await configRelRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

configRel.get("/:id", async (req, res) => {

  let configArray = await configRelRecord.getAllId()
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configId does not exist")
  }

  try {
    result = await configRelRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = configRel