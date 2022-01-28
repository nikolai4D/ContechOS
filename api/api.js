const express = require('express')
const api = express.Router()
const bodyParser = require('body-parser')


// Bodyparser
api.use(bodyParser.json())


//----------users----------//
api.use('/user', require('./apiDefinitions/user.js'))


//----------auth----------//
api.use('/auth', require('./apiDefinitions/auth.js'))
api.use('/verify', require('./apiDefinitions/verify.js'))
api.use('/refresh', require('./apiDefinitions/refresh.js'))
api.use('/logout', require('./apiDefinitions/logout.js'))


//----------props----------//

//propType 
api.use('/propType', require('./apiDefinitions/apiPropType.js'))

//propKey
api.use('/propKey', require('./apiDefinitions/apiPropKey.js'))

//propVal
api.use('/propVal', require('./apiDefinitions/apiPropVal.js'))

//props >>> gets propTypes and propKeys as nodes and rels
api.use('/props', require('./apiDefinitions/graphProps.js'))

//----------config----------//
//config
api.use('/config', require('./apiDefinitions/apiConfig.js'))

//configRel
api.use('/configRel', require('./apiDefinitions/apiConfigRel.js'))

//configs >>> gets config and configRel as nodes and rels
api.use('/configs', require('./apiDefinitions/graphConfigs.js'))

//----------data----------//
//data
api.use('/data', require('./apiDefinitions/apiData.js'))

//dataRel
api.use('/dataRel', require('./apiDefinitions/apiDataRel.js'))

//datas >>> gets data and dataRel as nodes and rels
api.use('/datas', require('./apiDefinitions/graphDatas.js'))




module.exports = api