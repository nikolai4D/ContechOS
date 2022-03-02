async function readByParentId(routerType, parentId, res) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  try {
    result = await record.getByParentId(parentId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = readByParentId;
