"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_class_1 = require("./request.class");
var net = require('net');
var fs = require('fs');
var HttpServer = /** @class */ (function () {
    function HttpServer() {
    }
    HttpServer.prototype.start = function (path, port, debug) {
        var _this = this;
        if (path === void 0) { path = 'server'; }
        if (port === void 0) { port = 8080; }
        if (debug === void 0) { debug = false; }
        // Constructor methods
        this.port = port;
        this.directoryPath = path;
        this.debug = debug;
        // Actual server creation
        var server = net.createServer(function (conn) {
            // Information message
            console.log('New client from %j', conn.address());
            // Event handlers
            conn
                .on('data', function (buf) {
                // Process request and send response
                if (debug) {
                    console.log('\nClient sent the following data:');
                    console.log(buf.toString());
                }
                // Write to the client
                _this.processRequest(buf.toString(), conn);
            })
                .on('error', function (err) {
                console.log('socket error %j', err);
                console.log(err);
                conn.destroy();
            })
                .on('end', function () {
                conn.destroy();
            });
        }).on('error', function (err) {
            // Handle errors here
            console.log('Error: ' + err);
            throw err;
        });
        server.listen({ port: port }, function () {
            if (server.address().address == '::') {
                console.log('Server listening at http://localhost:' + port + '.');
            }
            else {
                console.log('Server listening at ' + server.address().address + ":" + port);
            }
        });
    };
    HttpServer.prototype.processRequest = function (request, conn) {
        if (this.debug)
            console.log('Client issued a request...');
        var req;
        // Make sure the request is good
        try {
            req = new request_class_1.RequestClass(request);
            if (this.debug)
                console.log('The request format is GOOD.');
        }
        catch (e) {
            if (this.debug) {
                console.log('Request format is BAD.');
                console.log(e);
            }
            this.write(this.result(req, 400), conn);
        }
        // Identify request type
        if (req.method === "get") {
            if (this.debug)
                console.log('Request type is GET.');
            this.get(req, conn);
        }
        else if (req.method === "post") {
            if (this.debug)
                console.log('Request type is POST.');
            this.post(req, conn);
        }
        else {
            if (this.debug)
                console.log('BAD request type.');
            this.write(this.result(req, 400), conn);
        }
    };
    HttpServer.prototype.get = function (req, conn) {
        var _this = this;
        var path = this.directoryPath + req.hostStr.pathname;
        if (this.debug)
            console.log('Path is ' + path + '.');
        // List directory
        if (req.hostStr.pathname === "/") {
            if (this.debug)
                console.log('Request is for DIRECTORY-CONTENT.\n');
            // Get all files in directory
            var str_1 = "";
            fs.readdir(path, function (err, items) {
                // Check if empty
                if (items.length === 0) {
                    _this.write(_this.result(req, 200, "Directory is empty."), conn);
                }
                // Get all items
                items.forEach(function (item, index) {
                    if (index === items.length - 1) {
                        str_1 += item;
                    }
                    else {
                        str_1 += item + "\r\n";
                    }
                });
                // Set appropriate headers
                req.headers['content-type'] = 'text/plain';
                req.headers['content-disposition'] = 'inline';
                // Send results
                _this.write(_this.result(req, 200, str_1), conn);
            });
        }
        else {
            if (this.debug)
                console.log('Request is for FILE-CONTENT.\n');
            // Extract extension
            var ext_1 = path.split('.')[1];
            // Return error if no extension
            if (!ext_1) {
                this.write(this.result(req, 400), conn);
                return;
            }
            // Get contents
            fs.readFile(path, function (err, data) {
                if (err) {
                    _this.write(_this.result(req, 404), conn);
                    return;
                }
                // Assign content-type
                switch (ext_1) {
                    case 'json':
                        req.headers['content-type'] = 'application/json';
                        break;
                    case 'js':
                        req.headers['content-type'] = 'application/javascript';
                        break;
                    case 'ts':
                        req.headers['content-type'] = 'application/javascript';
                        break;
                    case 'xml':
                        req.headers['content-type'] = 'application/xml';
                        break;
                    case 'txt':
                        req.headers['content-type'] = 'text/plain';
                        break;
                    case 'html':
                        req.headers['content-type'] = 'text/html';
                        break;
                    case 'css':
                        req.headers['content-type'] = 'text/css';
                        break;
                    case 'csv':
                        req.headers['content-type'] = 'text/csv';
                        break;
                }
                req.headers['content-disposition'] = 'inline';
                _this.write(_this.result(req, 200, data), conn);
            });
        }
    };
    HttpServer.prototype.post = function (req, conn) {
        var _this = this;
        var path = this.directoryPath + req.hostStr.pathname;
        // Extract extension
        var ext = path.split('.')[1];
        // Return error if no extension
        if (!ext) {
            this.write(this.result(req, 404), conn);
            return;
        }
        // Get contents
        fs.writeFile(path, req.data, function (err) {
            if (err) {
                _this.write(_this.result(req, 404), conn);
                return;
            }
            _this.write(_this.result(req, 200), conn);
        });
    };
    HttpServer.prototype.result = function (request, code, data) {
        if (code === void 0) { code = 200; }
        if (!data) {
            data = JSON.stringify({ data: (request.headers['content-type'] === 'application/json' ? (request.data ? JSON.parse(request.data) : "") : (request.data ? request.data : "")), headers: request.headers }, null, "   ");
        }
        // Extract code message
        var codeMsg;
        switch (code) {
            case 200:
                codeMsg = "OK";
                break;
            case 400:
                codeMsg = "Bad Request";
                break;
            case 401:
                codeMsg = "Unauthorized";
                break;
            case 404:
                codeMsg = "Not Found";
                break;
        }
        // Get real results string
        var result = "HTTP/1.0 " + code + " " + codeMsg + "\r\n" + (request != null && request != undefined ? request.headersToString() : '');
        if (data) {
            return result + data + "\r\n\r\n";
        }
        return result;
    };
    HttpServer.prototype.write = function (str, conn) {
        conn.write(str);
        conn.destroy();
    };
    return HttpServer;
}());
exports.HttpServer = HttpServer;
//# sourceMappingURL=server.class.js.map