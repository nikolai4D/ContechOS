const express = require('express')
const propType = express.Router()
const bodyParser = require('body-parser')
const propTypeRecord = require('./PropTypeRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
propType.use(bodyParser.json())


propType.post("/create", async (req, res) => {
  try {
    data = await propTypeRecord.create(req.body.title)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = propType