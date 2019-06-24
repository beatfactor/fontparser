# docker-geckodriver

Includes

* GeckoDriver (Latest)
* Firefox (Latest Stable)

## Building the Docker Image

You can build the image by either building from GitHub or cloning the repository.

```
docker build -t docker-geckodriver:latest .
```

## Usage

The most basic usage is to run the container and expose the GeckoDriver port on all interfaces.

```
docker run --name geckodriver -P -d docker-geckodriver:latest
```

If you want to restrict the ports to your local environment, you can do so using `-p`.

```
docker run --name geckodriver -p 127.0.0.1::4444 docker-geckodriver:latest
```

## Based on
https://github.com/SeleniumHQ/docker-selenium/blob/master/Base/Dockerfile
https://github.com/SeleniumHQ/docker-selenium/blob/master/NodeFirefox/Dockerfile
