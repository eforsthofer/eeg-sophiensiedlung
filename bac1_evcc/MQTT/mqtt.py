#!/usr/bin/python -u


import paho.mqtt.client as mqtt
import ssl
import datetime

# MQTT Settings 
MQTT_Broker = "127.0.0.1"
MQTT_Port = 1883 
Keep_Alive_Interval = 60
MQTT_TOPIC_ESP32 = "/home/power/usage"
MQTT_TOPIC_EVCC = "/gridPower"

# Subscribe
def on_connect(client, userdata, flags, rc):
  mqttc.subscribe(MQTT_TOPIC_ESP32, 0)

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
  
 
  deviceid = "".join(deviceid.split()) # trim all white spaces and special chars
  if (len(deviceid) < 2 or deviceid.isspace()):
    print("error, empty deviceid")
    return

    #Send mqtt message to evcc with specific device id
  try:
    if(powerPlus > 0):
      mqttc.publish(deviceid + MQTT_TOPIC_EVCC, str(powerPlus))
    else:
      mqttc.publish(deviceid + MQTT_TOPIC_EVCC, str(-powerMinus))
  except:
    pass

  

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