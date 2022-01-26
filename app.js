const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions');
require('dotenv').config()
const verifyJWT = require('./api/middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./api/middleware/credentials');
const PORT = process.env.PORT
const app = express()

  
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());


app.use('/signin', require('./api/apiDefinitions/auth.js'))


// Api
app.use('/api', require('./api/api.js'))


// Set static unprotected folder
app.use("/signin", express.static('publicOpen'))

//middleware
//app.use(verifyJWT)

// Set static protected folder
app.use("/app", express.static('publicProtected'));


// Redirect to link
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "publicProtected", "index.html"))
})



app.listen(PORT, () => console.log(`App running on port ${PORT}`))