const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const helpers = require("../helpers/helpers.js");

const routerType = "propKey";

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  const { title, parentId } = req.body;
  const reqBody = { title, parentId };
  //check if keys/values exist in reqBody
  if (!(await helpers.reqBodyExists(reqBody, res))) {
    return res.statusCode;
  }

  //check if parentId exists
  if (!(await helpers.parentIdExist(routerType, parentId, res))) {
    return res.statusCode;
  }

  //create
  await create(routerType, reqBody, res);
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
