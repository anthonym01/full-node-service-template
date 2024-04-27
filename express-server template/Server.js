//'node Server.js'
/*
    dependencies  for a Node.js server using Express framework.
*/

const port = 8080;//port for the server 80, 443, 8080
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const logs = require('./modules/logger');
const database = require('./modules/database');

logs.initalize();//initalize logger
database.initalize();//initalize database

logs.info('Server starting');//log server start
database.does_user_exist('Anthonym').then((result) => {
    logs.info('Does user exist: ', result);
});//check if user exists

app.use(express.static('www'))//bind root path to /www

app.get('/get/test', (req, res) => {//test get
    try {
        logs.info('test get');
        req.on('data', function (data) {
            logs.info('got: ', data);
            res.end(JSON.stringify({ testget: "test get data received" }));
        });
        //res.writeHead(200, { 'Content-type': 'application/json' });
        res.send(JSON.stringify({ test: 'test get is okay' }));
    } catch (error) {
        logs.error('Catastrophy on test get: ', err);
    }
});

app.post('/post/test', (req, res) => {//test post
    //receive more data than a get
    try {
        logs.info('test post to server');
        req.on('data', function (data) {
            logs.info('Posted : ', data);
            res.end(JSON.stringify({ test: "test post received" }));
        });
    } catch (error) {
        logs.error('Catastrophy on test post: ', err);
    }
});

app.listen(port, () => { logs.info('Running on port ', port) })//Listen for requests, this starts the server

async function writeresponce(res, filepath) {
    //write files in responses

    try {
        res.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

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
