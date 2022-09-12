const express = require("express");
const path = require("path");
const cors = require("cors");
const initDB = require("./api/middleware/initDB.js");
const corsOptions = require("./config/corsOptions");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");
const {access} = require("./database/access");
const {IdData} = require("./database/helpers/idData");
const {getItemById, doesFileExist} = require("./database/FileManager");
const PORT = process.env.PORT;
const app = express();

//Init DB
app.use(initDB);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
//app.use(cors(corsOptions));
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//
//middleware for cookies
app.use(cookieParser());

// Api
app.use("/api", require("./api/api.js"));

// Set static protected folder
app.use("/", express.static(__dirname + "/public"));

// Redirect to link
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// async function d() {
//   const node = await new Accessor().getItems({sourceId:"co_d99c026d-dd78-4474-af01-7b5cd08e572e", limit: 5})
//   console.log("node: " + JSON.stringify(node))
// }
// d()

//  async function create(){
//   await access.createItem({
//     parentId: "cd_06f1c232-4e8d-4078-802a-6f8fcfdd8725",
//     title:"youpida",
//     itemKind: "node"})
// }
// create()

// async function read(){
//     console.log(await access.getItems({title: "youpidoo"}))
// }
// read()

console.log("node: " + JSON.stringify(doesFileExist("id_71f22ff0-ce47-4374-9b6d-7c3f3ab219da", "instanceData")))
// console.log(doesDefTypeNameExist("typeDataExternalRel"))
let data = new IdData("id_71f22ff0-ce47-4374-9b6d-7c3f3ab219da")
console.log("data: " + JSON.stringify(data), null, 2)
console.log("parentId: " + JSON.stringify(data.parentId(), null, 2))


app.listen(PORT, () => console.log(`App running on port ${PORT}`));
