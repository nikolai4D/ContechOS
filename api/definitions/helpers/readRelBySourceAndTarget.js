async function readRelBySourceAndTarget(routerType, reqBody, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  const { sourceId, targetId } = reqBody;

  console.log(await record.readRelBySourceAndTarget(sourceId, targetId));

  try {
    result = await record.readRelBySourceAndTarget(sourceId, targetId);
    return res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    //return res.status(500).json({ error });
  }
}

module.exports = readRelBySourceAndTarget;
