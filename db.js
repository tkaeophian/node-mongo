const { MongoClient } = require('mongodb')
let dbConnection

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect('mongodb://localhost:27017/bookstore')
            .then(client => {
                dbConnection = client.db()
                return callback()
            }).catch(error => {
                console.log('db connection error ', error)
                return callback(error)
            })
    },
    getDb: () => dbConnection
}