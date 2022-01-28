const express = require("express");
const refresh = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");
const Record = require("./records/UserRecord.js");

//Record instance
const userRecord = new Record("user");

//Bodyparser
refresh.use(bodyParser.json());

//APIs
refresh.get("/", async (req, res) => {
  console.log("REFRESH ACCESS TOKEN");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = (await userRecord.getAll()).find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );
    console.log("refresh.js", "900s");

    return res.status(200).json({ accessToken });
  });
});

module.exports = refresh;
