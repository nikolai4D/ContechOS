async function readById(routerType, reqId, res) {
  const Record = require("../../records/Record.js");
  const record = new Record(routerType);

  try {
    result = await record.getById(reqId);
    res.status(200).json(result);
    return true;
  } catch (error) {
    res.status(500).json({ error });
    return false;
  }
}

module.exports = readById;
