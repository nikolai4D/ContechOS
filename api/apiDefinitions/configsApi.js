const express = require('express')
const configs = express.Router()
const bodyParser = require('body-parser')
const configsRecords = require('./records/ConfigsRecords.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
configs.use(bodyParser.json())

// configs.get('/', (req, res) => {
//   res.json("Get and Post CONFIGS via /api");
// });

configs.get("/", async (req, res) => {
  try {
    result = await configsRecords.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = configs