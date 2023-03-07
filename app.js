const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')
const compression = require('compression')


// init app & middleware
const app = express()
app.use(express.json())
app.use(compression())
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

    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5 // page size
    const page = req.query.page ? parseInt(req.query.page) : 0 // page

    let books = [];

    db.collection('books')
        .find()
        .sort({author: 1})
        .skip(page * pageSize)
        .limit(pageSize)
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
        })
        .catch((error) => {
            res.status(500).json({error: 'could not fetch the document'})          
        })
})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(error => {
            res.status(500).json({error: 'could not create a new document'})
        })
})


app.delete('/books/:id', (req, res) => {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
        res.status(400).json({error: 'invalid document id'})          
    }

    db.collection('books')
        .deleteOne({ _id: new ObjectId(id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(error => {
            res.status(500).json({error: 'could not delete a new document'})
        })

})

app.patch('/books/:id', (req, res) => {
    const { id } = req.params
    const book = req.body

    if (!ObjectId.isValid(id)) {
        res.status(400).json({error: 'invalid document id'})          
    }

    db.collection('books')
        .updateOne({ _id: new ObjectId(id) }, { $set: book })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(error => {
            res.status(500).json({error: 'could not update the document'})
        })
})