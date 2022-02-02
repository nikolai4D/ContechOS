const express = require("express");
const auth = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const Record = require("./records/UserRecord.js");

//Record instance
const userRecord = new Record("user");

//Bodyparser
auth.use(bodyParser.json());

//APIs

auth.post("/", async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res.status(400).json({ message: "email and/or pwd missing." });

  const foundUser = (await userRecord.getAll()).find(
    (person) => person.email === email
  );
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.hashedPwd);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "900s" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    foundUser.updated = Date();
    await fs.writeFileSync(
      `../db/users/${foundUser.id}.json`,
      JSON.stringify(foundUser, null, 2)
    );

    //res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
});

module.exports = auth;
