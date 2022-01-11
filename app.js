const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

// Set Content Security Policy

// app.use(function (req, res, next) {
//     res.setHeader(
//       'Content-Security-Policy',
//       "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//     );
//     next();
//   });
  
// Enable cors
app.use(cors())

// Api
app.use('/api', require('./api/api.js'))

// Set static folder
app.use(express.static('public'))


// Redirect to link
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
})



app.listen(PORT, () => console.log(`App running on port ${PORT}`))