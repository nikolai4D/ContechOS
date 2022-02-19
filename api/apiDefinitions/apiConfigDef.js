const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

const routerType = "configDef";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  const { title, propKeys } = req.body;

  if (!title || !propKeys) {
    return res.status(400).json("title and/or propKeys missing");
  }

  try {
    result = await record.create({ title, propKeys });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    result = await record.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  let configArray = await record.getAllId();
  if (!configArray.includes(req.params.id)) {
    return res.status(400).json("configId does not exist");
  }

  try {
    result = await record.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
