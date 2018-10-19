#!/usr/bin/env node

//import { HttpLibrary } from './http.class';

let program = require('commander');
//let http = new HttpLibrary();

function collect (val, memo) {
    memo.push(val);
    return memo;
}

// Help command
program
    .command('help [cmd]')
    .description('get help for general usage or a specific command.')
    .action(function (cmd) {
        if (cmd === undefined || cmd === null) {
            console.log('');
            console.log('httpc is a curl-like application, but supports HTTP protocol only.');
            console.log('Usage:');
            console.log('    httpc [command] [arguments]');
            console.log('The commands are:');
            console.log('    get     executes a HTTP GET request and prints the response.');
            console.log('    post    executes a HTTP POST request and prints the response.');
            console.log('    help    prints this screen.');
            console.log('');
            console.log('Use httpc help [command] for more information about a command.');
        } else if (cmd === 'get' || cmd === 'GET') {
            console.log('');
            console.log('Usage: httpc get [url] [-v] [-h key:value]');
            console.log('');
            console.log('Get executes a HTTP GET request for a given url.');
            console.log('    -v              prints the detail of the response such as protocol, status and headers.');
            console.log('    -r              allows redirects from http requests.');
            console.log('    -h key:value    associates headers to the request with the specified format.');
            console.log('    -o file         sets an output file. Must have extension.');
        } else if (cmd === 'post' || cmd === 'POST') {
            console.log('');
            console.log('Usage: httpc post [url] [-v] [-h key:value] [-d inline-data] [-f file]');
            console.log('');
            console.log('Get executes a HTTP POST request for a given url.');
            console.log('    -v              prints the detail of the response such as protocol, status and headers.');
            console.log('    -r              allows redirects from http requests.');
            console.log('    -h key:value    associates headers to the request with the specified format.');
            console.log('    -d string       associates an inline data to the body of the request.');
            console.log('    -f file         associates the content of a file to the body of the request.');
            console.log('    -o file         sets an output file. Must have extension.');
            console.log('');
            console.log('Either [-d] or [-f] can be used, but not both.')
        } else if (cmd === 'help' || cmd === 'HELP') {
            console.log('');
            console.log('Used to gain information about the application.')
        } else {
            console.log('');
            console.log('Command not found.');
        }
    });

// Get command
program
    .command('get <host>')
    .description('command to initiate a get request.')
    .option('-v, --verbose', 'Defines verbosity.')
    .option('-r, --redirect', 'Allow redirects.')
    .option('-o, --output <output>', 'Output file.')
    .option('-h, --header <header>', 'Request headers.', collect, [])
    .action(function (host, options) {
        const verbose = program.rawArgs.includes('-v');
        const redirect = program.rawArgs.includes('-r');
        http.get(verbose, redirect, options.header, host, options.output);
    });

// Post command
program
    .command('post <host>')
    .description('command to initiate a post request.')
    .option('-v, --verbose', 'Defines verbosity.')
    .option('-r, --redirect', 'Allow redirects.')
    .option('-f, --file <file>', 'File data.')
    .option('-o, --output <output>', 'Output file.')
    .option('-d, --data <data>', 'Inline data.')
    .option('-h, --header <header>', 'Request headers.', collect, [])
    .action(function (host, options) {
        const verbose = program.rawArgs.includes('-v');
        const redirect = program.rawArgs.includes('-r');
        if (options.file && options.data) {
            console.log('');
            console.log('Cannot use both -f and -d for a POST request.');
        } else {
            http.post(verbose, redirect, options.header, host, options.file, options.data, options.output);
        }
    });

program.parse(process.argv);