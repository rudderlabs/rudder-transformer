#!/bin/sh
# Healthcheck script for Rudder Transformer
wget --no-verbose --tries=5 --spider http://localhost:9090/health || exit 1
