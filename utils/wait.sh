#!/usr/bin/env bash
TIMEOUT=15
QUIET=0

usage() {
  echo "Usage: $0 host:port [-t timeout] [-- command args]"
  exit 1
}

wait_for() {
  local hostport=$1
  local timeout=$2

  host=${hostport%:*}
  port=${hostport#*:}

  echo "Waiting for $host:$port for up to ${timeout}s..."
  for (( i=0; i<timeout; i++ )); do
    nc -z "$host" "$port" && return 0
    sleep 1
  done
  return 1
}

if [ $# -lt 1 ]; then
  usage
fi

HOSTPORT=$1
shift

if ! wait_for "$HOSTPORT" "$TIMEOUT"; then
  echo "Timeout occurred after waiting $TIMEOUT seconds for $HOSTPORT" >&2
  exit 1
fi

# Execute the command if provided
if [ "$#" -gt 0 ]; then
  exec "$@"
fi
