#!/bin/bash

chown -R ubuntu:ubuntu /home/ubuntu/rudder-transformer
systemctl enable user-transformer.service
systemctl enable dest-transformer.service
systemctl restart user-transformer.service
systemctl restart dest-transformer.service
