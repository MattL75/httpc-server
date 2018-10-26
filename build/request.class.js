"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require('url').URL;
var RequestClass = /** @class */ (function () {
    function RequestClass(request) {
        var _this = this;
        this.headers = {};
        // Get all lines of the request
        var lines = request.split('\r\n');
        // Remove the last two line, which are just \r\n
        lines.pop();
        lines.pop();
        // Extract the request line
        var requestLine = lines[0].split(' ');
        this.method = requestLine[0].toLocaleLowerCase();
        this.hostStr = new URL(requestLine[1]);
        this.version = requestLine[2];
        // Extract the headers
        lines.shift();
        lines.forEach(function (line) {
            var temp = line.split(":");
            _this.headers[temp[0].trim().toLocaleLowerCase()] = temp[1].trim().toLocaleLowerCase();
        });
        // Add the date header
        this.headers["date"] = new Date().toUTCString();
    }
    RequestClass.prototype.headersToString = function () {
        var _this = this;
        var str = "";
        // Get all object keys
        Object.keys(this.headers).forEach(function (header) {
            str += _this.capitalize(header) + ": " + _this.headers[header] + "\r\n";
        });
        return str + "\r\n";
    };
    RequestClass.prototype.capitalize = function (str) {
        str = str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
        for (var i = 0; i < str.length; ++i) {
            if (str.charAt(i - 1) === '-') {
                str = str.slice(0, i) + str.charAt(i).toLocaleUpperCase() + str.slice(i + 1);
            }
        }
        return str;
    };
    return RequestClass;
}());
exports.RequestClass = RequestClass;
//# sourceMappingURL=request.class.js.map