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

// бд - currencies
// таблица - info
app.get('/get/:val', (req, res) => {
    var val = req.params.val;

    const url = 'mongodb://localhost:5000';
    const clientMongo = new MongoClient(url);
    clientMongo.connect(function(err, client){
        if (err) return console.log(err);
        const db = client.db('currencies');
        const collection = db.collection('info');
        
        // проверка по дате - есть ли на сегодняшнюю дату запись в бд
        let currentDate = new Date();
        currentDate = currentDate.getFullYear() + '-' + 0 + (currentDate.getMonth() + 1)+ '-' + currentDate.getDate();
        console.log(currentDate);

        collection.find({Timestamp:{$regex: `^${currentDate}`}}).toArray(function(err,result){
            if (err) return console.log(err);
            if (result.length == 0){
                // если ответ на запрос пустой
                console.log('Данных нет');
                new Promise(async (resolve, reject)=>{
                    try {
                        response = await axios('https://www.cbr-xml-daily.ru/daily_json.js');
                    }
                    catch (er) {
                        console.log(er);
                    }
                    if (response){
                        // success
                        const json = response.data;
                        var value = json.Valute[val]["Value"];
                        console.log(`${val} => ${value}`);
                        res.send({'value':value});
                        collection.insertOne(json, function(err, result){
                            if (err) return console.log(err);
                        })
                    }
                })
            } else {
                // если ответ на запрос непустой
                console.log('Данные есть');
                value = JSON.stringify(result[0].Valute[val].Value);
                console.log(`${val} => ${value}`);
                res.send({'value':value});
            } 
        })
        setTimeout(() => {clientMongo.close()}, 1500);
    })
})

server.listen(port, function(){
    console.log(`lintening on port ${port}`);
})