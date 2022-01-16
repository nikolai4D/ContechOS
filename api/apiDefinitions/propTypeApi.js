const express = require('express')
const propType = express.Router()
const bodyParser = require('body-parser')
const Record = require('./records/Record.js')

propTypeRecord = new Record("propType")


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
propType.use(bodyParser.json())


propType.post("/create", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json("title missing")
  }
  console.log(await propTypeRecord.create(req.body.title))
  try {
    result = await propTypeRecord.create(req.body.title)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

propType.get("/", async (req, res) => {
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