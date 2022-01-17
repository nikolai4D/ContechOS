const express = require('express')
const datas = express.Router()
const bodyParser = require('body-parser')
const GraphRecords = require('./records/GraphRecords.js')

const datasRecords = new GraphRecords("datas");

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