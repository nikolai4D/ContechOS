const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const helpers = require("../helpers/helpers.js");

const routerType = "instanceDataExternalRel";
const routerTypeSource = "instanceData";
const routerTypeTarget = routerTypeSource;

// Bodyparser
router.use(bodyParser.json());

router.post("/create", async (req, res) => {
  const { title, props, source, target, parentId } = req.body;
  const reqBody = { title, props, source, target, parentId };

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if props exists
  if (!(await helpers.propsExists(parentId, routerType, props, res))) {
    return res.statusCode;
  }

  //check if source exists
  if (!(await helpers.idExist(routerTypeSource, source, res))) {
    return res.statusCode;
  }
  //check if target exists
  if (!(await helpers.idExist(routerTypeTarget, target, res))) {
    return res.statusCode;
  }
  //check that source and target is not equal
  if (!(await helpers.isNotEqual(source, target, res))) {
    return res.statusCode;
  }

  //check if parentId exists
  if (!(await helpers.parentIdExist(routerType, parentId, res))) {
    return res.statusCode;
  }

  //check if valid parentId
  if (
    !(await helpers.isParentIdValid(routerType, parentId, source, target, res))
  ) {
    return res.statusCode;
  }
  //create
  await helpers.create(routerType, reqBody, res);
});

router.post("/readRelBySourceAndTarget", async (req, res) => {
  const { sourceId, targetId } = req.body;
  const reqBody = { sourceId, targetId };

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if sourceId exists
  if (!(await helpers.idExist(routerTypeSource, sourceId, res))) {
    return res.statusCode;
  }
  //check if targetId exists
  if (!(await helpers.idExist(routerTypeTarget, targetId, res))) {
    return res.statusCode;
  }

  //read
  await helpers.readRelBySourceAndTarget(routerType, reqBody, res);
});

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

//UPDATE

router.put("/update", async (req, res) => {
  const { title, props, parentId, id } = req.body;
  const reqBody = { title, props, parentId, id };

  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if props exists
  if (!(await helpers.propsExists(parentId, routerType, props, res))) {
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

  //update
  await helpers.update(routerType, reqBody, res);
});

//DELETE

router.delete("/:id", async (req, res) => {
  if (!(await helpers.idExist(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  if (!(await helpers.isParent(routerType, req.params.id, res))) {
    return res.statusCode;
  }

  await helpers.remove(routerType, req.params.id, res);
});

module.exports = router;
