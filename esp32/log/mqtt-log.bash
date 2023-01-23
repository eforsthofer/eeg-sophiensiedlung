#! /bin/bash

# 1. Install screen
sudo apt-get install screen

# 2. Start screen Session
screen
# List Sessions
# $ screen -list

# 3. Start mqtt Log
cd ~/git/eeg-sophiensiedlung/esp32/log
mosquitto_sub -h 10.0.0.99 -p 1883 -t /# | ./eegs2evcc.py | tee -a mqtt.log

# 4. Trennen der aktuellen screen-Sitzung
# Strg + A , gefolgt von D zum Trennen (detach) der Verbindung zur aktuellen Sitzung, die Sitzung läuft dann im Hintergrund weiter.

