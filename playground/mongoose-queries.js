const {ObjectID} = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '5c4cd76064fe872394b2027a'

if(ObjectID.isValid(id)){
    console.log('id not valid')
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo)
// })

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log("id not found")
    }
    console.log('Todo by id', todo)
}).catch(err=> console.log(err))