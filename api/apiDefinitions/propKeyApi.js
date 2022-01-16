const express = require('express')
const propKey = express.Router()
const bodyParser = require('body-parser')
const propKeyRecord = require('./records/PropKeyRecord.js')
const propTypeRecord = require('./records/PropTypeRecord.js').getAllId()


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
propKey.use(bodyParser.json())


propKey.post("/create", async (req, res) => {

  if (!req.body.title || !req.body.propTypeId) {
    return res.status(400).json("title and/or propTypeId missing")
  }
  
  let propTypeArray = await propTypeRecord

  if (!propTypeArray.includes(req.body.propTypeId)) {
    return res.status(400).json("propTypeId does not exist")
  } 

  try {
    result = await propKeyRecord.create(req.body.title, req.body.propTypeId)
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

module.exports = propKey