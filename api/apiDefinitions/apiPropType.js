const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const create = require("./apiFunctions/create.js");
const readAll = require("./apiFunctions/readAll.js");
const reqQueryExists = require("./apiFunctions/reqQueryExists.js");
const readById = require("./apiFunctions/readById.js");
const reqBodyExists = require("./apiFunctions/reqBodyExists.js");
const parentIdExist = require("./apiFunctions/parentIdExist.js");
const isParent = require("./apiFunctions/isParent.js");
const idExist = require("./apiFunctions/idExist.js");
const remove = require("./apiFunctions/remove.js");
const routerType = "propVal";

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  const { title } = req.body;
  const reqBody = { title };
  //check if keys/values exist in reqBody
  if (!(await reqBodyExists(reqBody, res))) {
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
