const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware
const app = express()

// db connection
let db

connectToDb((error) => {
    if (!error) {
        app.listen(3000, () => {
            console.log("app listening on port 3000")
        })
        db = getDb()
    }
})



// routes
app.get('/books', (req, res) => {

    let books = [];

    db.collection('books')
        .find()
        .sort({author: 1})
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        }).catch((error) => {
            res.status(500).json({error: 'could not fetch the document'})          
        })
})

app.get('/books/:id', (req, res) => {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
        res.status(400).json({error: 'invalid document id'})          
    }

    db.collection('books')
        .findOne({ _id: new ObjectId(id) })
        .then(doc => {
            res.status(200).json(doc)
        }).catch((error) => {
            res.status(500).json({error: 'could not fetch the document'})          
        })
})
