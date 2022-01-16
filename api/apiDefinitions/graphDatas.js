const express = require('express')
const datas = express.Router()
const bodyParser = require('body-parser')
const datasRecords = require('./records/DatasRecords.js')


// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
datas.use(bodyParser.json())

// datas.get('/', (req, res) => {
//   res.json("Get and Post DATAS via /api");
// });

datas.get("/", async (req, res) => {
  try {
    result = await datasRecords.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = datas