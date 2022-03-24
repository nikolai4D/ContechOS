const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("../../records/Record.js");

const routerType = "asset";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs

router.get("/", async (req, res) => {
  try {
    // result = await record.getAll();
    res.status(200).json(routerType);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
