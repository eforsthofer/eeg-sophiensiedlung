#! /bin/bash

ping -c 2 10.0.0.99
ping -c 2 10.0.0.98
ping -c 2 10.0.0.97

systemctl status mariadb

systemctl status mosquitto

ps aux |grep python

systemctl status grafana-server

