const express = require("express");
const path = require("path");
const cors = require("cors");
const initDB = require("./api/middleware/initDB.js");
const corsOptions = require("./config/corsOptions");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");
const {Accessor} = require("./DBaccess/Accessor");
const {createItem} = require("./DBaccess/crud/create");
const {getItemById} = require("./DBaccess/FileManager");
const {doesItemExist} = require("./DBaccess/helpers/checkers");
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

// async function create(){
//   await createItem({
//     parentId: "cd_06f1c232-4e8d-4078-802a-6f8fcfdd8725",
//     title:"youpidoo",
//     itemKind: "node"})
// }
// create()

console.log(doesItemExist("cor_hgjgygyylug"))

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
