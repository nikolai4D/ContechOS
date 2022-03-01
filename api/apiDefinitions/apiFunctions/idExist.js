async function idExist(routerType, reqId, res) {
  const Record = require("../records/Record.js");
  const record = new Record(routerType);
  const recordArray = await record.getAllId();

  if (!recordArray.includes(reqId)) {
    res.status(400).json(`missing: ${reqId}`);
    return false;
  } else {
    return true;
  }
}

module.exports = idExist;
