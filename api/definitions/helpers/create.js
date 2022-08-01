async function create(routerType, reqBody, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);
  try {
    let result = await localCreate(record, reqBody)
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function localCreate(record, reqBody) {
  return await record.create(reqBody);
}

module.exports = { create, localCreate };