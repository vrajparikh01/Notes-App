// Entry point of backend

// index.js will be express server

const connectToMongo = require("./db");

connectToMongo();

const express = require('express')
var cors = require('cors')
const app = express()
// react app will be on port 3000
const port = 5000

// If we want to use req.body then use this middleware
app.use(express.json());
app.use(cors());

// Available Routes
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})