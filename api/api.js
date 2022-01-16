const express = require('express')
const api = express.Router()
const bodyParser = require('body-parser')

// Env vars
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY

// Bodyparser
api.use(bodyParser.json())

// Example get request

api.get('/', (req, res) => {
    res.json("Get and Post data via /api");
  });

//----------props----------//

//propType
api.use('/propType', require('./apiDefinitions/propTypeApi.js'))

//propKey
api.use('/propKey', require('./apiDefinitions/propKeyApi.js'))

//propVal
api.use('/propVal', require('./apiDefinitions/propValApi.js'))

//props >>> gets propTypes and propKeys as nodes and rels
api.use('/props', require('./apiDefinitions/propsApi.js'))

//----------config----------//
//config
api.use('/config', require('./apiDefinitions/configApi.js'))

//configRel
api.use('/configRel', require('./apiDefinitions/configRelApi.js'))

//configs >>> gets config and configRel as nodes and rels
api.use('/configs', require('./apiDefinitions/configsApi.js'))

//----------data----------//
//data
api.use('/data', require('./apiDefinitions/dataApi.js'))

//dataRel
api.use('/dataRel', require('./apiDefinitions/dataRelApi.js'))

//datas >>> gets data and dataRel as nodes and rels
api.use('/datas', require('./apiDefinitions/datasApi.js'))




module.exports = api