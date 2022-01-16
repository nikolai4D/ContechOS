const express = require('express')
const dataRel = express.Router()
const bodyParser = require('body-parser')
const dataRelRecord = require('./records/DataRelRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
dataRel.use(bodyParser.json())


dataRel.post("/create", async (req, res) => {
  if (!req.body.title || !req.body.configRelId || !req.body.source || !req.body.target) {
    return res.status(400).json("title, configRelId, source and/or target missing")
  }
  try {
    result = await dataRelRecord.create(req.body.title, req.body.configRelId, req.body.source, req.body.target)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = dataRel