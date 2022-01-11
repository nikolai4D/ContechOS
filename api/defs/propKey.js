const express = require('express')
const propKey = express.Router()
const bodyParser = require('body-parser')
const propKeyRecord = require('./PropKeyRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
propKey.use(bodyParser.json())


propKey.post("/create", async (req, res) => {
  try {
    data = await propKeyRecord.create(req.body.title, req.body.propType)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = propKey