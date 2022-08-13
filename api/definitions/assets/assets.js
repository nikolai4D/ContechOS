
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })
let routerType = "assets";

const fs = require("fs");

//Bodyparser
router.use(bodyParser.json());

//APIs

router.delete("/:id", async (req, res) => {
  let id = req.params.id
  const dir = `../db/${routerType}/`;
  const file = id + ".json";
  fs.unlinkSync(dir + file);

  return res.status(200).json({ message: `removed: ${id}` })

});




router.post("/getByName", async (req, res) => {

  let fileName = req.body.name;
  console.log(fileName, "name")



  let content = fs.readFileSync(`../db/${routerType}/${fileName}.json`, "utf8");

  var decodedImage = new Buffer(content, 'base64');

  return res.status(200).json(decodedImage)

});


//APIs
router.post("/", upload.single('asset'), async (req, res) => {


  let image = req.file.buffer.toString('base64')

  let fileName = req.body.name ?? `file_${(new Date().toJSON())}`;


  //create

  fs.writeFileSync(
    `../db/${routerType}/${fileName}.json`,
    JSON.stringify(image)
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
