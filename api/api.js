const express = require('express')
const api = express.Router()
const bodyParser = require('body-parser')

//const propType = require('./defs/propType.js')
const propKey = require('./defs/propKey.js')

// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
api.use(bodyParser.json())

// Example get request

api.get('/', (req, res) => {
    res.json("Get and Post data via /api");
  });


//propType
api.use('/propType', require('./defs/propType.js'))

//propKey
api.use('/propKey', require('./defs/propKey.js'))

//props
api.use('/props', require('./defs/props.js'))





module.exports = api