const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const Record = require("./records/UserRecord.js");

const routerType = "users";
//Record instance
const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs

router.post("/", async (req, res) => {
  const { email, pwd, code } = req.body;

  if (!email || !pwd || !code) {
    return res.status(400).json("something is missing: email, pwd, code");
  }

  const duplicate = (await record.getAll()).find(
    (person) => person.email === email
  );
  if (duplicate) return res.sendStatus(409); //Conflict

  const validCode = (await record.getRegisterCode()).includes(code);
  if (!validCode) return res.sendStatus(409); //Conflict

  const hashedPwd = await bcrypt.hash(pwd, 10);

  try {
    result = await record.create({ email, hashedPwd });
    res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
