const express = require("express");
const verify = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");

//Bodyparser
verify.use(bodyParser.json());

//APIs

verify.get("/", async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    res.user = decoded.email;
    return res.sendStatus(200);
  });
});

module.exports = verify;
