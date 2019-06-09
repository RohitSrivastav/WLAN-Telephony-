var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('mime-types');
var tone = require('touchtone')();
var baudio = require('baudio');
var PeerServer = require('peer').PeerServer;
var peer_server = PeerServer({ port: 9000 });
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
var firefox = require('selenium-webdriver/firefox');
let options = new firefox.Options().addArguments("-headless").setPreference('media.navigator.permission.disabled', true);
var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

var server_id;
var browser = 0;
function hook_switch(number) {
    tone.dial(number);
    baudio(tone.play()).play();
}
function dial_number() {
    tone.dial(phone_number);
    baudio(tone.play()).play();
}
//hook_switch("C");
http.createServer(function (req, res) {
    if (browser == 0) {
        driver.get('http://127.0.0.1:8080/server.html');
        browser = 1 ;
    }
    var q = url.parse(req.url, true);
    console.log(q);
    var filename = "." + q.pathname;
    if (filename == './signal') {
        var service = q.query;
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        if (service.action == 'iamserverbrowser') {
            server_id = service.id;
            console.log(server_id);
        }
        if (service.action == 'server_id') {
            res.write(JSON.stringify({ 'server_id': server_id }));
        }
        if (service.action == 'call') {
            hook_switch('D');
            phone_number = service.phone_number;
            setTimeout(dial_number, 4000);
            res.write(JSON.stringify({ 'status': 'success' }));
        }
        if (service.action == 'end') {
            hook_switch('c');
            res.write(JSON.stringify({ 'status': 'success' }));
        }
        //res.write(JSON.stringify(status));
        res.end();
    }
    if (filename != './signal') {
        if (filename == './')
            filename = './index.html';
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': mime.lookup(filename) });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': mime.lookup(filename) });
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);




