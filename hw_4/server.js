const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const app = express();
const request = require('request'); // get
const rp = require('request-promise'); // post
const cheerio = require('cheerio'); // post
const { response } = require('express');
const port = 3000;
var server = require('http').createServer(app);

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}))

app.get('/scoring', function(req, res){
    res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/index.html')
})

app.post('/scoring', (req, res)=>{ 
    request('http://localhost:8081/ping', (error, response, body) => {
        console.log(body);
    })

    var options = {
        method: 'POST',
        url: 'http://localhost:8081/calculate',
        body: req.body,
        json: true
    };


    rp(options)
        .then(function(parsedBody){
            console.log(`received result => ${parsedBody}`);
            if (parsedBody >= 1.25) {
                res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/ok.html')
            }
            else {
                res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/not-ok.html')
            }
        })
        .catch(function(error){
            res.send(error)
        })
})


server.listen(port, function(){
    console.log(`listening on ${port}`);
});   