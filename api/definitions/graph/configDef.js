const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const helpers = require("../helpers/helpers.js");
const routerType = "configDef";

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  const { title, propKeys } = req.body;
  const reqBody = { title, propKeys };
  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  //check if provided propKeys exist
  if (!(await helpers.propKeysExists(propKeys, res))) {
    return res.statusCode;
  }
  //create
  await helpers.create(routerType, reqBody, res);
});

router.get("/", async (req, res) => {
  //check if request includes query param id
  if (!(await helpers.reqQueryExists(req.query, "id"))) {
    //no id -> read all
    return await helpers.readAll(routerType, res);
  }
  //check if included id exists
  if (!(await helpers.idExist(routerType, req.query.id, res))) {
    return res.statusCode;
  }
  //read included id
  await helpers.readById(routerType, req.query.id, res);
});

//UPDATE

router.put("/update", async (req, res) => {
  const { title, propKeys, id } = req.body;
  const reqBody = { title, propKeys, id };
  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  //check if provided propKeys exist
  if (!(await helpers.propKeysExists(propKeys, res))) {
    return res.statusCode;
  }

  //check if provided id exist
  if (!(await helpers.idExist(routerType, id, res))) {
    return res.statusCode;
  }
  //update
  await helpers.update(routerType, reqBody, res);
});

//DELETE

router.delete("/:id", async (req, res) => {
  if (!(await helpers.idExist(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await helpers.isTarget(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await helpers.isParent(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (await helpers.ifIsSourceThenDeleteRels(routerType, req.params.id, res)) {
    console.log("deleted related rels");
  }

  await helpers.remove(routerType, req.params.id, res);
});

module.exports = router;
