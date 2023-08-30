async function readSourcesToTargetTitles(routerType, targetTitle, res) {
  const Record = require("../../records/Record.js");
  //Record instance
  const record = new Record(routerType);

  console.log(await record.readSourcesToTargetTitles(targetTitle));

  try {
    result = await record.readSourcesToTargetTitles(targetTitle);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = readSourcesToTargetTitles;
