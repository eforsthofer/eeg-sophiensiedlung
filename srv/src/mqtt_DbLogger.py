#!/usr/bin/python -u

import mysql.connector as mariadb
import paho.mqtt.client as mqtt
import ssl
import datetime

#mariadb_connection = mariadb.connect(user='USER', password='PW', database='mqtt')
mariadb_connection = mariadb.connect(user='mqtt', password='mqtt', database='tmpdb')

cursor = mariadb_connection.cursor()

# MQTT Settings 
MQTT_Broker = "192.168.1.140"
MQTT_Broker = "192.168.1.102"
MQTT_Broker = "10.0.0.99"
MQTT_Port = 1883 #8883
Keep_Alive_Interval = 60
MQTT_Topic = "/home/power/usage"#"/weather/pywws/#"

# Subscribe
def on_connect(client, userdata, flags, rc):
  mqttc.subscribe(MQTT_Topic, 0)

def on_message(mosq, obj, msg):
  # Prepare Data, separate columns and values
  powerPlus, powerMinus, energyPlus, energyMinus, timeStamp, deviceid, l1v, l2v, l3v, l1c, l2c, l3c = 0,0,0,0,0,0,0,0,0,0,0,0
  now = datetime.datetime.utcnow()
  nowStr = now.strftime('%Y-%m-%d %H:%M:%S.%f')
  try:
    payload = str(msg.payload).removesuffix("'")
    payload = payload.removeprefix("b'")
    values = payload.split(";")
    timeStamp = values[0] #unused
    deviceid = values[1]
    powerPlus = float(values[2])
    powerMinus = float(values[3])
    l1v = float(values[4])
    l2v = float(values[5])
    l3v = float(values[6])
    l1c = float(values[7])
    l2c = float(values[8])
    l3c = float(values[9])
    energyPlus = float(values[10])
    energyMinus = float(values[11])
  except Exception as e:
    print("Error: parsing mqtt payload: \"{}\"".format(msg.payload) + "\r\n" + str(e))
    return
  
  #create table for deviceId
  deviceid = "".join(deviceid.split()) # trim all white spaces and special chars
  if (len(deviceid) < 2 or deviceid.isspace()):
    print("error, empty deviceid")
    return

  createTableCmd = "create table SM_" + deviceid + " (id int unsigned primary key auto_increment, \
    ts datetime, deviceid char(20), \
     powerin float, powerout float, energyin float, energyout float, l1v float, l2v float, l3v float \
, l1c float, l2c float, l3c float) auto_increment = 1;"
  try:
    cursor.execute(createTableCmd)
  except:
    pass

  #Inser values into table
  # sql = "INSERT INTO SM_" + deviceid + " (ts, data) VALUES (%s, %s)"
  sql = "INSERT INTO SM_" + deviceid + " (ts, deviceid, powerin, powerout, energyin, energyout, l1v, l2v, l3v, l1c, l2c, l3c) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

  # Save Data into DB Table
  try:
      cursor.execute(sql, (now, deviceid, powerPlus, powerMinus, energyPlus, energyMinus, l1v, l2v, l3v, l1c, l2c, l3c))# msg_dict.values())
  except mariadb.Error as error:
      print("Error: {}".format(error))
  mariadb_connection.commit()

def on_subscribe(mosq, obj, mid, granted_qos):
  pass

mqttc = mqtt.Client()

# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_subscribe = on_subscribe

# Connect
#mqttc.tls_set(ca_certs="ca.crt", tls_version=ssl.PROTOCOL_TLSv1_2)
mqttc.connect(MQTT_Broker, int(MQTT_Port), int(Keep_Alive_Interval))

# Continue the network loop & close db-connection
mqttc.loop_forever()
mariadb_connection.close()
