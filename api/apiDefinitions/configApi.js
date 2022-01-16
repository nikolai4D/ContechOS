const express = require('express')
const config = express.Router()
const bodyParser = require('body-parser')
const configRecord = require('./records/ConfigRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
config.use(bodyParser.json())


config.post("/create", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json("title missing")
  }
  try {
    result = await configRecord.create(req.body.title)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = config