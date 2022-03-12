const credentials = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

module.exports = credentials;
