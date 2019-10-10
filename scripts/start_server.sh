#!/bin/bash

chown -R ubuntu:ubuntu /home/ubuntu/rudder-transformer
cd /home/ubuntu/rudder-transformer
npm install
systemctl daemon-reload
systemctl enable dest-transformer.service
systemctl restart dest-transformer.service
