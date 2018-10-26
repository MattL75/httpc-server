#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_class_1 = require("./server.class");
var program = require('commander');
var http = new server_class_1.HttpServer();
// Help command
program
    .command('help [cmd]')
    .description('get help for general usage or a specific command.')
    .action(function () {
    console.log('');
    console.log('httpfs is simple file server.');
    console.log('Usage:');
    console.log('    httpfs start [-v] [-p PORT] [-d PATH-TO-DIR]');
    console.log('The commands are:');
    console.log('    -v     Prints debugging messages.');
    console.log('    -p     Specifies the port number that the server will listen and serve at. Default is 8080.');
    console.log('    -d     Specifies the directory that the server will use to read/write requested files. Default is the current directory when launching the application.');
    console.log('');
    console.log('Use httpc help [command] for more information about a command.');
});
// Start command
program
    .command('start')
    .description('command to start the server.')
    .option('-v, --verbose', 'Defines debug.')
    .option('-p, --port <port>', 'Port number')
    .option('-d, --directory <directory>', 'Directory path.')
    .action(function (host, options) {
    var debug = program.rawArgs.includes('-v');
    http.start(host.directory, host.port, debug);
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map