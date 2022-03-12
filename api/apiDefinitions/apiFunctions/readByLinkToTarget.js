async function readByLinkToTarget(routerType, linkParentId, targetId, res) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  console.log(await record.readByLinkToTarget(linkParentId, targetId));

  try {
    result = await record.readByLinkToTarget(linkParentId, targetId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = readByLinkToTarget;
