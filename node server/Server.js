//run 'node server.js' to run

const http = require('http');
const fs = require('fs');
const port = 1999;//port for the server

async function notfoundpage(response, url) {//404 page goes here
    response.writeHead(404);
    response.write('404 page not , code: ', url);
    console.error('File not found: ', url)
}

///Create server
const server = http.createServer(function (request, response) {

    console.log('requested Url: ', request.url);

    response.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

    switch (request.url) {

        case '/': case '/index.html':

            try {
                response.writeHead(200, { 'Content-type': 'text/html' });//200 ok
                fs.readFile('index.html', function (err, databuffer) {
                    if (err) {
                        notfoundpage(response, 'index');
                    } else {
                        response.write(databuffer);
                    }
                    response.end();//end response
                })
            } catch (err) {
                console.log('Catastrophy on index: ', err)
            }

            break;

        case '/get/test'://A test get

            try {
                console.log('test get from server');
                response.writeHead(200, { 'Content-type': 'application/json' });
                response.end(JSON.stringify({ test: 'Server is okay' }))
            } catch (error) {
                console.log('Catastrophy on test get: ', err)
            }

            break;

        case '/post/test'://A test post

            console.log('test post to server');
            request.on('data', function (data) {
                console.log('Posted: ', JSON.parse(data))
                response.end()
            });

            break;

        default://Component of webpage

            if (request.url.indexOf('.css') != -1) {//requestuested url is a css file
                response.setHeader('Content-type', 'text/css');//Set the header to css, so the client will expects a css document
            } else if (request.url.indexOf('.js') != -1) { //requestuested url is a js file
                response.setHeader('Content-type', 'application/javascript');//Set the header to javascript, so the client will expects a javascript document
            } else if (request.url.indexOf('.html') != -1) {//requestuested url is a html file
                response.setHeader('Content-type', 'text/html');//Set the header to html, so the client will expects a html document
            } else {
                //media handled automatically
            }

            fs.readFile(request.url.replace('/', ''), function (err, data) {//read request.url.replace('/', '') file
                if (err) {//error because file not found/inaccesible
                    notfoundpage(response, request.url);//show 404 page
                } else {
                    response.writeHead(200);//200 ok
                    response.write(data);//responsepond with data from file
                }
                response.end();//end responseponse
            })
    }

})

server.listen(port, function (err) {//Listen to a port with server

    if (err) {
        console.error(err);
    } else {
        console.log('Listening on port: ', port);
    }

})
