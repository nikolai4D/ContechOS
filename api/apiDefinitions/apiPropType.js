const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

const routerType = "propType";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs

router.post("/create", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json("title missing");
  }

  try {
    result = await record.create({ title });
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
  let propTypeArray = await record.getAllId();
  if (!propTypeArray.includes(req.params.id)) {
    return res.status(400).json("propTypeId does not exist");
  }

  try {
    result = await record.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
