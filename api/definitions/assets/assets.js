
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("../../records/Record.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })
const routerType = "instanceData";
const helpers = require("../helpers/helpers.js");
const { localCreate } = require("../helpers/create.js");

const fs = require("fs");

//Bodyparser
router.use(bodyParser.json());

//APIs

router.get("/", async (req, res) => {

  console.log("")

});


//APIs
router.post("/",  upload.single('answer_picture'),async (req, res) => {

  // create instanceData

  const { parentId } = req.body;
  const props = JSON.parse(req.body.props)
  const title  = req.file.originalname;
  const reqBody = { title, props, parentId };

  let routerType = "instanceData";

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if parentId exists
  if (!(await helpers.parentIdExist(routerType, parentId, res))) {
    return res.statusCode;
  }

  //check if props exists
  if (!(await helpers.propsExists(parentId, routerType, props, res))) {
    return res.statusCode;
  }

  //Record instance
  const record = new Record(routerType);

  let response = await localCreate(record, reqBody);

  routerType = "assets";

  //create

  let filename = `as${response.id.substring(2)}`

  fs.writeFileSync(
    `../db/${routerType}/${filename}.json`,
    JSON.stringify(req.file)
  );


  try{
    // console.log("file: " + JSON.stringify(req.file))
  } catch (e) {
    // console.log("error: " + e)
  }



});



module.exports = router;
