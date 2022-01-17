const express = require('express')
const props = express.Router()
const bodyParser = require('body-parser')
const GraphRecords = require('./records/GraphRecords.js')

const propsRecords = new GraphRecords("props");

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