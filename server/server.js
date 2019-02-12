var express = require('express')
var bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

var { mongoose } = require('./db/mongoose')

var { Todo } = require('./models/todo')
var { User } = require('./models/user')

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text : req.body.text
    })

    todo.save().then(doc => {
        res.send(doc)
    }).catch(err => {
        res.status(400).send(err)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }).catch(err=>res.status(400).send(err))
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    // validate id using isValid
    if(ObjectID.isValid(id)){
        // findById
        Todo.findById(id).then((todo) => {
            // success
            // if no todo - send back 400 with empty
            if(!todo)
                return res.status(404).send()
            //if todo - send it back
            res.send({todo})
        }).catch(err => {
            // error
            return res.status(400).send()
                // 400 - send empty
        }) 
    }
    else {
        // 404 send empty 
        return res.status(404).send()
    }

})

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
})

module.exports= { app }