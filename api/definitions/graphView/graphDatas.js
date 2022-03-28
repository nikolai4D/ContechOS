const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const GraphRecords = require("../../records/GraphRecords.js");

const routerType = "datas";
//Record instance
const record = new GraphRecords(routerType);

// Bodyparser
router.use(bodyParser.json());
router.get("/", async (req, res) => {
  try {
    result = await record.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
