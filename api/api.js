const express = require('express')
const api = express.Router()

// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Example get request

api.get('/', (req, res) => {
    res.json("Get and Post data via /api");
  });


module.exports = api