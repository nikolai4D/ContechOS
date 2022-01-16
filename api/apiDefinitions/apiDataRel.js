const express = require('express')
const dataRel = express.Router()
const bodyParser = require('body-parser')
const Record = require('./records/Record.js');

//API type
const apiType = "dataRel";

//Record instances
const dataRelRecord = new Record(apiType);
const dataRecord = new Record("data");
const configRelRecord = new Record("configRel");

// Bodyparser
dataRel.use(bodyParser.json())


dataRel.post("/create", async (req, res) => {

  const { configRelId, source, target } = req.body

  //validate if input params exists
  if (!configRelId || !source || !target) {
    return res.status(400).json("configRelId, source and/or target missing")
  }
  //validate source not equal to target
  if (source === target) {
    return res.status(400).json("source and target can't be the same")
  }

  //validate configRelId exists
  const configRelArray = await configRelRecord.getAllId()
  if (!configRelArray.includes(configRelId)) {
    return res.status(400).json("configRelId does not exist")
  }
  const configRelTitle = (await configRelRecord.getById(configRelId)).title

  //validate source and target exists
  const dataArray = await dataRecord.getAllId()
  if (!dataArray.includes(source)) {
    return res.status(400).json("source does not exist")
  }
  if (!dataArray.includes(target)) {
    return res.status(400).json("target does not exist")
  }  

  //validate dataRels source and target are valid according to config and configRel
  const configSourceId = (await dataRecord.getById(source)).configId
  const configTargetId = (await dataRecord.getById(target)).configId
  const valiteConfigSourceId = configRelId.slice(40, -39)
  const valiteConfigTargetId = configRelId.slice(79)
  if (!(configSourceId === valiteConfigSourceId) || !(configTargetId === valiteConfigTargetId)) {
    return res.status(400).json("rel not allowed")
  }

  try {
    result = await dataRelRecord.create({ configRelId, source, target, "title": configRelTitle })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

dataRel.get("/", async (req, res) => {
  console.log(await dataRelRecord.getAll())
  try {
    result = await dataRelRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

dataRel.get("/:id", async (req, res) => {

  let dataArray = await dataRelRecord.getAllId()
  if (!dataArray.includes(req.params.id)) {
    return res.status(400).json("dataId does not exist")
  }

  try {
    result = await dataRelRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = dataRel