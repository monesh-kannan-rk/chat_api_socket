var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser =  require('body-parser')
// var http = require('http').Server(app)
var socket = require('socket.io')
// var io = require('socket.io')(http)

app.use(express.static(__dirname));


var dbUrl = 'mongodb://127.0.0.1/chatapi'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
   });

let io = socket(server)
io.on('connection', () =>{
    console.log('a user is connected')
   })

mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected',err)
})
var Message = mongoose.model('Message',{
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({},(err, message) =>{
        res.send(message)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err){
            return res.sendStatus(500)
        }
        io.emit('message', req.body)
        return res.sendStatus(200)
    })
})
