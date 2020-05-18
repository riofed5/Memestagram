const https = require('https');
const fs = require('fs');
const http = require('http');

//Listening connection
const options = {
    key: fs.readFileSync('./ca.key'),
    cert: fs.readFileSync('./ca.crt')
};

module.exports = (app) => {
    //for HTTPS
    https.createServer(options, app).listen(8000);

    //For HTTP
    http.createServer((req, res) => {
        res.writeHead(301, {'Location': 'https://localhost:8000' + req.url});
        res.end();
    }).listen(2000);
};