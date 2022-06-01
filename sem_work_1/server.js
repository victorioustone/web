const express = require('express');
const axios = require('axios');
const { readdirSync } = require('fs');

const port = 3000;
const app = express();
const server = require('http').createServer(app);

app.get('/', (req, res) => {
    res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem_5/index.html');
})

app.get('/get/:val', (req, res) => {
    console.log(req.params.val)
    var val = req.params.val;
    // console.log('here')
    let response = null;
    new Promise(async (resolve, reject)=>{
        try {
            response = await axios('https://www.cbr-xml-daily.ru/daily_json.js');
        }
        catch (er) {
            response = null;
            console.log(er);
            reject(er);
        }
        if (response){
            // success
            const json = response.data;
            var value = json.Valute[val]["Value"];
            console.log(value);
            res.send({'value':value});
        }
    })
})

server.listen(port, function(){
    console.log(`lintening on port ${port}`);
})