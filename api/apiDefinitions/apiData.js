const express = require("express");
const data = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

//API type
const apiType = "data";

//Record instances
const dataRecord = new Record(apiType);
const configRecord = new Record("config");

// Bodyparser
data.use(bodyParser.json());

//APIs

data.post("/create", async (req, res) => {
  const { title, configId } = req.body;

  if (!title || !configId) {
    return res.status(400).json("title and/or configId missing");
  }
  const configArray = await configRecord.getAllId();
  if (!configArray.includes(configId)) {
    return res.status(400).json("configId does not exist");
  }

  try {
    result = await dataRecord.create({ title, configId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// data.get("/:id", async (req, res) => {
//   let dataArray = await dataRecord.getAllId();
//   if (!dataArray.includes(req.params.id)) {
//     return res.status(400).json("dataId does not exist");
//   }

//   try {
//     result = await dataRecord.getById(req.params.id);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

// data.post("/:configId", async (req, res) => {
//   let configArray = await configRecord.getAllId();
//   if (!configArray.includes(req.params.configId)) {
//     return res.status(400).json("configId does not exist");
//   }

//   try {
//     result = await dataRecord.getByProp("configId", req.params.configId);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

data.get("/", async (req, res) => {
  const id = req.query.id;
  const configId = req.query.configId;

  if (id || configId) {
    if (id) {
      let dataArray = await dataRecord.getAllId();
      if (!dataArray.includes(id)) {
        return res.status(400).json("dataId does not exist");
      }

      try {
        result = await dataRecord.getById(id);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
    }

    if (configId) {
      let configArray = await configRecord.getAllId();
      if (!configArray.includes(configId)) {
        return res.status(400).json("configId does not exist");
      }

      try {
        result = await dataRecord.getByProp("configId", configId);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  } else {
    try {
      result = await dataRecord.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
});

module.exports = data;
