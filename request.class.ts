const URL = require('url').URL;

export class RequestClass {

    public method: string;
    public hostStr: URL;
    public version: string;
    public headers: Header[];

    constructor(request: string) {

        // Get all lines of the request
        const lines = request.split('\r\n');

        // Remove the last line, which is just \r\n
        lines.pop();

        // Extract the request line
        const requestLine = lines[0].split(' ');
        this.method = requestLine[0].toLocaleLowerCase();
        this.hostStr = new URL(requestLine[1]);
        this.version = requestLine[2];

        // Extract the headers
        lines.shift();
        lines.forEach(line => {
            const temp = line.split(":");
            this.headers.push(new Header(temp[0].trim(), temp[1].trim()));
        });
    }

    public headersToString(): string {
        let str = "";
        this.headers.forEach(header => {
            str += header.name + ": " + header.value + "\r\n";
        });
        return str + "\r\n";
    }
}

class Header {
    constructor(public name: string, public value: string) {}
}