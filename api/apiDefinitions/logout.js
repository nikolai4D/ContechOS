const express = require("express");
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
const Record = require("./records/record.js");

const routerType = "user";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs

router.get("/", async (req, res) => {
  // On client, also delete accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  //Is refreshToken in db?

  const foundUser = (await record.getAll()).find(
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
    `../db/users/${foundUser.id}.json`,
    JSON.stringify(foundUser, null, 2)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});

module.exports = router;
