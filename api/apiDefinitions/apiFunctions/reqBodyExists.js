const reqBodyExists = (reqBody, res) => {
  let keys = [];

  if (Object.values(reqBody).includes(undefined)) {
    Object.keys(reqBody).forEach((key) => {
      if (reqBody[key] === undefined) {
        keys.push(key);
      }
    });
    res.status(400).send(`missing: ${keys}`);
    return false;
  } else {
    return true;
  }
};

module.exports = reqBodyExists;
