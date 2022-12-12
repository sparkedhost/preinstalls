//Define all the modules that we will be using in this file.
const express = require('express')
const app = express()
require('dotenv').config();

//This is a GET request route. It will be called when the user visits the root of the site.
app.get('/', (req, res) => {
  res.send('Hello World! This is a GET request.')
})

//This is a POST request route. It will be called when the user submits data on the site.
app.post('/', (req, res) => {
    res.send('Got a POST request')
})

//This sets the port that the web server will listen on. It will be the port specified in the .env file. 
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.SERVER_PORT}`)
})