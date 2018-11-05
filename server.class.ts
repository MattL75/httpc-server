import { RequestClass } from './request.class';

const net = require('net');
const fs = require('fs');

export class HttpServer {

    public port;
    public directoryPath;
    public debug;

    public start(path: string = 'server', port: number = 8080, debug: boolean = false): void {

        // Constructor methods
        this.port = port;
        this.directoryPath = path;
        this.debug = debug;

        // Actual server creation
        const server = net.createServer(conn => {

            // Information message
            console.log('New client from %j', conn.address());

            // Event handlers
            conn
                .on('data', buf => {

                    // Process request and send response
                    if (debug) {
                        console.log('\nClient sent the following data:');
                        console.log(buf.toString());
                    }

                    // Write to the client
                    this.processRequest(buf.toString(), conn);
                })
                .on('error', err => {
                    console.log('socket error %j', err);
                    console.log(err);
                    conn.destroy();
                })
                .on('end', () => {
                    conn.destroy();
                });
        }).on('error', err => {
            // Handle errors here
            console.log('Error: ' + err);
            throw err;
        });

        server.listen({port: port}, () => {
            if (server.address().address == '::') {
                console.log('Server listening at http://localhost:' + port + '.');
            } else {
                console.log('Server listening at ' + server.address().address + ":" + port);
            }
        });
    }

    private processRequest(request: string, conn: any): void {
        if (this.debug) console.log('Client issued a request...');
        let req: RequestClass;

        // Make sure the request is good
        try {
            req = new RequestClass(request);
            if (this.debug) console.log('The request format is GOOD.');
        } catch (e) {
            if (this.debug) {
                console.log('Request format is BAD.');
                console.log(e);
            }
            this.write(this.result(req, 400), conn);
        }

        // Identify request type
        if (req.method === "get") {
            if (this.debug) console.log('Request type is GET.');
            this.get(req, conn);
        } else if (req.method === "post") {
            if (this.debug) console.log('Request type is POST.');
            this.post(req, conn);
        } else {
            if (this.debug) console.log('BAD request type.');
            this.write(this.result(req, 400), conn);
        }
    }

    private get(req: RequestClass, conn: any): void {
        const path = this.directoryPath + req.hostStr.pathname;
        if (this.debug) console.log('Path is ' + path + '.');

        // List directory
        if (req.hostStr.pathname === "/") {
            if (this.debug) console.log('Request is for DIRECTORY-CONTENT.\n');

            // Get all files in directory
            let str = "";
            fs.readdir(path, (err, items) => {

                // Check if empty
                if (items.length === 0) {
                    this.write(this.result(req, 200, "Directory is empty."), conn);
                }

                // Get all items
                items.forEach((item, index) => {
                    if (index === items.length - 1) {
                        str += item;
                    } else {
                        str += item + "\r\n";
                    }
                });

                // Set appropriate headers
                req.headers['content-type'] = 'text/plain';
                req.headers['content-disposition'] = 'inline';

                // Send results
                this.write(this.result(req, 200, str), conn);
            })
        } else {

            if (this.debug) console.log('Request is for FILE-CONTENT.\n');

            // Extract extension
            const ext = path.split('.')[1];

            // Return error if no extension
            if (!ext) {
                this.write(this.result(req, 400), conn);
                return;
            }

            // Get contents
            fs.readFile(path, (err, data) => {
                if (err) {
                    this.write(this.result(req, 404), conn);
                    return;
                }

                // Assign content-type
                switch (ext) {
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

                this.write(this.result(req, 200, data), conn);
            });
        }
    }

    private post(req: RequestClass, conn: any): void {
        const path = this.directoryPath + req.hostStr.pathname;

        // Extract extension
        const ext = path.split('.')[1];

        // Return error if no extension
        if (!ext) {
            this.write(this.result(req, 404), conn);
            return;
        }

        // Get contents
        fs.writeFile(path, req.data, err => {
            if (err) {
                this.write(this.result(req, 404), conn);
                return;
            }

            this.write(this.result(req, 200), conn);
        });
    }

    private result(request: RequestClass, code: number = 200, data?: any): string {

        if (!data) {
            data = JSON.stringify({data: (request.headers['content-type'] === 'application/json' ? (request.data ? JSON.parse(request.data) : "") : (request.data ? request.data : "")), headers: request.headers}, null, "   ");
        }

        // Extract code message
        let codeMsg: string;
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
        const result = "HTTP/1.0 " + code + " " + codeMsg + "\r\n" + (request != null && request != undefined ? request.headersToString() : '');
        if (data) {
            return result + data + "\r\n\r\n";
        }

        return result;
    }

    private write(str: string, conn: any): void {
        conn.write(str);
        conn.destroy();
    }

}