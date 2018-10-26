const URL = require('url').URL;

export class RequestClass {

    public method: string;
    public hostStr: URL;
    public version: string;
    public headers = {};

    constructor(request: string) {

        // Get all lines of the request
        const lines = request.split('\r\n');

        // Remove the last two line, which are just \r\n
        lines.pop(); lines.pop();

        // Extract the request line
        const requestLine = lines[0].split(' ');
        this.method = requestLine[0].toLocaleLowerCase();
        this.hostStr = new URL(requestLine[1]);
        this.version = requestLine[2];

        // Extract the headers
        lines.shift();
        lines.forEach(line => {
            const temp = line.split(":");
            this.headers[temp[0].trim().toLocaleLowerCase()] = temp[1].trim().toLocaleLowerCase();
        });

        // Add the date header
        this.headers["date"] = new Date().toUTCString();
    }

    public headersToString(): string {
        let str = "";

        // Get all object keys
        Object.keys(this.headers).forEach(header => {
            str += this.capitalize(header) + ": " + this.headers[header] + "\r\n";
        });
        return str + "\r\n";
    }

    private capitalize(str: string): string {
        str = str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
        for (let i = 0; i < str.length; ++i) {
            if (str.charAt(i - 1) === '-') {
                str = str.slice(0, i) + str.charAt(i).toLocaleUpperCase() + str.slice(i + 1);
            }
        }
        return str;
    }
}