const express = require('express')
const props = express.Router()
const bodyParser = require('body-parser')
const propsRecords = require('./PropsRecords.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
props.use(bodyParser.json())

props.get('/', (req, res) => {
  res.json("Get and Post PROPS via /api");
});

props.get("/getAll", async (req, res) => {
  try {
    data = await propsRecords.getAll()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = props