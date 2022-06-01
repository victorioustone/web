const express = require('express');
const axios = require('axios');
const { readdirSync } = require('fs');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
const { MongoClient } = require('mongodb');

const port = 3000;
const app = express();
const server = require('http').createServer(app);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname)+'/index.html');
})

app.get('/get/:val', (req, res) => {
    const url = 'mongodb://localhost:5000';
    const clientMongo = new MongoClient(url);
    clientMongo.connect(function(err, client){
        if (err) return console.log(err);
        const db = client.db('currencies');
        const collection = db.collection('info');
        let currentDate = new Date();
        currentDate = currentDate.getFullYear() + '-' + 0 + (currentDate.getMonth() + 1)+ '-' + currentDate.getDate();
        console.log(currentDate);
        collection.find({Timestamp:{$regex: `^${currentDate}`}}).toArray(function(err,result){
            if (err) return console.log(err);
            client.close();
            if (result.length == 0){
                console.log('Данных нет');
            } else console.log(result);
        })
    })


    console.log(req.params.val)
    var val = req.params.val;
    // console.log('here')
    let response = null;
    new Promise(async (resolve, reject)=>{
        try {
            response = await axios('https://www.cbr-xml-daily.ru/daily_json.js');
        }
        catch (er) {
            // response = null;
            console.log(er);
            // reject(er);
        }
        if (response){
            // success
            const json = response.data;
            var value = json.Valute[val]["Value"];
            console.log(value);
            res.send({'value':value});
            const url = 'mongodb://localhost:5000';
            const clientMongo = new MongoClient(url);
            clientMongo.connect(function(err, client){
                if (err) return console.log(err);
                const db = client.db('currencies');
                const collection = db.collection('info');
                collection.insertOne(json, function(err, result){
                    if (err) return console.log(err);
                    client.close();
                })
            })
        }
    })
})

server.listen(port, function(){
    console.log(`lintening on port ${port}`);
})