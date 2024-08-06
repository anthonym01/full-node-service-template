//'node Server.js'
/*
    dependencies  for a Node.js server using Express framework.
*/

const port = 8082;//port for the server 80, 443, 8082
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const logs = require('./logger');
const database = require('./database');

logs.initalize();//initalize logger
logs.info('Server starting');//log server start

//bind root path to /www
app.use(express.static('www')).listen(() => {
    try {
        database.initalize();//initalize database

    } catch (error) {
        logs.error('Catastrophy on server start: ', error);
    }
});

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
            logs.info('Posted : ', JSON.parse(data));
            res.end(JSON.stringify({ test: "test post received" }));
        });
    } catch (error) {
        logs.error('Catastrophy on test post: ', err);
    }
});

app.listen(port, () => {
    logs.info('Running on port ', port);
    logs.info('Process ID: ', process.pid);
    logs.info('Process path: ', process.cwd());
})//Listen for requests, this starts the server

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
