async function getRelatedNodes(routerType, nodeId, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  //console.log(await record.getRelatedNodes(nodeId));

  try {
    result = await record.getRelatedNodes(nodeId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = getRelatedNodes;
