const express = require('express');
const user = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const Record = require('./records/UserRecord.js');


//Record instance
const userRecord = new Record("user");

//Bodyparser
user.use(bodyParser.json())

//APIs

user.post("/create", async (req, res) => {
  const { email, pwd } = req.body

  if (!email || !pwd) {
    return res.status(400).json("email and/or pwd missing")
  }

  const duplicate = (await userRecord.getAll()).find(person => person.email === email);
  if (duplicate) return res.sendStatus(409); //Conflict 

  const hashedPwd = await bcrypt.hash(pwd, 10);

  try {
    result = await userRecord.create({ email, hashedPwd })
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

user.get("/", async (req, res) => {
  console.log(await userRecord.getAll())
  try {
    result = await userRecord.getAll()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

user.get("/:id", async (req, res) => {

  let userArray = await userRecord.getAllId()
  if (!userArray.includes(req.params.id)) {
    return res.status(400).json("userId does not exist")
  }

  try {
    result = await userRecord.getById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = user