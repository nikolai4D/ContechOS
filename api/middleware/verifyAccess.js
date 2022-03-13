const fs = require("fs");
const jwt = require("jsonwebtoken");

const verifyAccess = (req, res, next) => {
  try {
    if (req.headers.apikey?.length > 0) {
      //verifyApiKey
      const apiKeyHeader = req.headers.apikey;
      if (!apiKeyHeader) return res.sendStatus(401);

      const apiKeys = [];
      const dir = `../db/users/`;
      const userFiles = fs.readdirSync(dir);
      userFiles.forEach(function (file) {
        let user = JSON.parse(fs.readFileSync(dir + file, "utf8"));
        apiKeys.push(user.apiKey);
      });

      if (!apiKeys.includes(apiKeyHeader)) return res.sendStatus(401);
      next();
    } else if (req.headers.authorization?.length > 0) {
      //verifyJWT;
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); //invalid token
        res.user = decoded.email;
        next();
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log("error");
  }
};

module.exports = verifyAccess;
