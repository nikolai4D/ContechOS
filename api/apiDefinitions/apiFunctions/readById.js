async function readById(routerType, reqId) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);
  let result = { read: false, exists: false };

  const recordIdsArray = record.getAllId();

  if (!recordIdsArray.includes(reqId)) {
    result.result = `missing: ${reqId}`;
    return result;
  }

  try {
    rec = await record.getById(reqId);
    result.read = true;
    result.exists = true;
    result.result = await rec;
    return result;

    // return res.status(200).json(result);
  } catch (error) {
    result.read = false;
    result.exists = true;
    result.result = error;
    return result;

    // return res.status(500).json({ error });
  }
}

module.exports = readById;
