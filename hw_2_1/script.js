const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');
const vkbot = require('node-vk-bot-api');
const bodyParser = require('body-parser');

const api_key = '7238c942c1fd59903e533b664ff16a55d86525d3ab1872afb1d222cfaea3bc04b5f9b10cdaa660bc0481b'
const confirmation_code ='a955c08e'

const bot = new vkbot({
    token: api_key,
    confirmation: confirmation_code

});

bot.command('/start', (ctx) => {
    ctx.reply('Для получения прозноза погоды введите название города <3');

});

bot.on((ctx) => {
    console.log('receive => ' + ctx.message.text);    
    let city_raw = ctx.message.text;
    var city = cyrillicToTranslit().transform(city_raw.replace('-', '_'), "_");

    const url = `https://pogoda.mail.ru/prognoz/${city.toLowerCase()}`;
    rp(url)
        .then(function(html){
            const $ = cheerio.load(html);
            let data = [];
            // selector 1с
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__temperature').each((idx,elem)=>{
                const title = $(elem).text().trim();
                data.push(title);
                console.log(title + ' <= 1');
            })
            // selector 2  - описание погоды
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div:nth-child(1)').each((idx,elem)=>{                
                const title = $(elem).text().trim();
                data.push(title);
                console.log(title + ' <= 2');
            })
            // selector 3 - ощущается как
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__additional__item').each((idx,elem)=>{
                const title = $(elem).text().trim();
                data.push(title);
                console.log(title + ' <= 3');
            })

            console.log('data => ' + data)

            // console.log(string)
            ctx.reply(city_raw + ': ' + data.join(', '));
        })
        .catch(function(err){
            // console.log(err)
            console.log(url);
        })
})

const cyrillicToTranslit = require('cyrillic-to-translit-js');

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.post('/', bot.webhookCallback);

app.listen(port, function(){
    console.log(`listening on port ${port}`);
})