const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const create = require("./apiFunctions/create.js");
const readAll = require("./apiFunctions/readAll.js");
const reqQueryExists = require("./apiFunctions/reqQueryExists.js");
const reqParamExists = require("./apiFunctions/reqParamExists.js");
const readById = require("./apiFunctions/readById.js");
const reqBodyExists = require("./apiFunctions/reqBodyExists.js");
const propKeysExists = require("./apiFunctions/propKeysExists.js");
const isTarget = require("./apiFunctions/isTarget.js");
const isParent = require("./apiFunctions/isParent.js");
const idExist = require("./apiFunctions/idExist.js");
const isNotEqual = require("./apiFunctions/isNotEqual.js");
const remove = require("./apiFunctions/remove.js");

//const Record = require("./records/Record.js");

const routerType = "configDefExternalRel";
const routerTypeSource = "configDef";
const routerTypeTarget = routerTypeSource;
//Record instances
//const record = new Record(routerType);
// const configDefRecord = new Record("configDef");
// const propKeyRecord = new Record("propKey");

// Bodyparser
router.use(bodyParser.json());

router.post("/create", async (req, res) => {
  const { title, source, target, propKeys } = req.body;
  const reqBody = { title, source, target, propKeys };

  //check if keys/values exist in reqBody
  if (!(await reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  //check if provided propKeys exist
  if (!(await propKeysExists(propKeys, res))) {
    return res.statusCode;
  }
  //check if source exists
  if (!(await idExist(routerTypeSource, source, res))) {
    return res.statusCode;
  }
  //check if target exists
  if (!(await idExist(routerTypeTarget, target, res))) {
    return res.statusCode;
  }
  //check that source and target is not equal
  if (!(await isNotEqual(source, target, res))) {
    return res.statusCode;
  }

  //create
  await create(routerType, reqBody, res);
});

router.get("/", async (req, res) => {
  //check if request includes query param id
  if (!(await reqQueryExists(req.query, "id"))) {
    //no id -> read all
    return await readAll(routerType, res);
  }
  //check if included id exists
  if (!(await idExist(routerType, req.query.id, res))) {
    return res.statusCode;
  }
  //read included id
  await readById(routerType, req.query.id, res);
});

router.delete("/:id", async (req, res) => {
  if (!(await idExist(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await isParent(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  await remove(routerType, req.params.id, res);
});

module.exports = router;
