const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

const routerType = "propKey";
//Record instances
const record = new Record(routerType);
const propTypeRecord = new Record("propType");

// Bodyparser
router.use(bodyParser.json());

//APIs

router.post("/create", async (req, res) => {
  const { title, parentId } = req.body;

  if (!title || !parentId) {
    return res.status(400).json("title and/or parentId missing");
  }
  const propTypeArray = await propTypeRecord.getAllId();
  if (!propTypeArray.includes(parentId)) {
    return res.status(400).json("parentId does not exist");
  }

  try {
    result = await record.create({ title, parentId });
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
  let propKeyArray = await record.getAllId();
  if (!propKeyArray.includes(req.params.id)) {
    return res.status(400).json("propKeyId does not exist");
  }

  try {
    result = await record.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
