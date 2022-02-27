function propKeysExists(propKeys) {
  let result = { exists: true };
  let keys = [];
  const Record = require("../records/Record.js");
  const propKeyRecord = new Record("propKey");
  const propKeyArray = propKeyRecord.getAllId();

  propKeys.forEach((key) => {
    if (!propKeyArray.includes(key)) {
      keys.push(key);
      result.exists = false;
    }
  });

  if (!result.exists) {
    result.message = `missing propKeys: ${keys}`;
    return result;
  } else {
    return result;
  }
}

module.exports = propKeysExists;
