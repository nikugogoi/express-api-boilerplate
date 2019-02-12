// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


var obj = new ObjectID()
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return console.log("Unnable to connect")
    }
    console.log("Connected to Mongo DB server")
    const db = client.db('TodoApp')

    db.collection('Todos').deleteMany({text : 'll'}).then((result)=>{
        console.log(result)
    }, (err)=>{
        console.log('Unable to delete', err)
    })

    db.collection('Todos').deleteOne({text : 'll'}).then((result)=>{
        console.log(result)
    }, (err)=>{
        console.log('Unable to delete', err)
    })

    db.collection('Todos').findOneAndDelete({completed : false}).then((result)=>{
        console.log(result)
    }, (err)=>{
        console.log('Unable to delete', err)
    })

    client.close()
});