var env = process.env.NODE_ENV || 'development'
console.log('env *****', env)

if(env === 'development'){
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
 } else if(env==='test'){
    process.env.PORT = 3000
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
 }

const _ = require('lodash')

var express = require('express')
var bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

var { mongoose } = require('./db/mongoose')

var { Todo } = require('./models/todo')
var { User } = require('./models/user')
var { authenticate } = require('./middleware/authenticate')

var app = express()
const PORT = process.env.PORT

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

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id

    // validate id using isValid
    if(ObjectID.isValid(id)){
        Todo.findByIdAndRemove(id).then(todo => {
            if(todo){
                return res.send({todo})
            } else{
                return res.status(404).send()
            }
        }).catch(err => {
            console.log(err)
            return res.status(500).send
        })
    } else {
        return res.status(404 ).send()
    }
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])
    if(ObjectID.isValid(id)){
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completed = false
            body.completedAt = null
        }
        Todo.findByIdAndUpdate(id, {$set: body}, {new : true})
            .then(todo => {
                if(!todo)
                    return res.status(404).send()
                res.send({todo})
            }).catch(e => res.status(400).send())
    } else {
        return res.status(404 ).send()
    }
})

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch(err => {
        console.log(err)
        res.status(400).send(err)
    })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
})

module.exports= { app }