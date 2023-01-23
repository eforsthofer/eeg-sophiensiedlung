#!/bin/bash
#quelle: https://askubuntu.com/questions/519/how-do-i-write-a-shell-script-to-install-a-list-of-applications
set -eu -o pipefail # fail on error and report it, debug all lines

sudo -n true
test $? -eq 0 || exit 1 "Sudo privileges are required to run this script."

echo "Installing packages..."

apt update -y

#install curl
apt install curl -y

#Add package archive of node js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
#install node js (npm is included)
apt install nodejs -y

#install influxdb (https://www.cyberithub.com/how-to-install-influxdb2-on-ubuntu-20-04-lts-step-by-step/#Step_8_Start_InfluxDB_Service)
wget -qO- https://repos.influxdata.com/influxdb.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdb.gpg > /dev/null
export DISTRIB_ID=$(lsb_release -si); export DISTRIB_CODENAME=$(lsb_release -sc)
echo "deb [signed-by=/etc/apt/trusted.gpg.d/influxdb.gpg] https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list > /dev/null
sudo apt update -y
sudo apt install -y influxdb2
systemctl start influxdb
systemctl enable influxdb #start influxdb on boot

#install grafana OSS (https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian/)
sudo apt install -y apt-transport-https
sudo apt install -y software-properties-common wget
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt update -y
sudo apt install -y grafana
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl enable grafana-server.service #start grafana at boot

#npm install ausführen um alle dependencies zu installieren
npm install
npm install pm2 -g

INFLUX_USERNAME="admin"
INFLUX_PASSWORD="admin12345"
#Setup influxdb. If setup is already done, skip this step
influx setup --username $INFLUX_USERNAME --password $INFLUX_PASSWORD --org EEG --bucket Members --retention 4w --force || echo "Influx setup already done - skipping"
echo "token: $(influx auth list | sed -n 2p | awk '$3>10 {print $4}')" > ./server/persistence/influxToken.yaml


#grafana einrichten und dashboard importieren


#installation fertig
echo "Installation complete."
echo "You can login to influxdb on http://localhost:8086 with username: $INFLUX_USERNAME and password: $INFLUX_PASSWORD"
echo "You can login to grafana on http://localhost:3000 with username: admin and password: admin"
echo "You can start the surplusDistributor with ./run_surplusDistributor.sh"