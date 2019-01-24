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
    
    // db.collection('Todos').find({ 
    //     _id: new ObjectID("5c4a092f13007d22cdbd7a34") 
    // }).toArray().then((docs)=>{
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err)=>{
    //     console.log('Unable to fetch', err)
    // })

    db.collection('Todos').find().count().then((count)=>{
        console.log(`Todos count: ${count}`)
    }, (err)=>{
        console.log('Unable to fetch', err)
    })

    client.close()
});