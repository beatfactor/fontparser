#!/bin/bash

function shutdown {
  kill -s SIGTERM $NODE_PID
  wait $NODE_PID
}

# https://github.com/SeleniumHQ/docker-selenium/issues/184
function get_server_num() {
  echo $(echo $DISPLAY | sed -r -e 's/([^:]+)?:([0-9]+)(\.[0-9]+)?/\2/')
}

rm -f /tmp/.X*lock

SERVERNUM=$(get_server_num)

xvfb-run -n $SERVERNUM  --server-args="-screen 0 $SCREEN_GEOMETRY -ac +extension RANDR" \
    geckodriver -v --host="0.0.0.0" --port=$PORT &
NODE_PID=$!

trap shutdown SIGTERM SIGINT
wait $NODE_PID


#while true; do sleep 1000; done
