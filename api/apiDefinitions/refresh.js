const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");
const Record = require("./records/UserRecord.js");

const routerType = "users";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs
router.get("/", async (req, res) => {
  const cookies = req.cookies;

  //   if (!cookies?.jwt) return res.sendStatus(401);
  if (!cookies?.jwt) return res.status(401).json({ accessToken: false });
  const refreshToken = cookies.jwt;
  const foundUser = (await record.getAll()).find(
    (person) => person.refreshToken === refreshToken
  );
  //   if (!foundUser) return res.sendStatus(403); //Forbidden
  if (!foundUser) return res.status(403).json({ accessToken: false }); //Forbidden
  // evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );
    return res.status(200).json({ accessToken });
  });
});

module.exports = router;
