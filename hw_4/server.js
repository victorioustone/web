const express = require('express');
const app = express();
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
    console.log(req.body)
    grade = 0
    prof_a = ['driver', 'developer', 'teacher']
    // пол 
    if (req.body.gender === 'female'){
        grade += 0.4
    }
    // возраст

    now = new Date()
    bd = req.body.birthdate.split('-')
    age = now.getFullYear() - bd[0]
    if (now.getMonth() < bd[1]){
        age --
    }
    if (age >= 20){
        dop = age * 0.1
        if (dop < 0.3){
            grade += dop
        }
        else {
            grade += 0.3
        }
    }

    // срок проживания
    dop = req.body.periodoflife  * 0.042
    if (dop > 0.42){
        grade += 0.42
    }
    else {
        grade += dop
    }
    // профессия
    if (req.body.profession in prof_a){
        grade += 0.55
    }
    else if (req.body.profession === 'other'){
        grade += 0.16
    }
    // банковский счет
    if (req.body.bankaccount === 'on'){
        grade += 0.45
    }
    // недвижимость
    if (req.body.realestate === 'on'){
        grade += 0.35
    }
    // полис по страхованию
    if (req.body.insurance === 'on'){
        grade += 0.19
    }
    // работа 
    if (req.body.sphere === 'public'){
        grade += 0.21
    }
    // занятость
    grade += req.body.periodofwork * 0.059
    if (grade >= 1.25){
        res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/ok.html')
    }
    else {
        res.sendFile('/Users/vittoria/Desktop/6 семестр/web/sem3/public/not-ok.html')
    }
});

server.listen(port, function(){
    console.log(`listening on ${port}`);
});   