const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const helpers = require("../helpers/helpers.js");

const routerType = "instanceData";

//Bodyparser
router.use(bodyParser.json());

//APIs

//CREATE
router.post("/create", async (req, res) => {
  const { title, props, parentId } = req.body;
  const reqBody = { title, props, parentId };
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

  //create
  await helpers.create(routerType, reqBody, res);
});

//READ

router.get("/", async (req, res) => {
  //check if request includes query param parentId
  if (await helpers.reqQueryExists(req.query, "parentId")) {
    //check if parentId exists
    if (!(await helpers.parentIdExist(routerType, req.query.parentId, res))) {
      return res.statusCode;
    }
    //read by parentId
    return await helpers.readByParentId(routerType, req.query.parentId, res);
  }

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

router.post("/linkToTarget", async (req, res) => {
  const { linkParentId, targetId } = req.body;
  const reqBody = { linkParentId, targetId };

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  if (!(await helpers.idExist(routerType, targetId, res))) {
    return res.statusCode;
  }

  return await helpers.readByLinkToTarget(
    routerType,
    linkParentId,
    targetId,
    res
  );
});

router.post("/sourcesToTarget", async (req, res) => {
  const { targetId } = req.body;
  const reqBody = { targetId };

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }
  if (!(await helpers.idExist(routerType, targetId, res))) {
    return res.statusCode;
  }

  return await helpers.readSourcesToTarget(routerType, targetId, res);
});

//UPDATE

router.put("/update", async (req, res) => {
  const { title, props, parentId, id } = req.body;
  const reqBody = { title, props, parentId, id };
  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if parentId exists
  if (!(await helpers.parentIdExist(routerType, parentId, res))) {
    return res.statusCode;
  }

  //check if id exists
  if (!(await helpers.idExist(routerType, id, res))) {
    return res.statusCode;
  }

  //check if props exists
  if (!(await helpers.propsExists(parentId, routerType, props, res))) {
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
