const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');
const vkbot = require('node-vk-bot-api');
const bodyParser = require('body-parser');
const Markup = require('node-vk-bot-api/lib/markup');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const api_key = config.api_key;
const confirmation_code = config.confirmation_code;

const bot = new vkbot({
    token: api_key,
    confirmation: confirmation_code

});

var city_raw;
var city;

bot.command('/start', (ctx) => {
    ctx.reply('Для получения прозноза погоды введите название города <3', null, Markup.keyboard(
        ['Москва', 'Санкт-Петербург', 'Казань', 'Сочи'],{columns: 2}).inline());

});

bot.on((ctx) => {
    if (ctx.message.text === 'Сегодня'){
        console.log('receive => ' + ctx.message.text);   
        const url = `https://pogoda.mail.ru/prognoz/${city.toLowerCase()}`;
        rp(url)
            .then(function(html){
                const $ = cheerio.load(html);
                let data = [];
                // selector 1 - градусы
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
                console.log(err);
                ctx.reply('Ваш город не найден!', null, Markup
                .keyboard([
                    Markup.button({
                        action: {
                            type: 'open_link',
                            link: 'https://pogoda.mail.ru',
                            label: 'Перейти на сайт',
                            payload: JSON.stringify({
                            url: 'https://pogoda.mail.ru',
                            color: '#CD853F',
                            one_time: true
                            }),
                        },
                    }),
                ]),
                );
            })
        }

    else if(ctx.message.text === 'Завтра'){

            console.log('receive event => ' + ctx.message.text);    
            const url = `https://pogoda.mail.ru/prognoz/${city.toLowerCase()}`;
            rp(url)
                .then(function(html){
                    const $ = cheerio.load(html);
                    let data = [];
                    // selector 1 - градусы
                    $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.cols.cols_banner-wide.clearfix.margin-top-20 > div.cols__column.cols__column_left > div > div > div > div:nth-child(1) > a > div.day__temperature').each((idx,elem)=>{
                        lst = $(elem).text().trim().split('\n'); 
                        data.push(lst[0]);
                        data.push(lst[1]);
                        console.log(lst[0] + ' <= 1');
                        console.log(lst[1] + ' <= 2');
                    })
                    // selector 2  - описание погоды
                    $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.cols.cols_banner-wide.clearfix.margin-top-20 > div.cols__column.cols__column_left > div > div > div > div:nth-child(1) > a > div.day__description').each((idx,elem)=>{                
                        const title = $(elem).text().trim();
                        data.push(title);
                        console.log(title + ' <= 3');
                    })

                    console.log('data => ' + data)
                    ctx.reply(city_raw + ': ' + data[0] + ' (ночью '+ data[1] + '), ' + data[2]);
                })
        
                .catch(function(err){
                    ctx.reply('Ваш город не найден!', null, Markup
                    .keyboard([
                        Markup.button({
                            action: {
                                type: 'open_link',
                                link: 'https://pogoda.mail.ru',
                                label: 'Перейти на сайт',
                                payload: JSON.stringify({
                                url: 'https://pogoda.mail.ru',
                                color: '#CD853F',
                                one_time: true
                                }),
                            },
                        }),
                    ]),
                    );
                })
        }
    else if(ctx.message.text === 'Послезавтра'){
        console.log('receive event => ' + ctx.message.text);    
        const url = `https://pogoda.mail.ru/prognoz/${city.toLowerCase()}`;
        rp(url)
            .then(function(html){
                const $ = cheerio.load(html);
                let data = [];
                // selector 1 - градусы
                $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.cols.cols_banner-wide.clearfix.margin-top-20 > div.cols__column.cols__column_left > div > div > div > div:nth-child(2) > a > div.day__temperature').each((idx,elem)=>{
                    lst = $(elem).text().trim().split('\n'); 
                    data.push(lst[0]);
                    data.push(lst[1]);
                    console.log(lst[0] + ' <= 1');
                    console.log(lst[1] + ' <= 2');
                })
                // selector 2  - описание погоды
                $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.cols.cols_banner-wide.clearfix.margin-top-20 > div.cols__column.cols__column_left > div > div > div > div:nth-child(2) > a > div.day__description').each((idx,elem)=>{                
                    const title = $(elem).text().trim();
                    data.push(title);
                    console.log(title + ' <= 3');
                })

                console.log('data => ' + data)
                ctx.reply(city_raw + ': ' + data[0] + ' (ночью '+ data[1] + '), ' + data[2]);
            })

            .catch(function(err){
                ctx.reply('Ваш город не найден!', null, Markup
                .keyboard([
                    Markup.button({
                        action: {
                            type: 'open_link',
                            link: 'https://pogoda.mail.ru',
                            label: 'Перейти на сайт',
                            payload: JSON.stringify({
                            url: 'https://pogoda.mail.ru',
                            color: '#CD853F',
                            one_time: true
                            }),
                        },
                    }),
                ]),
                );
            })

    }
    else {
        ctx.reply('Введите необходимую дату', null, Markup.keyboard([
            [Markup.button('Сегодня', 'primary'), 
            Markup.button('Завтра', 'positive'), 
            Markup.button('Послезавтра', 'negative')]
        ])),
        city_raw = ctx.message.text;
        city = cyrillicToTranslit().transform(city_raw.replace('-', '_'), "_");
        console.log('receive => ' + city_raw);

    }
    
})

const cyrillicToTranslit = require('cyrillic-to-translit-js');

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.post('/', bot.webhookCallback);

app.listen(port, function(){
    console.log(`listening on port ${port}`);
})