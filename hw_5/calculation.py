from aiohttp import web
import json
from datetime import date


routes = web.RouteTableDef()


@routes.get('/hello')
async def hello(request):
    return web.Response(text=f'hello students!')

@routes.post('/python')
async def main(request):
    data = await request.json()
    print(data)

    grade = 0
    prof_a = ['driver', 'developer', 'teacher']
    # пол 
    if (data['gender'] == 'female'):
        grade += 0.4
    # возраст
    bd = data['birthdate'].split('-')
    age = int(date.today().year) - int(bd[0])
    if (int(date.today().month) < int(bd[1])):
        age -= 1
    if (age >= 20):
        dop = age * 0.1
        if (dop < 0.3):
            grade += dop
        else:
            grade += 0.3

    # срок проживания
    dop = int(data['periodoflife'])  * 0.042
    if (dop > 0.42):
        grade += 0.42
    else:
        grade += dop
    
    # профессия
    if (data['profession'] in prof_a):
        grade += 0.55
    elif (data['profession'] == 'other'):
        grade += 0.16
    
    # банковский счет
    if ('bankaccount' in data) and (data['bankaccount'] == 'on'):
        grade += 0.45
    
    # недвижимость
    if ('realestate' in data) and (data['realestate'] == 'on'):
        grade += 0.35
    
    # полис по страхованию
    if ('insurance' in data) and (data['insurance'] == 'on'):
        grade += 0.19
    # работа 
    if (data['sphere'] == 'public'):
        grade += 0.21
    # занятость
    grade += int(data['periodofwork']) * 0.059

    return web.Response(text=f'{grade}')

app = web.Application()
app.add_routes(routes)
web.run_app(app, port="8081")