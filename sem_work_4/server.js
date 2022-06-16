const path = require('path')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const nodemailer = require('nodemailer');

const port = 5001;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
app.use(express.json())

io.on('connection', function(socket){
    console.log('A client has been connected');
    socket.emit('message', "OK!");
    socket.on('eventClient', function(data){
        console.log('Email: ' + data.recipient);
        console.log('Client message: ' + data.message);

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: config,
        });

        // var result = transporter.MailMessage.sendMail({
        var result = transporter.sendMail({
            from: config.user,
            to: data.recipient,
            subject: 'Mail client testing',
            text: data.message,
            html: data.message
        })
    })
})

var pathFile = path.resolve('index.html');

app.get('/', (req, res)=>{
    res.sendFile(pathFile);
})

http.listen(port, function(){
    console.log('Listening port: ' + port)
})