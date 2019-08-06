#!/bin/bash

# Stop all servers and start the server as a daemon
chown -R ubuntu:ubuntu /home/ubuntu/rudder-transformer

cd /home/ubuntu/rudder-transformer
sudo -u ubuntu npm install
sudo -u ubuntu pm2 stop all
sudo -u ubuntu pm2 start echoServer.js
sudo -u ubuntu pm2 start transformerIndex.js
