const express = require('express')
const props = express.Router()
const bodyParser = require('body-parser')
const propsRecords = require('./records/PropsRecords.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
props.use(bodyParser.json())

// props.get('/', (req, res) => {
//   res.json("Get and Post PROPS via /api");
// });

props.get("/", async (req, res) => {
  try {
    result = await propsRecords.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = props