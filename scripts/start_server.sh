#!/bin/bash

# Stop all servers and start the server as a daemon
cd /home/ubuntu/transformer
npm install
pm2 stop all
pm2 start npm -- start 
