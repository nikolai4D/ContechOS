const express = require('express')
const propKey = express.Router()
const bodyParser = require('body-parser')
const Record = require('./records/Record.js')

//API type
const apiType = "propKey";

//Record instances
const propKeyRecord = new Record(apiType)
const propTypeRecord = new Record("propType")

// Bodyparser
propKey.use(bodyParser.json())

//APIs

propKey.post("/create", async (req, res) => {

  const { title, propTypeId } = req.body

  if (!title || !propTypeId) {
    return res.status(400).json("title and/or propTypeId missing")
  }
  const propTypeArray = await propTypeRecord.getAllId()
  if (!propTypeArray.includes(propTypeId)) {
    return res.status(400).json("propTypeId does not exist")
  } 
  
  try {
    result = await propKeyRecord.create({ title, propTypeId })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

propKey.get("/", async (req, res) => {
  try {
    result = await propKeyRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

propKey.get("/:id", async (req, res) => {

  let propKeyArray = await propKeyRecord.getAllId()
  if (!propKeyArray.includes(req.params.id)) {
    return res.status(400).json("propKeyId does not exist")
  }

  try {
    result = await propKeyRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = propKey