const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors"); 

const app = express();
const server = require("http").createServer(app);
const port = 5500;

app.use(express.static(path.resolve(__dirname) + "/public"));
app.use(cors());



app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname) + "/index.html");
});

app.get("/getCurrencies", (req, res) => {
  const сurrencyArray = ["CAD", "PLN", "UZS", "CZK", "JPY", "KGS"];
  new Promise(async (resolve, reject) => {
    try {
        response = await axios("https://www.cbr-xml-daily.ru/daily_json.js");
    } catch (error) {
        response = null;
        console.log(er);
        reject(er);
    }
    if (response) {
      // success
        const json = response.data;
        let valuesArray = [];
        for (var i = 0; i < сurrencyArray.length; i++) {
          valuesArray.push(json["Valute"][сurrencyArray[i]]);
        }
        res.send({date: json["Date"], value: valuesArray});
    }
  });
});

server.listen(port, function () {
  console.log(`listening on ${port}`);
});
