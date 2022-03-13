const parentIdExist = require("./parentIdExist.js");
const propsExists = require("./propsExists.js");

async function createBulk(routerType, reqBody, res) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  const imported = [];
  const rejected = [];
  const results = { imported, rejected };

  //console.log(reqBody.objects);

  const { objects } = reqBody;

  async function loopObjects(routerType, res, obj) {
    //check if parentId exists
    if (!(await parentIdExist(routerType, obj.parentId, res))) {
      return res.statusCode;
    }
    ////check if props exists
    if (!(await propsExists(obj.parentId, routerType, obj.props, res))) {
      return res.statusCode;
    }
    try {
      let result = await record.create(obj);
      imported.push(await result.id);
    } catch (error) {
      rejected.push(obj);
    }
  }

  for (const obj of objects) {
    await loopObjects(routerType, res, obj);
  }

  return res.status(200).json(results);
}

module.exports = createBulk;
