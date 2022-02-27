const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const create = require("./apiFunctions/create.js");
const readAll = require("./apiFunctions/readAll.js");
const readById = require("./apiFunctions/readById.js");
const reqBodyExists = require("./apiFunctions/reqBodyExists.js");
const propKeysExists = require("./apiFunctions/propKeysExists.js");
const isTarget = require("./apiFunctions/isTarget.js");
const remove = require("./apiFunctions/remove.js");
const Record = require("./records/Record.js");

const routerType = "configDef";
//Record instance
// const record = new Record(routerType);

//Bodyparser
router.use(bodyParser.json());

//APIs
router.post("/create", async (req, res) => {
  //deconstruct
  const { title, propKeys } = req.body;
  const reqBody = { title, propKeys };

  if (!reqBodyExists(reqBody).exists) {
    return res.status(400).json(reqBodyExists(reqBody).message);
  }
  if (!propKeysExists(propKeys).exists) {
    return res.status(400).json(propKeysExists(propKeys).message);
  }
  const result = await create(routerType, reqBody);
  if (result.created) {
    return res.status(200).json(result.result);
  } else {
    return res.status(500).json(result.result);
  }
});

router.get("/", async (req, res) => {
  if (Object.keys(req.query).includes("id")) {
    const result = await readById(routerType, req.query.id);

    if (!result.exists) {
      return res.status(400).json(result.result);
    } else {
      if (result.read) {
        return res.status(200).json(result.result);
      } else {
        return res.status(500).json(result.result);
      }
    }
  } else {
    const result = await readAll(routerType);

    console.log(result);
    if (result.read) {
      return res.status(200).json(result.result);
    } else {
      return res.status(500).json(result.result);
    }
  }
});

router.delete("/:id", async (req, res) => {
  const result = await readById(routerType, req.params.id);
  if (!result.exists) {
    return res.status(400).json(result.result);
  } else {
    if (!result.read) {
      return res.status(500).json(result.result);
    } else {
      const targets = await isTarget(routerType, result.result.id);
      if (targets.length > 0) {
        return res.status(400).json(`can't delete because of: ${targets}`);
      } else {
        removed = await remove(routerType, result.result.id);

        if (removed.removed) {
          return res.status(200).json(removed.result);
        } else {
          return res.status(500).json(removed.result);
        }
      }
    }
  }

  //check if is target
});

module.exports = router;
