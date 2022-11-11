var http = require('http');

var url = require('url');

let fs = require('fs');

var qs = require('qs');

var handlers = {};

handlers.profile = ((req, res) => {
    var data = ''
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', () => {
        const user = qs.parse(data)
        fs.readFile('./view/profile.html', "utf-8" ,(err, datahtml) => {
            if (err) console.log(err)
            else {
                datahtml = datahtml.replace('{email}', user.email);
                datahtml = datahtml.replace('{password}', user.password);

                res.writeHead(200, {'Content-type': 'text/html'})
                res.write(datahtml);
                return res.end();
            }
        })
    })
})

handlers.login = ((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('./view/login.html', (err, data) => {
            if (err) console.log(err)
            else {
                res.writeHead(200, {'Content-type': 'text/html'})
                res.write(data);
                return res.end()
            }
        })
    } else if (req.url === '/profile') {
        path(req, res);
    }
})

handlers.home = ((req, res) => {
    if (req.url === '/login') {
        path(req, res)
    } else {
        fs.readFile('./view/home.html', (err, data) => {
            if (err) console.log(err)
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }
})

handlers.notFound = ((req, res) => {
    fs.readFile('./view/notfound.html', (err, data) => {
        if (err) console.log(err)
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        }
    })
})

var router = {
    'home': handlers.home,
    'login': handlers.login,
    'profile': handlers.profile
}

function path(req, res) {
    var parseUrl = url.parse(req.url, true);
    var path = parseUrl.pathname;
    var trimPath = path.replace(/^\/+|\/+$/g, '');

    var chooseHandler = (typeof router[trimPath] !== "undefined") ? router[trimPath] : handlers.notFound;
    chooseHandler(req, res);
}

var server = http.createServer(function (req, res) {
    path(req, res);
})

server.listen(3000, function () {
    console.log("the server is listening on port 3000 now ");
})