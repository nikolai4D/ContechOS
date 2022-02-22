const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Record = require("./records/Record.js");

const routerType = "configObjInternalRel";
const routerParentType = "configDefInternalRel";
const routerPropKey = "propKey";
//Record instance
const record = new Record(routerType);
const parentRecord = new Record(routerParentType);
const propKeyRecord = new Record(routerPropKey);

//Bodyparser
router.use(bodyParser.json());

//APIs

//APIs
router.post("/create", async (req, res) => {
  const {
    title,
    props,
    source,
    target,
    parentId,
    typeDataRelPropKeys,
    instanceDataRelPropKeys,
  } = req.body;

  if (
    !title ||
    !props ||
    !parentId ||
    !source ||
    !target ||
    !typeDataRelPropKeys ||
    !instanceDataRelPropKeys
  ) {
    return res
      .status(400)
      .json(
        "something is missing: title, props, source, target, parentId, typeDataRelPropKeys, instanceDataRelPropKeys"
      );
  }

  //test parentID
  let recordParentArray = await parentRecord.getAllId();
  if (!recordParentArray.includes(parentId)) {
    return res.status(400).json("parentId does not exist");
  }

  //the rest of the tests

  try {
    result = await record.create({
      title,
      props,
      source,
      target,
      parentId,
      typeDataRelPropKeys,
      instanceDataRelPropKeys,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    result = await record.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  let recordArray = await record.getAllId();
  if (!recordArray.includes(req.params.id)) {
    return res.status(400).json("configId does not exist");
  }

  try {
    result = await record.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
