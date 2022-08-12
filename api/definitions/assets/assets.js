
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

const fs = require("fs");

//Bodyparser
router.use(bodyParser.json());

//APIs

router.get("/", async (req, res) => {

  console.log("")

});


//APIs
router.post("/", upload.single('asset'), async (req, res) => {

  let routerType = "assets";
  let fileName = req.body.name ?? `file_${(new Date().toJSON())}`;


  //create

  fs.writeFileSync(
    `../db/${routerType}/${fileName}.json`,
    JSON.stringify(req.file)
  );

  try {

    console.log("file: " + JSON.stringify(req.file))
    return res.status(200)

  } catch (e) {

    console.log("error: " + e)
    return res.status(500)

  }


});



module.exports = router;
