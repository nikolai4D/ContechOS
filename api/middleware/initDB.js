const fs = require("fs");
const Record = require("../apiDefinitions/records/UserRecord");
const userRecord = new Record("user");

const initDB = (req, res, next) => {
  const dir = "./db/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(`${dir}`, false);
    fs.writeFileSync("./db/.gitignore", "*");
    fs.mkdirSync(`${dir}propType/`, false);
    fs.mkdirSync(`${dir}propKey/`, false);
    fs.mkdirSync(`${dir}propVal/`, false);
    fs.mkdirSync(`${dir}config/`, false);
    fs.mkdirSync(`${dir}configRel/`, false);
    fs.mkdirSync(`${dir}data/`, false);
    fs.mkdirSync(`${dir}dataRel/`, false);
    fs.mkdirSync(`${dir}users/`, false);

    // const checkAdminUser = (await userRecord.getAll()).find(admin => admin.email === "admin");
    // if (!checkAdminUser) {
    try {
      result = userRecord.create({ createAdmin: true });
    } catch (error) {
      console.log(error);
    }
    // }
  }
  next();
};

module.exports = initDB;
