function reqBodyExists(reqBody) {
  const keys = [];

  if (Object.values(reqBody).includes(undefined)) {
    Object.keys(reqBody).forEach((key) => {
      if (reqBody[key] === undefined) {
        keys.push(key);
      }
    });

    return {
      exists: false,
      message: `missing: ${keys}`,
    };
  } else {
    return { exists: true };
  }
}

module.exports = reqBodyExists;
