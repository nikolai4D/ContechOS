const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cypherParse = require("./cypherParse");

// Bodyparser
router.use(bodyParser.text());

router.post("/", async (req, res) => {
    console.log("entered cypher router.")
    try {
        const query = req.body
        console.log("query: " + JSON.stringify(query))
        const data = cypherParse(query)
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;