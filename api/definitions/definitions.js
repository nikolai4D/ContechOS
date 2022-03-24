const fs = require("fs");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const definitionsJSON = JSON.parse(
  fs.readFileSync("./api/definitions/definitions.json", "utf8")
);

// Bodyparser
router.use(bodyParser.json());

router.get("/", async (req, res) => {
  try {
    res.status(200).json(definitionsJSON);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
