const express = require('express')
const data = express.Router()
const bodyParser = require('body-parser')
const dataRecord = require('./records/DataRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
data.use(bodyParser.json())


data.post("/create", async (req, res) => {
  if (!req.body.title || !req.body.configId) {
    return res.status(400).json("title and/or configId missing")
  }
  try {
    result = await dataRecord.create(req.body.title, req.body.configId)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = data