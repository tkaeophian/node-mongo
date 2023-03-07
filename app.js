const express = require('express')
const { connectToDb, getDb } = require('./db')

// init app & middleware
const app = express()

// db connection
let dbConnection

connectToDb((error) => {
    if (!error) {
        app.listen(3000, () => {
            console.log("app listening on port 3000")
        })
        dbConnection = getDb()
    }
})



// routes
app.get('/books', (req, res) => {
  res.json({msg: "welcome to the api"})
})