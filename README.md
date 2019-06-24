# Webflow FontParser

## Introduction
The API service is built with `express` and uses Mozilla's [Webdriver](https://www.w3.org/TR/webdriver1/) compatible service [Geckodriver](https://github.com/mozilla/geckodriver).

Webdriver is a W3C specification for defining a common interface that a browser should expose for automation purposes.

The Geckodriver service runs inside a docker container, together with the Firefox browser.

### Operation
The API service runs side-by-side with the Geckodriver service. The API service sends commands to a Firefox browser via HTTP, through the Geckodriver service.

### Loading a URL
The API service first loads the desired URL in Firefox and then starts traversing the DOM nodes. 

Traversing is possible by either performing a __depth-first__ search (DFS) or a __breadth-first__ search (BFS).
This is specified using the `mode` query string parameter.

### API

#### __`GET /parseFonts`__
__Params:__
- `url` - the url to load
- `mode` - can be either `dfs` (default) or `bfs`

## Building 
The FontParser service requires [Docker](https://www.docker.com/) with __docker-compose__ to be installed. 

Clone the project, build and run with docker-compose.

```sh
$ docker-compose build
$ docker-compose up
```

The service is running at `http://localhost:3100/parseFonts`.

## Example
```sh
$ curl http://localhost:3100/parseFonts?url=http://test_server:9100
```

## Running the tests
The tests contain a test service. There is also a test compose file which runs the test server together with the other services.

First build the test project:
```sh
$ cd apiservice
$ npm install
$ npm run build
```

Then run the tests:
```sh
$ npm test
```

Due to the high complexity volume involved in this project, only integration tests have been written.
