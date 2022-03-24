const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const app = express();
const request = require('request'); // get
const rp = require('request-promise'); // post
const cheerio = require('cheerio'); // post
const { response } = require('express');
const port = 3000;
var server = require('http').createServer(app);

request 


app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}))

app.get('/scoring', function(req, res){
    res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/index.html')
})

app.post('/scoring', (req, res)=>{ 
    request('http://localhost:8081/hello', (error, response, body) => {
        console.log(body);
    })

    var options = {
        method: 'POST',
        url: 'http://localhost:8081/python',
        body: req.body,
        json: true
    };

    rp(options)
        .then(function(parsedBody){
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

app.post('/scoring', (req, res)=>{
    const url="mongodb://localhost:3001";
    const client = new mongoClient(url);
    client.connect(function(error, client){
        const db = client.db(`clients`);
        const collection = db.collection(`info`);
        let clientInfo = req.body;
        collection.find(function(error, result){
            if (error){
                console.log(error);
            }
            else {
                console.log('инфа из базы: '+ result);
                client.close();
            }
            
        })
    })
    res.send('ok')
});

server.listen(port, function(){
    console.log(`listening on ${port}`);
});   