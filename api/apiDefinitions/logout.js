const express = require("express");
const logout = express.Router();
const fs = require("fs");

const bodyParser = require("body-parser");
const Record = require("./records/UserRecord.js");

//Record instance
const userRecord = new Record("user");

//Bodyparser
logout.use(bodyParser.json());

//APIs

logout.get("/", async (req, res) => {
  // On client, also delete accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  //Is refreshToken in db?

  const foundUser = (await userRecord.getAll()).find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //delete refreshToken in db

  foundUser.refreshToken = "";
  foundUser.updated = Date();
  await fs.writeFileSync(
    `./db/users/${foundUser.id}.json`,
    JSON.stringify(foundUser, null, 2)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});

module.exports = logout;
