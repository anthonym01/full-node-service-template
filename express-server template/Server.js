//'node server.js'
const port = 1999;//port for the server 80, 443, 8080
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const logs = require('./logger');
const database = require('./database');

async function notfoundpage(response, url) {//404 page goes here
    response.writeHead(404);
    response.write('404 page not , code: ' + url);
    logs.info('File not found: ' + url);
}

app.use(express.static('www'))//bind root path to /www

//starting point request
app.get('/', (request, response) => { startingpoint(response) });
app.get('/index.html', (request, response) => { startingpoint(response) });

//test get
app.get('/get/test', (req, res) => {

    try {
        console.log('test get');
        req.on('data', function (data) {
            console.log('got: ', data);
            res.end(JSON.stringify({ testget: "test get data received" }));
        });
        //res.writeHead(200, { 'Content-type': 'application/json' });
        res.send(JSON.stringify({ test: 'test get is okay' }));
    } catch (error) {
        console.log('Catastrophy on test get: ', err);
    }
});

//test post
app.post('/post/test', (req, res) => {
    //receive more data than a get
    logs.info('test post to server');
    req.on('data', function (data) {
        logs.info('Posted : ' + data);
        res.end(JSON.stringify({ test: "test post received" }));
    });
});

app.listen(port, () => { logs.info('Running on port ' + port) })//Listen for requests, this starts the server


async function startingpoint(response) {//serve index.html
    try {
        response.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

        response.writeHead(200, { 'Content-type': 'text/html' });//200 ok

        fs.readFile('www/index.html', function (err, databuffer) {
            if (err) {
                logs.error(err);
            } else {
                response.write(databuffer);
            }
            logs.info("User came online "+response);
            response.end();//end response
            
        });
    } catch (err) {
        logs.error('Catastrophy on index: \n' + err);
    }
}

async function writeresponce(res, filepath) {
    //write files in responses

    try {
        fs.readFile(filepath, function (err, databuffer) {
            if (err) {
                res.writeHead(404);//not okay
                logs.error(err);
            } else {
                res.writeHead(200);//200 ok
                res.write(databuffer);
            }
            res.end();//end response
        })
    } catch (error) {
        logs.error(error);
    }
}

database.initalize();