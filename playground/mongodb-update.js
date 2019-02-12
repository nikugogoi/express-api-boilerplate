// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return console.log("Unnable to connect")
    }
    console.log("Connected to Mongo DB server")
    const db = client.db('TodoApp')

    db.collection('Todos').findOneAndUpdate({ 
        _id: new ObjectID("5c4a092f13007d22cdbd7a34")
    }, {
        $set: {
            completed: false
        }
    },
    {
        returnOriginal: false
    }).then((result)=>{
        console.log(result)
    }, (err)=>{
        console.log('Unable to delete', err)
    })

    client.close()
});