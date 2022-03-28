const reqQueryExists = (reqQuery, param) => {
  if (!Object.keys(reqQuery).includes(param)) {
    return false;
  } else {
    return true;
  }
};

module.exports = reqQueryExists;
