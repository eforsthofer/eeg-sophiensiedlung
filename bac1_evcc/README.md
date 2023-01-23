# Surplus distribution inside energy communities

This project consists of several packages:
- **Server**: Main part, which is responsible for communication with evcc instances and deciding, which households get surplus energy assigned to raise the loading power of electric vehicles
- **MQTT**: This is the MQTT-Formatter, that receives the MQTT-messages from the ESP32 (converts M-Bus to MQTT) and sends it to EVCC
- For testing the Server and MQTT-formatter, a **simulator** has been created. The simulator is able to simulate smart-meters wallboxes and photovoltaik devices for communication with EVCC. The folder **evcc** is also just for testing. The **YAMLTransformer** can automatically create configuration files for evcc (also only for testing).
- **install.sh**: With this script, the surplus distributor with all its dependencies can automatically be installed on a debian system (e.g. a raspberry pi).
- To start the simulator or the surplus distributor, just run **run_simulator.sh** or **run_surplusDistributor.sh**

Installation instructions:
- Run the file install.sh and note the credentials for InfluxDB and Grafana that are displayed at the end of the installation
- Edit the config.yaml in the folder server/
- If you do not have running evcc-instances with real connected devices, start run_simulator.sh for simulating some evcc instances
- If evcc is already running at your and other energy community members houses, just leave them as they are. No configurations have to be made there.
- To distribute surplus energy, start run run_surplusDistributor.sh
- Open InfluxDB (localhost:8086) and login with admin:admin12345. Create a new API-Token for Grafana and copy it to the clipboard
- Open Grafana (localhost:3000) and login with admin:admin. Add InfluxDB as a new datasource (Query Language: InfluxQL, URL: http://localhost:8086, Custom HTTP Headers: {Header: Authorization, Value: Token <copiedToken>}, Database: Members, User: admin)
- Import the dashboards from grafanaDashboards/ to Grafana (if the dashboards do show nothing, disable and enable a query shortly and it will display data (Grafana bug??))


