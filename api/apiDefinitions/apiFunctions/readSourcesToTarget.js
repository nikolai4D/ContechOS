async function readSourcesToTarget(routerType, targetId, res) {
  const Record = require("../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  console.log(await record.readSourcesToTarget(targetId));

  try {
    result = await record.readSourcesToTarget(targetId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = readSourcesToTarget;
