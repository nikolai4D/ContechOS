const express = require('express')
const configRel = express.Router()
const bodyParser = require('body-parser')
const configRelRecord = require('./records/ConfigRelRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
configRel.use(bodyParser.json())


configRel.post("/create", async (req, res) => {
  if (!req.body.title || !req.body.source || !req.body.target) {
    return res.status(400).json("title, source and/or target missing")
  }
  try {
    result = await configRelRecord.create(req.body.title, req.body.source, req.body.target)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = configRel