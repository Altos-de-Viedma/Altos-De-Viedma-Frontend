#!/bin/bash


envsubst < /usr/share/nginx/html/.env > /usr/share/nginx/html/.env.tmp
mv /usr/share/nginx/html/.env.tmp /usr/share/nginx/html/.env


exec "$@"