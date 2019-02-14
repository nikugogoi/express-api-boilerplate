const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [{
    _id: new ObjectID(),
    text : 'First test todo'
},
{   _id: new ObjectID(),
    text : 'Second test todo',
    completed: true,
    completedAt: new Date().getTime()
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => {
        done()
    })
})

describe('POST /todos', ()=>{
    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err){
                    done(err)
                }
                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch(e => done(e))
            })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    done(err)
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch(e => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})
 
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/abc123')
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it("should remove a todo", (done)=>{
        var hexId = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) =>{
                if(err){
                    return done(err)
                }
                // query database using findById  toNotExist
                Todo.findById(hexId).then(res => {
                    expect(res).toBeNull()
                    done()
                }).catch(err => done(err))
            })
    })

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if objectId is invalid', (done) => {
        // /todos/123
        request(app)
            .delete('/todos/abc123')
            .expect(404)
            .end(done)
    })
})

describe("PATCH /todos/:id", () => {
    it("should update the todo", (done) => {
        // grab id 
        var hexId = todos[0]._id.toHexString()
        var text = "test case update"
        // update text, set completed true
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            // 200
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBeTruthy()
            expect(typeof res.body.todo.completedAt).toBe('number')
        })
        .end((err, res) => {
            if(err){
                done(err)
                return
            }
            // text is changed, completed is true, completedAt is anumber .toBeA
            Todo.findById(hexId).then(todo => {
                expect(todo.text).toBe(text)
                expect(todo.completed).toBeTruthy()
                expect(typeof todo.completedAt).toBe('number')
                done()
            }).catch(e => done(e))
        })
    })

    it("should clear completedAt when todo is not completed", (done) => {
        // grab id
        var hexId = todos[1]._id.toHexString()
        var text = "test case update to false"
        // update text, set completed to false
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            // 200
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBeFalsy()
            expect(res.body.todo.completedAt).toBeNull()
        })
        .end((err, res) => {
            if(err){
                done(err)
            }
            // text is changed, completed false, completedAt is null .toBeNull
            Todo.findById(hexId).then(todo => {
                expect(todo.text).toBe(text)
                expect(todo.completed).toBeFalsy()
                expect(todo.completedAt).toBeNull()
                done()
            }).catch(e => done(e))
        })
    })
})