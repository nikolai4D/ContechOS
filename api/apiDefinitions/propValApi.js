const express = require('express')
const propVal = express.Router()
const bodyParser = require('body-parser')
const propValRecord = require('./records/PropValRecord.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
propVal.use(bodyParser.json())


propVal.post("/create", async (req, res) => {
  if (!req.body.title || !req.body.propKeyId) {
    return res.status(400).json("title and/or propTypeId missing")
  }

  
  try {
    result = await propValRecord.create(req.body.title, req.body.propKeyId)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = propVal