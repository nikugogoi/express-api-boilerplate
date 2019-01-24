// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return console.log("Unnable to connect")
    }
    console.log("Connected to Mongo DB server")
    const db = client.db('TodoApp')
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('unable', err)
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    client.close()
});