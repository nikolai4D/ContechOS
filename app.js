const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions');
require('dotenv').config()
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

// Api
app.use('/api', require('./api/api.js'))

// Set static protected folder
app.use("/", express.static('public'));


// Redirect to link
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
})



app.listen(PORT, () => console.log(`App running on port ${PORT}`))