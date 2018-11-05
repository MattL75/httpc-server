# COMP 445 - Lab 2

Goal of the lab is to create a file server using the net package from node. Anything higher than that is considered too abstract. We are also required to connect to this server using a command-line application like curl that we have previously implemented.


The code is in TypeScript, which is a superset of JavaScript. It runs on Node.js. Instructions on compiling are below, but a working build is currently in the `build` folder.

### Running the Application

1. Clone the repo.
2. Run `npm install`.
1. Run `tsc` to compile.
1. Run `npm link`.
2. Run `httpfs help`.
1. Run `httpfs start -p 8080 -v -d server`.

# Usage

In order to see this server in action, you will need some sort of http client. Curl is a good example of this, but we were also required to design our own client in the scope of the data communication class. It can be found [here](https://github.com/MattL75/comp-445-lab-1). Note that permission from the owner is require to access this repository. Below is a list of commands to be used inside such a client, to interact with the server.

#### GET request on the root

`httpc get http://localhost:8080/ -v`

#### GET request on a .json file

`httpc get http://localhost:8080/test_json.json -v`

#### GET request on a .txt file

`httpc get http://localhost:8080/test_txt.txt -v`

#### POST request on a .json file

`httpc post http://localhost:8080/test_json.json -h Content-Type:application/json -d "{\"Assignment\": 1}" -v`

#### POST request on a .txt file

`httpc post http://localhost:8080/test_txt.txt -h Content-Type:text/plain -d "hello world" -v`

#### Request Security Showcase

If one or two consecutive dots are encountered in the path, they are ignored and the path defaults to the standard one as appointed by the server. This feature was implemented to guarantee the security of other directories in the file system. The command below is a valid test.

`httpc get http://localhost:8080/.././ -v`

`httpc get http://localhost:8080/security-test/ -v`

#### Error Handling Showcase

The example below demonstrates how the server will handle requests for files that do not exist. It will simply divert to a 404 Not Found response, allowing the user to change their request if they so choose.

`httpc get http://localhost:8080/.././test_txt.json -v`