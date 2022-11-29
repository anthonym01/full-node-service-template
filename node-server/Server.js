
const http = require('http');
const fs = require('fs');

const port = 6889;//testing port

async function notfoundpage(response, url) {
    //404 page goes here

    //placeholder
    response.writeHead(404);
    response.end();
    //response.write('404 ', url, 'not found');
    //console.error('404 not found: ', url);
}

async function writeresponce(response, filepath) {//for files in responses
    try {
        fs.readFile(filepath, function (err, databuffer) {
            if (err) {
                response.writeHead(404);//not okay
                console.error(err);
            } else {
                response.writeHead(200);//200 ok
                response.write(databuffer);
            }
            response.end();
        })
    } catch (error) {
        console.log(error)
    }
}

const server = http.createServer(function (request, response) {///Create server

    console.log('requested Url: ', request.url);

    response.setHeader('Acess-Control-Allow-Origin', '*');//allow access control from client, this will automatically handle most media files

    switch (request.url) {//switching requests is old, its better to use express.js

        case '/': case '/index.html':
            
            try {
                fs.readFile('./www/index.html', function (err, databuffer) {
                    if (err) {
                        response.writeHead(404);//not okay
                        console.error(err);
                    } else {
                        response.writeHead(200, { 'Content-type': 'text/html' });//200 == ok
                        response.write(databuffer);
                    }
                    response.end();
                })
            } catch (error) {
                console.log(error)
            }
            break;

        //A test get
        case '/get/test':

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

        default:

            //These need to be handled manually
            if (request.url.indexOf('.css') != -1) {//requestuested url is a css file
                response.setHeader('Content-type', 'text/css');//Set the header to css, so the client will expects a css document
            } else if (request.url.indexOf('.js') != -1) { //requestuested url is a js file
                response.setHeader('Content-type', 'application/javascript');//Set the header to javascript, so the client will expects a javascript document
            } else if (request.url.indexOf('.html') != -1) {//requestuested url is a html file
                response.setHeader('Content-type', 'text/html');//Set the header to html, so the client will expects a html document
            } else {
                //media handled automatically
            }
            writeresponce(response, request.url.replace('/', 'www/'));
    }

})

server.listen(port, function (err) {//Listen to a port with server

    if (err) {
        console.error(err);
    } else {
        console.log('Listening on port: ', port);
    }

})
