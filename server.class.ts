import { RequestClass } from './request.class';

const net = require('net');
const fs = require('fs');

export class HttpServer {

    public port;
    public directoryPath;
    public debug;

    public start(path: string, port: number = 8080, debug: boolean = false): void {
        this.port = port;
        this.directoryPath = path;
        this.debug = debug;
        const server = net.createServer(conn => {
            console.log('New client from %j', conn.address());
            conn.on('data', buf => {
                    conn.write(this.processRequest(buf));

                    // Always close
                    conn.destroy();
                })
                .on('error', err => {
                    console.log('socket error %j', err);
                    conn.destroy();
                })
                .on('end', () => {
                    conn.destroy();
                });
        }).on('error', err => {
                // Handle errors here
                throw err;
            });

        server.listen({port: port}, () => {
            console.log('Server listening at ' + server.address().address);
        });
    }

    private processRequest(request: string): string {
        let req: RequestClass;

        // Make sure the request is good
        try {
            req = new RequestClass(request);
        } catch (e) {
            return "HTTP/1.0 400 Bad Request";
        }

        if (req.method === "get") {
            return this.get(req);
        } else if (req.method === "post") {
            return this.post(req);
        } else {
            return "HTTP/1.0 400 Bad Request"
        }
    }

    private get(req: RequestClass): string {
        const path = "server" + req.hostStr.pathname;

        // List directory
        if (path === "server/") {
            fs.readdir(path, (items) => {
                if (items.length === 0) {
                    return "Directory is empty.";
                }
                let str = "";
                items.forEach(item => {
                    str += item + "\r\n";
                });

                // Need full thing
                return this.defaults() + str + "\r\n";
            });
        } else {
            // Get contents
            return ""
        }
    }

    private post(req: RequestClass): string {
        return "";
    }

    private defaults(): string {
        return "HTTP/1.0 200 OK\r\nConnection: close\r\nServer: local 1.0\r\nDate: " + new Date().toUTCString() + "\r\n\r\n";
    }
}