const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const {
  create,
  createBulk,
  createBulkRel,
  idExist,
  ifIsSourceThenDeleteRels,
  isNotEqual,
  isParent,
  isParentIdValid,
  isTarget,
  parentIdExist,
  propKeysExist,
  propsExists,
  readAll,
  readById,
  readByLinkToTarget,
  readByParentId,
  readSourcesToTarget,
  remove,
  reqBodyExists,
  reqParamExists,
  reqQueryExists,
} = require("../helpers/helpers.js");

const routerType = "configObj";

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  const {
    title,
    props,
    parentId,
    typeDataPropKeys,
    instanceDataPropKeys,
  } = req.body;
  const reqBody = {
    title,
    props,
    parentId,
    typeDataPropKeys,
    instanceDataPropKeys,
  };
  //check if keys/values exist in reqBody
  if (!(await reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  //check if provided typeDataPropKeys exist
  if (!(await propKeysExists(typeDataPropKeys, res))) {
    return res.statusCode;
  }

  //check if provided instanceDataPropKeys exist
  if (!(await propKeysExists(instanceDataPropKeys, res))) {
    return res.statusCode;
  }

  //check if parentId exists
  if (!(await parentIdExist(routerType, parentId, res))) {
    return res.statusCode;
  }

  //check if props exists
  if (!(await propsExists(parentId, routerType, props, res))) {
    return res.statusCode;
  }

  //create
  await create(routerType, reqBody, res);
});

router.get("/", async (req, res) => {
  //check if request includes query param parentId
  if (await reqQueryExists(req.query, "parentId")) {
    //check if parentId exists
    if (!(await parentIdExist(routerType, req.query.parentId, res))) {
      return res.statusCode;
    }
    //read by parentId
    return await readByParentId(routerType, req.query.parentId, res);
  }

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

router.post("/linkToTarget", async (req, res) => {
  const { linkParentId, targetId } = req.body;
  const reqBody = { linkParentId, targetId };

  //check if keys/values exist in reqBody
  if (!(await reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  if (!(await idExist(routerType, targetId, res))) {
    return res.statusCode;
  }

  return await readByLinkToTarget(routerType, linkParentId, targetId, res);
});

router.post("/sourcesToTarget", async (req, res) => {
  const { targetId } = req.body;
  const reqBody = { targetId };

  //check if keys/values exist in reqBody
  if (!(await reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  if (!(await idExist(routerType, targetId, res))) {
    return res.statusCode;
  }

  return await readSourcesToTarget(routerType, targetId, res);
});

router.delete("/:id", async (req, res) => {
  if (!(await idExist(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await isTarget(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await isParent(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (await ifIsSourceThenDeleteRels(routerType, req.params.id, res)) {
    console.log("deleted related rels");
  }

  await remove(routerType, req.params.id, res);
});

module.exports = router;
