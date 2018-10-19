# COMP 445 - Lab 1

Goal of the lab is to create an HTTP library using sockets. For this purpose, I have used the 'net' package from Node. Furthermore, we are required to create a CURL-like command-line application.


The code is in TypeScript, which is a superset of JavaScript. It runs on Node.js. Instructions on compiling are below, but a working build is currently in the `build` folder.

### Running the Application

1. Clone the repo.
2. Run `npm install`.
1. Run `tsc` to compile.
2. Run `httpc help`.

# Usage

### GET DATA
`httpc get "http://httpbin.org/get?assignment=1&tutor=john"`

### GET VERBOSE
`httpc get "http://httpbin.org/get?assignment=1&tutor=john" -v`

### POST WITH DATA
`httpc post http://httpbin.org/post -h Content-Type:application/json -d "{\"Assignment\": 1}"`

### POST WITH FILE
`httpc post http://httpbin.org/post -h Content-Type:application/json -f test.txt`

### POST WITH FILE VERBOSE
`httpc post http://httpbin.org/post -h Content-Type:application/json -f test.txt -v`

### POST WITH OUTPUT FILE
`httpc post http://httpbin.org/post -h Content-Type:application/json -f test.txt -v -o output.txt`

### GET WITH REDIRECT
`httpc get "http://httpbin.org/redirect-to?url=http://httpbin.org/get?argument=1&status_code=302" -r -v`
