#!/bin/bash

# Stop all servers and start the server as a daemon
cd /home/ubuntu
chown -R ubuntu:ubuntu /home/ubuntu/transformer
sudo -u ubuntu npm install
sudo -u ubuntu pm2 stop all
sudo -u ubuntu pm2 start echoServer.js && npm -- start
