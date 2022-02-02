const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class UserRecord {
  constructor() {}

  async create(reqBody) {
    const { email, hashedPwd, createAdmin } = reqBody;

    let userId = `u_${uuidv4()}`;
    let user = {};

    if (!createAdmin) {
      user = {
        created: Date(),
        updated: Date(),
        email: email,
        hashedPwd: hashedPwd,
        apiKey: uuidv4(),
      };
    } else {
      let adminPwd = "admin";
      user = {
        created: Date(),
        updated: Date(),
        email: "admin",
        hashedPwd: await bcrypt.hash(adminPwd, 10),
        apiKey: process.env.API_KEY,
      };
    }

    fs.writeFileSync(
      `../db/users/${userId}.json`,
      JSON.stringify(user, null, 2)
    );
    user.id = userId;

    return user;
  }

  async updatePwd(reqBody) {
    const { userId, hashedNewPwd } = reqBody;
    let user = await this.getById(userId);
    user.hashedPwd = hashedNewPwd;
    user.refreshToken = "";

    //user id
    fs.writeFileSync(
      `../db/users/${userId}.json`,
      JSON.stringify(user, null, 2)
    );
    user.id = userId;

    return user;
  }

  async getById(id) {
    //user id
    const user = JSON.parse(fs.readFileSync(`../db/users/${id}.json`, "utf8"));
    user.id = id;
    return user;
  }

  async getAll() {
    const users = [];

    //users
    const dir = `../db/users/`;
    const userFiles = fs.readdirSync(dir);

    userFiles.forEach(function (file) {
      let user = JSON.parse(fs.readFileSync(dir + file, "utf8"));
      user.id = file.slice(0, -5);
      users.push(user);
    });

    return users;
  }

  async getAllId() {
    const userIds = [];

    //all users Ids
    const dir = `../db/users/`;
    const userFiles = fs.readdirSync(dir);

    userFiles.forEach(function (file) {
      let userId = file.slice(0, -5);
      userIds.push(userId);
    });

    return userIds;
  }
}

module.exports = UserRecord;
