const {ObjectID} = require('mongodb')

const { mongoose } = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} =  require('../server/models/user')

// Todo.remove({}).then(res => {
//     console.log(res)
// }).catch(err => {

// })

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findOneAndRemove({ _id : '5c646fba2c50952689a5b683' }).then((doc) => {
    console.log(doc)
})

Todo.findByIdAndRemove('5c646fba2c50952689a5b683').then((doc) => {
    console.log(doc)
})