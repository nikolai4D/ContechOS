const express = require("express");
const path = require("path");
const cors = require("cors");
const initDB = require("./api/middleware/initDB.js");
const corsOptions = require("./config/corsOptions");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");
const {doesDefTypeExist} = require("./database/helpers/BulkFetchData");
const {getItems} = require("./database/crud/read");
const {createItem} = require("./database/crud/create");
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

async function d() {
  console.log("Creation: " + JSON.stringify(await createItem({
    kindOfItem: "property",
    parentId: "pk_9f0f44e6-ef22-4384-927d-5e94b538c410",
    title: "maPropVal"})))
}
d()

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
